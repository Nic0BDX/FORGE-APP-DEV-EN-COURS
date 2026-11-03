#!/usr/bin/env python3
"""Checkpoint Forge : préparation isolée, preuves, reprise et archives atomiques.
Le responsable d’intégration l’exécute seulement lorsque les agents ont gelé leurs fichiers.
"""
from __future__ import annotations
import argparse
import copy
from datetime import datetime
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile
from zoneinfo import ZoneInfo

EXCLUDED = {'.git', '__pycache__', 'node_modules', '.pytest_cache', '.checkpoint.lock', '.checkpoint-pending.json'}

def stamp():
    return datetime.now(ZoneInfo('Europe/Paris')).isoformat(timespec='seconds')

def digest(data):
    return hashlib.sha256(data).hexdigest()

def atomic(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temp = tempfile.mkstemp(prefix='.' + path.name + '-', dir=path.parent)
    try:
        with os.fdopen(fd, 'wb') as stream:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temp, path)
    finally:
        if os.path.exists(temp):
            os.unlink(temp)

def json_bytes(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode()

def files(root):
    result = {}
    for base, dirs, names in os.walk(root):
        dirs[:] = sorted(d for d in dirs if d not in EXCLUDED)
        for name in sorted(names):
            p = Path(base) / name
            rel = p.relative_to(root).as_posix()
            if name in EXCLUDED or name.endswith(('.zip', '.pyc', '.log')):
                continue
            if p.is_symlink():
                raise ValueError('Lien symbolique non archivé : ' + rel)
            result[rel] = p.read_bytes()
    return result

def hashes(data):
    return {key: digest(value) for key, value in data.items()}

def validate_evidence(root, rel):
    p = root / rel
    if not p.resolve().is_relative_to(root) or not p.is_file():
        raise ValueError('Preuve manquante ou externe au projet : ' + rel)
    if p.suffix.lower() == '.json':
        evidence = json.loads(p.read_text())
        if not isinstance(evidence, dict):
            raise ValueError('La preuve JSON doit être un rapport objet.')
        if evidence.get('failed', 0) or evidence.get('failures', 0) or evidence.get('pageErrors') or evidence.get('errors'):
            raise ValueError('La preuve contient un échec non résolu : ' + rel)
        checks = evidence.get('checks', [])
        if any(c.get('status') == 'failed' for c in checks if isinstance(c, dict)):
            raise ValueError('La preuve contient un contrôle échoué : ' + rel)
    return {'path': rel, 'sha256': digest(p.read_bytes())}

def point_text(roadmap, state):
    done = [t for t in roadmap['tasks'] if t['status'] == 'terminee']
    blocked = [t for t in roadmap['tasks'] if t['status'] == 'bloquee']
    current = state.get('current') or 'Aucune : choisir la prochaine tâche utile.'
    lines = ['# Forge — Point de reprise', '', ('**Mode : PAUSE demandée par le propriétaire.** Attendre une nouvelle demande avant de poursuivre.' if state.get('paused') else '**Mode : CONTINU.** Les journées s’enchaînent sans attendre « jour suivant ».'),
        f'Jour en cours : **{roadmap["day"]}**. Dernier checkpoint : **{state["updated_at"]}** (Europe/Paris).',
        f'État du jour : **{"clôturé" if state.get("day_closed") else "en cours"}**.', '',
        '## Tâches terminées — ne pas les refaire', '',
        f'**{len(done)}/{len(roadmap["tasks"])} tâches terminées ({round(len(done)/len(roadmap["tasks"])*100)} %).**', '']
    for day in sorted({t['completed_day'] for t in done}):
        lines.append(f'- Jour {day} : ' + ', '.join(t['id'] for t in done if t['completed_day'] == day) + '.')
    lines += ['', '## Travail exactement en cours', '', f'**Tâche : {current}**', '', state.get('detail', ''), '',
        'Les étapes ci-dessus décrivent les fichiers réellement préparés. Une tâche en cours ne donne aucun crédit partiel.', '',
        '## Prochaine action', '', f'**Prochaine tâche : {state.get("next") or "Choisir 2 à 3 tâches utiles restantes."}**', '',
        state.get('next_command') or 'Relire les dernières preuves et reprendre la tâche en cours avant de modifier les sources.', '',
        '## Preuves du dernier checkpoint', '']
    lines += [f'- `{e["path"]}` · SHA-256 `{e["sha256"]}`' for e in state.get('evidence', [])] or ['- Aucun nouveau test applicatif déclaré à ce checkpoint de progression.']
    lines += ['', '## Archives et procédure de reprise', '',
        '- ZIP courant : `Forge-Actuel.zip` dans le dossier des livrables (`/workspace/artifacts` dans cet environnement).',
        '- Chaque ZIP inclut `Forge/ARCHIVE_MANIFEST.json` avec les empreintes des fichiers. Le fichier `.sha256` voisin vérifie le ZIP entier.',
        '- Les archives `Forge-Jour-N.zip` des journées clôturées sont conservées ; aucune n’est écrasée.',
        '- Avant de commencer la journée suivante, envoyer le message de clôture : lien du ZIP quotidien validé, progression globale et par agent, tâches du jour/en cours/restantes, blocages, journal, AVANCEMENT.html et trois améliorations prévues.',
        '- Si une tâche est encore en cours et non validée, mettre à jour la description de reprise sans publier les sources ; le ZIP courant reste la dernière version testée.',
        '- Si `docs/.checkpoint-pending.json` existe, une publication a été interrompue : inspecter puis exécuter `python3 docs/checkpoint.py --recover` avant toute nouvelle tâche.',
        '- À « reprends » ou « continue », lire ce fichier, `docs/checkpoint.json` et la feuille de route. Ne pas refaire les tâches terminées. Reprendre les étapes indiquées.',
        '- Après chaque tâche testée : appeler `docs/checkpoint.py --complete ID ... --evidence RAPPORT`. Le mode pause reste prioritaire : attendre une nouvelle demande avant de poursuivre.',
        '- Ne pas lancer un checkpoint pendant que d’autres agents modifient les sources ; le script refuse une modification concurrente détectée.',
        '- Quand toutes les tâches sont effectivement terminées, écrire une nouvelle feuille d’au moins 15 tâches utiles. Ne pas déclarer terminés les services indisponibles.', '',
        '## Blocages externes conservés', '']
    lines += [f'- {t["id"]} : {t.get("blocker", t["evidence"])}' for t in blocked]
    lines += ['', '## Environnement', '', '`python3 -m http.server 8080 --bind 127.0.0.1` depuis la racine. Tests Playwright et Chromium (`/usr/bin/chromium`). Le navigateur géré bloque `file://` ; utiliser HTTP sans contourner cette règle.', '']
    return '\n'.join(lines)

def prepare(root, project, args):
    roadmap = json.loads((project / 'docs/roadmap.json').read_text())
    state_path = project / 'docs/checkpoint.json'
    state = json.loads(state_path.read_text()) if state_path.exists() else {'events': []}
    tasks = {t['id']: t for t in roadmap['tasks']}
    for key in [args.complete, args.current, args.next]:
        if key and key not in tasks:
            raise ValueError('Identifiant de tâche inconnu : ' + key)
    if args.complete and tasks[args.complete]['status'] == 'terminee':
        raise ValueError('Tâche déjà terminée ; utiliser --checkpoint, sans la refaire : ' + args.complete)
    if args.complete and not args.evidence:
        raise ValueError('--complete exige au moins une preuve --evidence.')
    evidence = [validate_evidence(root, rel) for rel in args.evidence]
    now = stamp()
    day = args.day or roadmap['day']
    if day < roadmap['day']:
        raise ValueError('Le jour ne peut pas revenir en arrière.')
    mode = 'paused' if state.get('paused') else 'continuous'
    roadmap.update(day=day, date=now[:10], mode=mode)
    if args.complete:
        tasks[args.complete].update(status='terminee', completed_day=day, evidence=' ; '.join(args.evidence))
        tasks[args.complete].pop('blocker', None)
    current = args.current if args.current is not None else state.get('current')
    if current and tasks[current]['status'] == 'terminee':
        current = None
    if current:
        if tasks[current]['status'] == 'bloquee':
            raise ValueError('La tâche courante est bloquée : ' + current)
        tasks[current]['status'] = 'en_cours'
    if args.close_day and any(t['status'] == 'en_cours' for t in tasks.values()):
        raise ValueError('Clôture refusée : il reste une tâche en cours. Conserver un checkpoint, puis terminer ou reporter explicitement la tâche.')
    state.update(mode=mode, day=day, updated_at=now, current=current,
        detail=args.detail or state.get('detail', ''), next=args.next or state.get('next'),
        next_command=args.next_command or state.get('next_command', ''), evidence=evidence,
        day_closed=bool(args.close_day))
    event = {'at': now, 'day': day, 'completed': args.complete, 'current': current, 'detail': state['detail'],
        'evidence': evidence, 'day_closed': bool(args.close_day)}
    state.setdefault('events', []).append(event)
    atomic(project / 'docs/roadmap.json', json_bytes(roadmap))
    atomic(state_path, json_bytes(state))
    atomic(project / 'POINT_DE_REPRISE.md', point_text(roadmap, state).encode())
    done = sum(t['status'] == 'terminee' for t in tasks.values())
    marker = ('<!-- FORGE_CURRENT_START -->\n' + f'**État courant : Jour {day} · {'en pause' if state.get('paused') else 'mode continu'} · {done}/{len(tasks)} tâches terminées ({round(done/len(tasks)*100)} %).**\n\n'
        + f'Dernier point enregistré : {now}. Travail courant : **{current or "aucune tâche active"}**.\n\n'
        + 'Lire [POINT_DE_REPRISE.md](POINT_DE_REPRISE.md) pour reprendre sans refaire les tâches livrées. Archive courante : `Forge-Actuel.zip` ; archives quotidiennes conservées.\n<!-- FORGE_CURRENT_END -->')
    readme = (project / 'README.md').read_text()
    if '<!-- FORGE_CURRENT_START -->' in readme:
        readme = re.sub(r'<!-- FORGE_CURRENT_START -->[\s\S]*?<!-- FORGE_CURRENT_END -->', lambda _: marker, readme)
    else:
        readme = readme.replace('## Ouvrir le projet', marker + '\n\n## Ouvrir le projet', 1)
    atomic(project / 'README.md', readme.encode())
    journal = project / f'JOURNAL_JOUR_{day}.md'
    text = journal.read_text() if journal.exists() else f'# Forge — Journal du Jour {day}\n\nMode continu. Ce journal conserve les tâches testées et les points de reprise de la journée.\n'
    text += f'\n## Checkpoint {now}\n\n'
    if args.complete:
        task = tasks[args.complete]
        agent = next(a['name'] for a in roadmap['agents'] if a['id'] == task['agent'])
        text += f'✅ **{args.complete} — {task["title"]}** · {agent} · terminé Jour {day}.\n\n'
    else:
        text += '🔄 Point de progression enregistré, sans nouvelle tâche déclarée terminée.\n\n'
    text += state['detail'] + '\n\n'
    if evidence:
        text += 'Preuves : ' + ', '.join('`' + e['path'] + '`' for e in evidence) + '.\n\n'
    text += f'Avancement : **{done}/{len(tasks)} = {round(done/len(tasks)*100)} %**. Prochaine tâche : **{state.get("next") or "à choisir"}**.\n'
    if args.close_day:
        text += '\nJournée clôturée et archive quotidienne conservée. Le mode continu poursuit la prochaine journée.\n'
    atomic(journal, text.encode())
    subprocess.run([sys.executable, 'docs/build_progress.py'], cwd=project, check=True, capture_output=True, text=True)
    if (project / 'preview/build-standalone.py').exists():
        subprocess.run([sys.executable, 'preview/build-standalone.py'], cwd=project, check=True, capture_output=True, text=True)
    return roadmap, state

def finish_pending(root, marker):
    pending = json.loads(marker.read_text())
    stage = Path(pending['stage'])
    current = hashes(files(root))
    original = pending['original']
    after = pending['after']
    for name in set(current) | set(original):
        allowed = {original.get(name)}
        if name in pending['changed']:
            allowed.add(after.get(name))
        if current.get(name) not in allowed:
            raise ValueError('Modification concurrente après préparation ; checkpoint conservé, reprise à examiner : ' + name)
    archive = stage / 'snapshot.zip'
    if digest(archive.read_bytes()) != pending['zip_sha256']:
        raise ValueError('Archive temporaire altérée ; publication refusée.')
    output = Path(pending['output'])
    daily = output / f'Forge-Jour-{pending["day"]}.zip'
    if pending['close_day']:
        if daily.exists() and digest(daily.read_bytes()) != pending['zip_sha256']:
            raise ValueError('Archive quotidienne existante protégée : ' + str(daily))
        if not daily.exists():
            os.link(archive, daily)  # Publication atomique, refus d’écraser un fichier existant.
        atomic(daily.with_suffix('.sha256'), (pending['zip_sha256'] + '  ' + daily.name + '\n').encode())
    atomic(output / 'Forge-Actuel.zip', archive.read_bytes())
    atomic(output / 'Forge-Actuel.sha256', (pending['zip_sha256'] + '  Forge-Actuel.zip\n').encode())
    # Le point lisible est publié en dernier. Le marqueur permet de finir après une coupure.
    ordered = sorted(pending['changed'], key=lambda n: n == 'POINT_DE_REPRISE.md')
    for name in ordered:
        atomic(root / name, (stage / 'project' / name).read_bytes())
    for name in ['APERCU.html', 'AVANCEMENT.html']:
        if (root / name).exists():
            atomic(output / name, (root / name).read_bytes())
    receipt = {'at': stamp(), 'day': pending['day'], 'archive': 'Forge-Actuel.zip', 'sha256': pending['zip_sha256'], 'file_count': len(after), 'daily_archived': pending['close_day']}
    atomic(output / 'Forge-Actuel.json', json_bytes(receipt))
    marker.unlink()
    shutil.rmtree(stage)
    print(json.dumps(receipt, ensure_ascii=False))

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--output', type=Path, default=Path('/workspace/artifacts'))
    parser.add_argument('--complete')
    parser.add_argument('--current')
    parser.add_argument('--next')
    parser.add_argument('--next-command')
    parser.add_argument('--day', type=int)
    parser.add_argument('--detail')
    parser.add_argument('--evidence', action='append', default=[])
    parser.add_argument('--checkpoint', action='store_true')
    parser.add_argument('--close-day', action='store_true')
    parser.add_argument('--recover', action='store_true')
    args = parser.parse_args()
    root, output = args.root.resolve(), args.output.resolve()
    if output.is_relative_to(root):
        raise ValueError('Les archives doivent être hors du projet pour éviter la récursion.')
    if not any([args.complete, args.checkpoint, args.close_day, args.recover]):
        parser.error('Choisir --complete, --checkpoint, --close-day ou --recover.')
    output.mkdir(parents=True, exist_ok=True)
    lock = root / 'docs/.checkpoint.lock'
    with lock.open('a') as stream:
        fcntl.flock(stream, fcntl.LOCK_EX | fcntl.LOCK_NB)
        marker = root / 'docs/.checkpoint-pending.json'
        if marker.exists():
            if not args.recover:
                raise ValueError('Checkpoint interrompu détecté : inspecter puis exécuter --recover.')
            finish_pending(root, marker)
            return
        if args.recover:
            print('Aucune transaction de checkpoint à reprendre.')
            return
        original = files(root)
        day = args.day or json.loads(original['docs/roadmap.json'])['day']
        if args.close_day and (output / f'Forge-Jour-{day}.zip').exists():
            raise ValueError('Archive quotidienne existante : refus de l’écraser.')
        stage = Path(tempfile.mkdtemp(prefix='.forge-checkpoint-', dir=output))
        project = stage / 'project'
        project.mkdir()
        try:
            for name, data in original.items():
                p = project / name; p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(data)
            roadmap, state = prepare(root, project, args)
            after = files(project)
            manifest = {'generated_at': state['updated_at'], 'day': roadmap['day'], 'files': hashes(after)}
            archive = stage / 'snapshot.zip'
            with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
                for name, data in after.items():
                    z.writestr('Forge/' + name, data)
                z.writestr('Forge/ARCHIVE_MANIFEST.json', json_bytes(manifest))
            with zipfile.ZipFile(archive) as z:
                if z.testzip() is not None:
                    raise ValueError('Erreur CRC dans le ZIP préparé.')
                for name, data in after.items():
                    if digest(z.read('Forge/' + name)) != digest(data):
                        raise ValueError('Erreur d’intégrité ZIP : ' + name)
            if hashes(files(root)) != hashes(original):
                raise ValueError('Sources modifiées pendant le checkpoint : aucune publication effectuée. Relancer une fois les fichiers gelés.')
            changed = [name for name in after if after[name] != original.get(name)]
            pending = {'stage': str(stage), 'output': str(output), 'day': roadmap['day'], 'close_day': args.close_day,
                'original': hashes(original), 'after': hashes(after), 'changed': changed, 'zip_sha256': digest(archive.read_bytes())}
            atomic(marker, json_bytes(pending))
            finish_pending(root, marker)
        except Exception:
            if not marker.exists():
                shutil.rmtree(stage)
            raise

if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        print('Checkpoint non publié : ' + str(error), file=sys.stderr)
        sys.exit(1)
