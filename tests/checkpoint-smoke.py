#!/usr/bin/env python3
"""Tests réels du checkpoint sur un dossier temporaire ; ne publie jamais le vrai ZIP."""
import hashlib
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
checks=[]
def check(name, condition):
    if not condition:
        raise AssertionError(name)
    checks.append({'name':name,'status':'passed'})
def run(root, output, *args, success=True):
    p=subprocess.run([sys.executable,str(root/'docs/checkpoint.py'),'--root',str(root),'--output',str(output),*args],capture_output=True,text=True)
    if success and p.returncode:
        raise AssertionError(p.stderr)
    if not success and p.returncode==0:
        raise AssertionError('Commande aurait dû être refusée: '+str(args))
    return p

def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()

with tempfile.TemporaryDirectory(prefix='forge-checkpoint-tests-') as temp:
    folder=Path(temp); project=folder/'project'; output=folder/'out'
    shutil.copytree(ROOT,project,ignore=shutil.ignore_patterns('.git','__pycache__','*.pyc','.checkpoint.lock','.checkpoint-pending.json'))
    # La fixture est indépendante du statut du vrai dépôt lors d’une relance future.
    roadmap=json.loads((project/'docs/roadmap.json').read_text())
    roadmap['day']=2
    for t in roadmap['tasks']:
        if t['id']=='P05':t.update(status='en_cours',completed_day=None)
        if t['id']=='D05':t.update(status='a_faire',completed_day=None)
    (project/'docs/roadmap.json').write_text(json.dumps(roadmap))
    (project/'docs/checkpoint.json').unlink(missing_ok=True)
    (project/'tests/fixture-evidence.json').write_text(json.dumps({'passed':1,'failed':0,'checks':[{'name':'fixture','status':'passed'}]}))
    (project/'tests/fixture-failure.json').write_text(json.dumps({'passed':0,'failed':1}))
    output.mkdir(); day1=output/'Forge-Jour-1.zip';day1.write_bytes(b'archive-jour-1-preservee');old=sha(day1)
    source_before=(project/'docs/roadmap.json').read_bytes()
    run(project,output,'--complete','P05',success=False)
    check('Refuse de terminer sans preuve et ne modifie pas les statuts',(project/'docs/roadmap.json').read_bytes()==source_before)
    run(project,output,'--complete','P05','--evidence','tests/fixture-failure.json',success=False)
    check('Refuse une preuve en échec',not (output/'Forge-Actuel.zip').exists())
    run(project,output,'--checkpoint','--current','INCONNU',success=False)
    check('Refuse une tâche inconnue',(project/'docs/roadmap.json').read_bytes()==source_before)
    run(project,output,'--checkpoint','--day','1',success=False)
    check('Refuse de reculer le jour',(project/'docs/roadmap.json').read_bytes()==source_before)
    run(project,output,'--checkpoint','--day','2','--current','P05','--detail','Tests de préparation en cours.','--next','D05')
    checkpoint=json.loads((project/'docs/checkpoint.json').read_text())
    check('Un checkpoint de progression ne termine aucune tâche',next(t for t in json.loads((project/'docs/roadmap.json').read_text())['tasks'] if t['id']=='P05')['status']=='en_cours')
    check('Point de reprise contient état et prochaine tâche','Tests de préparation en cours.' in (project/'POINT_DE_REPRISE.md').read_text() and checkpoint['next']=='D05')
    with zipfile.ZipFile(output/'Forge-Actuel.zip') as z:
        manifest=json.loads(z.read('Forge/ARCHIVE_MANIFEST.json'))
        valid=z.testzip() is None and all(hashlib.sha256(z.read('Forge/'+p)).hexdigest()==h for p,h in manifest['files'].items())
        check('CRC et toutes empreintes du manifeste correspondent',valid)
        check('ZIP exclut Git, caches et archives récursives',not any('/.git/' in n or '/__pycache__/' in n or n.endswith('.zip') for n in z.namelist()))
    check('Empreinte voisine vérifie le ZIP entier',(output/'Forge-Actuel.sha256').read_text().split()[0]==sha(output/'Forge-Actuel.zip'))
    run(project,output,'--complete','P05','--day','2','--current','D05','--next','D06','--detail','P05 vérifiée sur fixture.','--evidence','tests/fixture-evidence.json')
    current=json.loads((project/'docs/roadmap.json').read_text()); done=next(t for t in current['tasks'] if t['id']=='P05')
    check('Clôture de tâche datée et tâche suivante en cours',done['status']=='terminee' and done['completed_day']==2 and next(t for t in current['tasks'] if t['id']=='D05')['status']=='en_cours')
    check('Tableau et feuille de route synchronisés au bon dénominateur',str(len(current['tasks']))+' tâches' in (project/'AVANCEMENT.html').read_text() and 'P05' in (project/'FEUILLE_DE_ROUTE.md').read_text())
    check('Journal et README contiennent le checkpoint','P05 vérifiée sur fixture.' in (project/'JOURNAL_JOUR_2.md').read_text() and 'FORGE_CURRENT_START' in (project/'README.md').read_text())
    old_current=sha(output/'Forge-Actuel.zip')
    run(project,output,'--complete','P05','--evidence','tests/fixture-evidence.json',success=False)
    check('Ne refait pas une tâche terminée, ZIP précédent intact',sha(output/'Forge-Actuel.zip')==old_current)
    run(project,output,'--close-day',success=False)
    check('Refuse de fermer une journée avec tâche en cours',not (output/'Forge-Jour-2.zip').exists())
    run(project,output,'--complete','D05','--day','2','--current','','--next','D06','--detail','D05 simulée uniquement dans fixture.','--evidence','tests/fixture-evidence.json','--close-day')
    check('Clôture conserve archive quotidienne exacte',sha(output/'Forge-Jour-2.zip')==sha(output/'Forge-Actuel.zip'))
    day2=sha(output/'Forge-Jour-2.zip');run(project,output,'--close-day',success=False)
    check('Une archive quotidienne existante ne peut être écrasée',sha(output/'Forge-Jour-2.zip')==day2 and sha(day1)==old)
    run(project,output,'--recover')
    check('Reprise sans transaction ne modifie rien',sha(output/'Forge-Jour-2.zip')==day2)
    # Vérification d’une vraie publication interrompue : fichier source modifié après préparation.
    spec=importlib.util.spec_from_file_location('checkpoint_module',project/'docs/checkpoint.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    original_finish=module.finish_pending
    def interrupt(*args): raise OSError('Interruption simulée avant publication')
    module.finish_pending=interrupt
    original_argv=sys.argv
    sys.argv=['checkpoint.py','--root',str(project),'--output',str(output),'--checkpoint','--day','3','--current','D06','--detail','Reprise de transaction fixture.','--next','T05']
    try:
        try: module.main()
        except OSError: pass
    finally:sys.argv=original_argv;module.finish_pending=original_finish
    check('Interruption conserve un marqueur et le ZIP livré précédent',(project/'docs/.checkpoint-pending.json').exists() and sha(output/'Forge-Actuel.zip')==day2)
    run(project,output,'--recover')
    check('Reprise termine la transaction sans répéter la tâche',not (project/'docs/.checkpoint-pending.json').exists() and json.loads((project/'docs/checkpoint.json').read_text())['day']==3)
    check('Archives précédentes conservées après reprise',sha(day1)==old and sha(output/'Forge-Jour-2.zip')==day2)

result={'passed':len(checks),'failed':0,'scope':'Fixtures temporaires ; aucun vrai ZIP courant publié et aucune tâche réelle clôturée','checks':checks}
(ROOT/'tests/resultats-checkpoint.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False,indent=2))
