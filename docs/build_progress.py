#!/usr/bin/env python3
"""Generate the self-contained progress dashboard and roadmap from roadmap.json."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'docs/roadmap.json').read_text(encoding='utf-8'))
tasks = data['tasks']
agents = {a['id']: a['name'] for a in data['agents']}
assert len({t['id'] for t in tasks}) == len(tasks)
assert all(t['agent'] in agents for t in tasks)
assert all(t['status'] in {'terminee', 'en_cours', 'a_faire', 'bloquee'} for t in tasks)
assert all((t['completed_day'] is not None) == (t['status'] == 'terminee') for t in tasks)

def pct(items):
    return round(sum(t['status'] == 'terminee' for t in items) / len(items) * 100) if items else 0

def bar(value):
    n = round(value * 16 / 100)
    return '█' * n + '░' * (16 - n)

def esc(s):
    return html.escape(str(s), quote=True)

labels = {'terminee': '✅ Terminée', 'en_cours': '🔄 En cours', 'a_faire': '⬜ À faire', 'bloquee': '⏸ Bloquée'}
done = sum(t['status'] == 'terminee' for t in tasks)
active = sum(t['status'] == 'en_cours' for t in tasks)
blocked = sum(t['status'] == 'bloquee' for t in tasks)
total = len(tasks)
percent = pct(tasks)
u04_steps = next((task.get('steps', []) for task in tasks if task['id'] == 'U04'), [])
u04_lines = (['**U04 : une tâche, trois étapes ordonnées.** Le Designer reste responsable de sa clôture ; ces étapes ne sont pas ajoutées au dénominateur.', '', '| Étape | Responsable | Résultat attendu avant relais |', '|---|---|---|'] + [f"| {step['id']} | {agents[step['agent']]} | {step['title']} |" for step in u04_steps] + ['']) if u04_steps else []
md = [
    '# Forge — Feuille de route', '',
    f'**Jour {data["day"]} · {data["date"]} · {done}/{total} tâches terminées · {percent} %**', '',
    f'Avancement global : `{bar(percent)}` **{percent} %**', '',
    'Calcul : tâches terminées ÷ tâches totales × 100, arrondi au pourcentage entier. Les tâches en cours ne donnent aucun crédit partiel. Chaque tâche pèse une unité, indépendamment de sa durée.', '',
    'Source des chiffres : `docs/roadmap.json`. Le même fichier génère ce document et `AVANCEMENT.html` via `python3 docs/build_progress.py`. Toute tâche ajoutée augmente le dénominateur. Les dates de fin ne sont renseignées qu’après réalisation vérifiée.', '',
    '## Répartition et ordre de travail', '',
    'Le chef de projet attribue et suit chaque tâche. Le designer édite les styles et assets ; le développeur les scripts applicatifs, le point d’entrée et les aperçus ; le testeur les tests et son rapport ; Contenu & idées les propositions éditoriales. Les propositions de textes vont au développeur avant intégration. Les fichiers d’avancement et les README relèvent du chef de projet. Aucune réécriture du projet ni changement de propriétaire de fichier sans coordination.', '',
    'Ordre Jour 1 : **P01 → P02 → (U01, C01) → (U02, D01, C02) → (D02, D03, D04) → (T02, T03) → P03**. T01 établit la situation de départ en parallèle. C04 prépare les idées du lendemain. Les retouches issues des tests reviennent au propriétaire du fichier.', '',
    'Priorités : **P0** = base utilisable et conservation des fonctions ; **P1** = fiabilité et finition ; **P2** = évolution de production ou idée à valider. D08–D10 et T06 nécessitent des services externes : ils ne conditionnent pas l’utilisation locale, mais restent ouverts dans cette feuille complète.', '',
    '**Ordre courant :** P05 → D05 → D06 (Jour 2), puis T05 → D07 → U03 (Jour 3), puis C03 et V01 → V02 → V03 (Jour 4, demande vidéo) ; U04 et P04 restent à venir. Chaque clôture attend ses preuves de test avant le checkpoint.', '',
    *u04_lines,
    '## Avancement par agent', '',
    '| Agent | Avancement | Terminées / total |', '|---|---|---:|'
]
agent_cards = []
for aid, name in agents.items():
    own = [t for t in tasks if t['agent'] == aid]
    n = sum(t['status'] == 'terminee' for t in own)
    p = pct(own)
    md.append(f'| {name} | `{bar(p)}` {p} % | {n}/{len(own)} |')
    agent_cards.append(f'''<article class="agent"><div class="agent-top"><span class="agent-id">{esc(name.split()[0][0])}</span><strong>{esc(name)}</strong><span>{p}%</span></div><progress value="{p}" max="100" aria-label="{esc(name)} : {p} pour cent">{p}%</progress><small>{n} tâche{'s' if n > 1 else ''} terminée{'s' if n > 1 else ''} / {len(own)}</small></article>''')
md += ['', '## Toutes les tâches', '', '| ID | Priorité | Tâche | Responsable | Statut | Fin | Livrable / critère |', '|---|---|---|---|---|---|---|']
rows = []
for t in tasks:
    finished = f'Jour {t["completed_day"]}' if t['completed_day'] else '—'
    md.append(f'| {t["id"]} | {t["priority"]} | {t["title"]} | {agents[t["agent"]]} | {labels[t["status"]]} | {finished} | {t["evidence"]} |')
    rows.append(f'''<li class="task" data-status="{t['status']}" data-agent="{t['agent']}"><div class="task-code">{t['id']}<small>{t['priority']}</small></div><div class="task-copy"><h3>{esc(t['title'])}</h3><p>{esc(t['evidence'])}</p><div class="task-meta"><span>{esc(agents[t['agent']])}</span><span>Fin : {finished}</span></div></div><span class="status {t['status']}">{labels[t['status']]}</span></li>''')
md += ['', '## Points bloquants et limites', ''] + ['- ' + s for s in data['blockers']]
md += ['', '## Prochaines étapes', ''] + ['- ' + s for s in data['next_steps']]
md += ['', ('**En pause à la demande du propriétaire.** Attendre une nouvelle demande. À « reprends », relire POINT_DE_REPRISE.md. Les tâches bloquées restent dans le dénominateur.' if data.get('mode')=='paused' else '**Mode continu :** poursuivre les journées ; actualiser POINT_DE_REPRISE.md après chaque tâche testée.'), '']
(ROOT / 'FEUILLE_DE_ROUTE.md').write_text('\n'.join(md), encoding='utf-8')
page = '''<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Forge — Avancement du Jour __DAY__</title>
<style>
:root{--bg:#f6f5ef;--paper:#fffefa;--ink:#213e36;--muted:#65756b;--line:#dce2d7;--sage:#e5eddf;--pine:#275647;--accent:#ac7059}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit}button,select{font:inherit}header{border-bottom:1px solid var(--line);padding:22px max(24px,calc((100vw - 1180px)/2));display:flex;gap:20px;justify-content:space-between;align-items:center}.brand{display:flex;align-items:center;gap:12px;text-decoration:none;font-weight:750;letter-spacing:3px}.mark{display:grid;place-items:center;background:var(--pine);color:#fffefa;width:38px;height:38px;border-radius:12px;font-size:23px;font-style:italic;letter-spacing:-5px;padding-right:5px}header small{color:var(--muted)}main{max-width:1180px;margin:auto;padding:44px 24px 64px}.eyebrow{text-transform:uppercase;letter-spacing:2px;font-size:11px;font-weight:700;color:var(--muted)}h1{font-size:clamp(32px,5vw,54px);font-weight:650;letter-spacing:-2px;line-height:1.1;margin:14px 0 18px}h2{font-size:23px;letter-spacing:-.5px;margin:0}p{margin:0 0 12px}.intro{display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:30px}.intro p{max-width:650px;color:var(--muted)}.button{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;min-height:46px;background:var(--paper);border:1px solid var(--line);border-radius:12px;text-decoration:none;white-space:nowrap;font-weight:600}.button:hover{border-color:var(--pine)}.summary{display:grid;grid-template-columns:1.45fr 1fr;gap:20px}.overall{padding:30px;border-radius:24px;background:var(--pine);color:var(--paper)}.overall .eyebrow{color:#c9d9cc}.overall-num{font-size:80px;line-height:1;letter-spacing:-5px;font-weight:650;margin:18px 0 22px}.overall-num span{font-size:28px;letter-spacing:0;margin-left:6px;color:#c9d9cc}progress{appearance:none;width:100%;height:8px;border:0;border-radius:10px;overflow:hidden;background:var(--line)}progress::-webkit-progress-bar{background:var(--line);border-radius:10px}progress::-webkit-progress-value{background:var(--pine);border-radius:10px}progress::-moz-progress-bar{background:var(--pine);border-radius:10px}.overall progress{height:10px;background:#527466}.overall progress::-webkit-progress-bar{background:#527466}.overall progress::-webkit-progress-value{background:#c9e5aa}.overall progress::-moz-progress-bar{background:#c9e5aa}.overall p{color:#dbe6dc;font-size:13px;margin-top:13px}.stats{display:grid;grid-template-columns:1fr 1fr;gap:16px}.stat{background:var(--paper);border:1px solid var(--line);border-radius:22px;padding:24px}.stat b{display:block;font-size:42px;font-weight:550;letter-spacing:-2px}.stat small{color:var(--muted)}.stat.note{grid-column:1/-1;background:var(--sage);font-size:13px}.formula{color:var(--muted);font-size:12px;margin:14px 0 34px}.section-title{display:flex;justify-content:space-between;gap:15px;align-items:center;margin-bottom:16px}.section-title small{color:var(--muted)}.agents{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:36px}.agent{border:1px solid var(--line);border-radius:18px;background:var(--paper);padding:18px}.agent-top{display:flex;gap:9px;align-items:center;line-height:1.25;margin-bottom:18px}.agent-top strong{font-size:14px;flex:1}.agent-top>span:last-child{font-size:17px;font-weight:650}.agent-id{background:var(--sage);border-radius:10px;width:30px;height:32px;display:grid;place-items:center;font-size:12px;font-weight:700}.agent small{color:var(--muted);display:block;margin-top:6px;font-size:12px}.filters{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}.filters label{display:flex;align-items:center;gap:10px;color:var(--muted);font-size:13px}select{background:var(--paper);border:1px solid var(--line);border-radius:10px;color:var(--ink);padding:10px;min-height:44px;max-width:100%}.tasks{list-style:none;margin:0;padding:0;border:1px solid var(--line);border-radius:18px;overflow:hidden;background:var(--paper)}.task{display:flex;align-items:start;gap:18px;padding:22px;border-bottom:1px solid var(--line)}.task:last-child{border-bottom:0}.task[hidden]{display:none}.task-code{flex:0 0 36px;font-size:12px;font-weight:750;padding-top:3px;color:var(--muted)}.task-code small{display:block;font-weight:500;color:#88938b}.task-copy{flex:1;min-width:0}.task h3{font-size:15px;line-height:1.5;margin:0;font-weight:650}.task p{font-size:12px;color:var(--muted);margin:4px 0 8px;overflow-wrap:anywhere}.task-meta{display:flex;flex-wrap:wrap;gap:12px;font-size:11px;color:var(--muted)}.status{font-size:11px;line-height:1.5;white-space:nowrap;padding:5px 10px;border-radius:30px;background:#f1f2ed;color:var(--muted)}.terminee{background:#e4efdd;color:#35592c}.en_cours{background:#f1e8dc;color:#805d30}.bloquee{background:#eee8e5;color:#755448}.bottom{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:32px}.bottom article{border-top:1px solid var(--line);padding-top:22px}.bottom h2{font-size:19px}.bottom ul{padding-left:19px;color:var(--muted);font-size:13px}.bottom li{margin:10px 0}footer{max-width:1180px;margin:auto;padding:0 24px 35px;color:var(--muted);font-size:12px}.focus-note{margin-top:18px;border-left:3px solid var(--accent);padding-left:15px;color:var(--muted);font-size:13px}:focus-visible{outline:3px solid var(--accent);outline-offset:3px}@media(max-width:850px){.agents{grid-template-columns:1fr 1fr}.summary{grid-template-columns:1fr}.intro{align-items:start;flex-direction:column}.overall-num{font-size:65px}}@media(max-width:520px){header{padding:16px 18px}header small{font-size:10px}main{padding:28px 18px 40px}.agents{grid-template-columns:1fr}.bottom{grid-template-columns:1fr}.task{padding:17px 13px;gap:10px;flex-wrap:wrap}.task-copy{flex-basis:calc(100% - 48px)}.status{margin-left:46px}.overall{padding:24px}.stat{padding:18px}.stat b{font-size:35px}.section-title{align-items:start;flex-direction:column}.filters label{flex-wrap:wrap;gap:4px;width:100%}.filters select{width:100%}.intro p{font-size:14px}}
</style></head><body>
<header><a class="brand" href="APERCU.html"><span class="mark" aria-hidden="true">F</span> FORGE</a><small>Suivi du développement · Jour __DAY__</small></header>
<main><section class="intro"><div><div class="eyebrow">Le journal de construction · __DATE__</div><h1>Une étape à la fois.</h1><p>L’avancée du projet et le travail des cinq agents, au même endroit. Ce tableau est un document de suivi pour le propriétaire, indépendant du site Forge.</p></div><a class="button" href="APERCU.html">Voir l’aperçu du site ↗</a></section>
<section class="summary" aria-label="Avancement global"><article class="overall"><div class="eyebrow">Avancement global</div><div class="overall-num">__PERCENT__<span>%</span></div><progress value="__PERCENT__" max="100" aria-label="Avancement global : __PERCENT__ pour cent">__PERCENT__%</progress><p>__DONE__ tâches terminées sur __TOTAL__ dans la feuille de route complète.</p></article><div class="stats"><article class="stat"><b>__DONE__</b><small>✅ tâches terminées</small></article><article class="stat"><b>__REMAIN__</b><small>tâches restantes, dont __ACTIVE__ en cours et __BLOCKED__ bloquées</small></article><article class="stat note"><strong>Un bilan honnête.</strong><p>Les fonctions locales et la future mise en production sont distinguées. Une maquette d’IA ou de paiement ne vaut pas une intégration terminée.</p></article></div></section>
<p class="formula">Calcul : tâches terminées ÷ tâches totales × 100, arrondi à l’entier. Aucun crédit partiel. Toute nouvelle tâche augmente le total. Source : <code>docs/roadmap.json</code>.</p>
<section><div class="section-title"><h2>Les cinq agents</h2><small>Responsabilités séparées, livrables partagés.</small></div><div class="agents">__AGENTS__</div></section>
<section><div class="section-title"><h2>La feuille de route</h2><small>Priorité · responsable · état · jour de fin</small></div><div class="filters"><label>Afficher <select id="status"><option value="all">Toutes les tâches</option><option value="terminee">✅ Terminées</option><option value="en_cours">🔄 En cours</option><option value="a_faire">⬜ À faire</option><option value="bloquee">⏸ Bloquées</option></select></label><label>Agent <select id="agent"><option value="all">Toute l’équipe</option>__OPTIONS__</select></label><span id="resultCount" class="formula" aria-live="polite">__TOTAL__ tâches affichées</span></div><ul class="tasks">__TASKS__</ul></section>
<section class="bottom"><article><h2>À savoir avant la suite</h2><ul>__BLOCKERS__</ul></article><article><h2>Le prochain pas</h2><ul>__NEXT__</ul><p class="focus-note">Mode continu : les journées s’enchaînent. Reprise exacte depuis POINT_DE_REPRISE.md après une interruption.</p></article></section>
</main><footer>Forge · Plus qu’une app, une discipline. · Document autonome, utilisable sans connexion. Les preuves de chaque journée sont référencées dans POINT_DE_REPRISE.md et les journaux.</footer>
<script>(()=>{const status=document.querySelector('#status'),agent=document.querySelector('#agent'),rows=[...document.querySelectorAll('.task')];function filter(){let count=0;for(const row of rows){const show=(status.value==='all'||row.dataset.status===status.value)&&(agent.value==='all'||row.dataset.agent===agent.value);row.hidden=!show;if(show)count++;}document.querySelector('#resultCount').textContent=count+' tâche'+(count>1?'s':'')+' affichée'+(count>1?'s':'');}status.addEventListener('change',filter);agent.addEventListener('change',filter)})();</script></body></html>'''
replacements = {
    '__DAY__': str(data['day']), '__DATE__': esc(data['date']), '__PERCENT__': str(percent),
    '__BLOCKED__': str(blocked), '__DONE__': str(done), '__TOTAL__': str(total), '__REMAIN__': str(total-done), '__ACTIVE__': str(active),
    '__AGENTS__': ''.join(agent_cards), '__TASKS__': ''.join(rows),
    '__OPTIONS__': ''.join(f'<option value="{a}">{esc(n)}</option>' for a,n in agents.items()),
    '__BLOCKERS__': ''.join('<li>'+esc(s)+'</li>' for s in data['blockers']),
    '__NEXT__': ''.join('<li>'+esc(s)+'</li>' for s in data['next_steps'])
}
for key, value in replacements.items():
    page = page.replace(key, value)
if data.get('mode') == 'paused':
    page = page.replace('Mode continu : les journées s’enchaînent. Reprise exacte depuis POINT_DE_REPRISE.md après une interruption.', 'En pause à la demande du propriétaire. Reprise depuis POINT_DE_REPRISE.md lors de sa prochaine demande.')
(ROOT / 'AVANCEMENT.html').write_text(page, encoding='utf-8')
print(f'{done}/{total} tâches terminées : {percent} % ; {active} en cours.')
