/* Forge — contrôle navigateur Jour 1.
 * Prérequis de test uniquement : Node, Playwright et Chromium.
 * FORGE_BASE_URL=http://127.0.0.1:8080 node tests/mobile-smoke.cjs
 * Ne modifie aucun compte existant : contexte Chromium neuf à chaque exécution.
 */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const baseURL = process.env.FORGE_BASE_URL || 'http://127.0.0.1:8080';
const label = process.env.FORGE_TEST_LABEL || 'jour1';
const original = label === 'original';
const out = process.env.FORGE_TEST_OUTPUT || path.join(require('node:os').tmpdir(), 'forge-tests');
const widths = [320, 375, 390, 430, 768, 1440];
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', locale: 'fr-FR', timezoneId: 'Europe/Paris' });
  const page = await context.newPage();
  const report = { label, baseURL, startedAt: new Date().toISOString(), browser: await browser.version(), checks: [], routes: [], pageErrors: [], failedRequests: [] };
  const check = (name, pass, detail = '') => report.checks.push({ name, status: pass ? 'passed' : 'failed', detail });
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url().split('?')[0], error: request.failure()?.errorText }));
  page.on('dialog', dialog => dialog.accept());
  const screenshot = async name => page.screenshot({ path: path.join(out, `${label}-${name}.png`), fullPage: true });
  const navigate = async route => { await page.evaluate(route => nav(route), route); await page.waitForTimeout(70); };
  const dimensions = async () => page.evaluate(() => {
    const w = document.documentElement.clientWidth;
    const offending = [...document.querySelectorAll('body *')].filter(el => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && (r.right > w + 1 || r.left < -1) && !el.closest('svg,.ph,.ea-glow');
    }).map(el => ({ tag: el.tagName, class: String(el.className).slice(0, 120), text: (el.textContent || '').trim().slice(0, 55), left: Math.round(el.getBoundingClientRect().left), right: Math.round(el.getBoundingClientRect().right) }));
    const smallButtons = w <= 430 ? [...document.querySelectorAll('button')].filter(el => {
      const r = el.getBoundingClientRect(), s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && (r.width < 43.5 || r.height < 43.5);
    }).map(el => ({ text: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 55), class: el.className, width: Math.round(el.getBoundingClientRect().width), height: Math.round(el.getBoundingClientRect().height) })) : [];
    return { viewport: w, height: window.innerHeight, scrollWidth: document.documentElement.scrollWidth, offending: offending.slice(0, 12), smallButtons };
  });
  try {
    await page.goto(baseURL, { waitUntil: 'load' });
    await page.waitForSelector('.ea');
    await screenshot('accueil-public-390');
    check('Accueil public affiché', await page.locator('.ea').isVisible());
    for (const width of widths) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
      const size = await dimensions();
      report.routes.push({ screen: 'accueil-public', width, theme: 'initial', ...size });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.ea-actions button').filter({ hasText: 'Créer' }).click();
    for (const width of widths) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
      report.routes.push({ screen: 'inscription', width, theme: 'initial', ...await dimensions() });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#regName').fill('Nina Test J1');
    await page.locator('#authEmail').fill('nina.jour1@example.test');
    await page.locator('#authPass').fill('Forge-Test-2026!');
    await page.locator('.avatar-option').nth(1).click();
    check('Choisir un avatar conserve les champs inscription', (await page.locator('#regName').inputValue()) === 'Nina Test J1' && (await page.locator('#authEmail').inputValue()) === 'nina.jour1@example.test' && (await page.locator('#authPass').inputValue()) === 'Forge-Test-2026!');
    await page.locator('#regName').fill('Nina Test J1');
    await page.locator('#authEmail').fill('nina.jour1@example.test');
    await page.locator('#authPass').fill('Forge-Test-2026!');
    await screenshot('inscription-390');
    if (original) await page.locator('#authSubmit').click();
    else await page.locator('#authPass').press('Enter');
    await page.waitForSelector('.rec-code');
    const recoveryCode = await page.locator('.rec-code').textContent();
    await page.waitForSelector('#setupName', { timeout: 10000 });
    await page.getByRole('button', { name: 'J’ai noté mon code' }).click();
    check('Inscription locale et code de récupération', !!recoveryCode && await page.evaluate(() => isLogged()));
    check('Prénom inscrit repris dans configuration', (await page.locator('#setupName').inputValue()) === 'Nina Test J1');
    for (const width of widths) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
      report.routes.push({ screen: 'configuration-initiale', width, theme: 'initial', ...await dimensions() });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#setupName').fill('Nina Test J1');
    await page.locator('#setupFreq').fill('3');
    await page.getByRole('button', { name: /Créer mon espace/ }).click();
    await page.waitForSelector('.eh');
    check('Configuration initiale enregistrée', await page.evaluate(() => DB.profile.setup && DB.profile.name === 'Nina Test J1' && DB.profile.perWeek === 3));
    await screenshot('accueil-personnel-390');

    await navigate('workouts');
    await page.getByRole('button', { name: 'Ajouter à mon programme', exact: true }).first().click();
    check('Installer une séance recommandée', await page.evaluate(() => DB.programs.length === 1 && DB.activeProgram === DB.programs[0].id));
    await page.locator('.r-day').first().click();
    check('Aperçu du programme accessible', await page.locator('.r-prev').isVisible());
    for (const width of widths) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
      report.routes.push({ screen: 'preview', width, theme: 'initial', ...await dimensions() });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await screenshot('programme-390');
    await page.getByRole('button', { name: /Commencer la séance/ }).click();
    await page.getByLabel('Charge série 1', { exact: true }).first().fill('20');
    await page.getByLabel('Répétitions série 1', { exact: true }).first().fill('10');
    await page.getByLabel('RPE série 1', { exact: true }).first().fill('7');
    await page.getByRole('button', { name: 'Valider la série 1', exact: true }).first().click();
    check('Valider série et démarrer repos', await page.evaluate(() => session.exercises[0].sets[0].done && rest > 0));
    await page.getByRole('button', { name: 'Pause', exact: true }).click();
    const paused = await page.evaluate(() => rest);
    await page.waitForTimeout(1150);
    check('Pause minuteur opérationnelle', await page.evaluate(expected => restPaused && rest === expected, paused));
    await page.getByRole('button', { name: '+15 s', exact: true }).click();
    check('Ajouter quinze secondes de repos', await page.evaluate(expected => rest === expected + 15, paused));
    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => { DB.settings.theme = theme; save(); render(); }, theme);
      for (const width of widths) {
        await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
        report.routes.push({ screen: 'session-active', width, theme, ...await dimensions() });
      }
    }
    await page.evaluate(() => { DB.settings.theme = 'light'; save(); render(); });
    await page.setViewportSize({ width: 390, height: 844 });
    await screenshot('session-390');
    await page.getByRole('button', { name: 'Terminer la séance', exact: true }).last().click();
    await page.waitForSelector('.esum');
    check('Séance terminée et volume calculé', await page.evaluate(() => DB.sessions.length === 1 && DB.sessions[0].volume === 200 && DB.sessions[0].sets === 1 && DB.prs[DB.sessions[0].exercises[0].name] === 20));

    await navigate('nutrition');
    await page.getByRole('button', { name: 'Poulet', exact: true }).click();
    await page.locator('#mealType').selectOption({ label: 'Déjeuner' });
    await page.locator('#mealGrams').fill('200');
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
      report.routes.push({ screen: 'modale-repas', width, theme: 'light', ...await dimensions() });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#modalbox').getByRole('button', { name: 'Ajouter', exact: true }).click();
    check('Ajouter un repas et calcul des macros', await page.evaluate(() => todayMeals().kcal === 330 && todayMeals().p === 62 && DB.meals.length === 1));
    await screenshot('nutrition-390');
    let mealCount = 1;
    if (!original) {
      await page.getByRole('button', { name: '+ 250 ml', exact: true }).click();
      check('Hydratation accessible et enregistrée', await page.evaluate(() => DB.water[today()] === 250));
      await page.locator('#wheyDose').fill('25');
      await page.locator('#wheyTimes').fill('09:00, 15:00');
      await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();
      await page.getByRole('button', { name: 'J’ai pris ma whey', exact: true }).click();
      check('Rappel whey et prise enregistrés', await page.evaluate(() => DB.whey.dose === 25 && DB.whey.times.join(',') === '09:00,15:00' && DB.meals.length === 2 && DB.meals[1].grams === 25));
      mealCount = 2;
      await page.getByRole('button', { name: 'Toutes les rubriques', exact: true }).click();
      const menuLinks = await page.locator('.app-menu-item').count();
      for (const width of [320, 390, 768]) {
        await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
        report.routes.push({ screen: 'menu-complet', width, theme: 'light', ...await dimensions() });
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator('.app-menu-item').filter({ hasText: 'Forge Premium' }).click();
      check('Menu mobile complet et page Premium accessible', menuLinks >= 15 && await page.getByText('Aucun abonnement actif · Aucun paiement disponible', { exact: true }).isVisible());
      await page.locator('.mobile-nav').getByRole('button', { name: 'Profil', exact: true }).click();
      await page.getByRole('button', { name: 'Passer au mode sombre', exact: true }).click();
      check('Bascule thème depuis profil', await page.evaluate(() => DB.settings.theme === 'dark' && !document.documentElement.classList.contains('light')));
      await page.getByRole('button', { name: 'Activer le mode clair', exact: true }).click();
      check('Bascule thème depuis en-tête mobile', await page.evaluate(() => DB.settings.theme === 'light' && document.documentElement.classList.contains('light')));
    }

    await navigate('memories');
    const fixture = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="100"><rect width="80" height="100" fill="#9aad91"/><circle cx="40" cy="35" r="15" fill="#24483d"/></svg>');
    await page.locator('#forgePhotoInput').setInputFiles([{ name: 'photo-test-1.svg', mimeType: 'image/svg+xml', buffer: fixture }, { name: 'photo-test-2.svg', mimeType: 'image/svg+xml', buffer: fixture }]);
    await page.waitForFunction(() => DB.photos.length === 2);
    check('Import de deux photos locales', await page.locator('.r-photo').count() === 2);
    await page.locator('.r-tag').first().click();
    await page.getByRole('button', { name: 'Entraînements', exact: true }).last().click();
    check('Filtre souvenirs fonctionne', await page.locator('.r-photo').count() === 1);
    await navigate('beforeafter');
    check('Comparaison avant/après affiche les photos', await page.locator('.r-ba img').count() === 2);

    const routes = await page.evaluate(() => Object.keys(pages));
    const backgrounds = {};
    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => { DB.settings.theme = theme; save(); render(); }, theme);
      backgrounds[theme] = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      for (const width of widths) {
        await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
        for (const route of routes.filter(r => !['session', 'preview'].includes(r))) {
          await navigate(route);
          const main = await page.locator('main').innerText();
          report.routes.push({ screen: route, width, theme, rendered: main.trim().length > 0, ...await dimensions() });
          if (width === 390 && ['home', 'nutrition', 'profile', 'calendar', 'coach'].includes(route)) await screenshot(`${route}-${theme}-390`);
        }
      }
    }
    check('Clair et sombre ont des arrière-plans distincts', backgrounds.light !== backgrounds.dark, JSON.stringify(backgrounds));
    check('Toutes les routes inscrites produisent du contenu', report.routes.every(r => r.rendered !== false));

    await page.setViewportSize({ width: 390, height: 844 });
    await navigate('calendar');
    const monthBefore = await page.locator('.cl-nav b').textContent();
    await page.getByRole('button', { name: 'Mois suivant', exact: true }).click();
    check('Calendrier navigation mensuelle', (await page.locator('.cl-nav b').textContent()) !== monthBefore);
    await page.getByRole('button', { name: 'Mois précédent', exact: true }).click();
    check('Calendrier contient la séance enregistrée', await page.locator('.cl-d.done').count() >= 1);

    await navigate('settings');
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Exporter JSON', exact: true }).click();
    const download = await downloadPromise;
    const downloadPath = await download.path();
    const backup = JSON.parse(fs.readFileSync(downloadPath, 'utf8'));
    check('Export JSON contient séance, repas et photos', backup.sessions.length === 1 && backup.meals.length === mealCount && backup.photos.length === 2);
    backup.profile.bio = 'Import contrôlé Jour 1';
    await page.locator('#importFile').setInputFiles({ name: 'forge-test-import.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
    await page.getByRole('button', { name: 'Remplacer mon carnet', exact: true }).click();
    await page.waitForFunction(() => DB.profile.bio === 'Import contrôlé Jour 1');
    check('Import JSON restaure les données exportées', await page.evaluate(expectedMeals => DB.profile.bio === 'Import contrôlé Jour 1' && DB.sessions.length === 1 && DB.meals.length === expectedMeals && DB.photos.length === 2, mealCount));
    await page.reload({ waitUntil: 'load' });
    check('Données et thème persistants après rechargement', await page.evaluate(expectedMeals => isLogged() && DB.sessions.length === 1 && DB.meals.length === expectedMeals && DB.photos.length === 2 && DB.settings.theme === 'dark', mealCount));

    await navigate('settings');
    await page.getByRole('button', { name: 'Se déconnecter', exact: true }).click();
    check('Déconnexion', await page.evaluate(() => !isLogged()));
    await page.locator('.ea-actions button').filter({ hasText: /connecter/ }).click();
    for (const width of widths) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
      report.routes.push({ screen: 'connexion', width, theme: 'dark', ...await dimensions() });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#authEmail').fill('nina.jour1@example.test');
    await page.locator('#authPass').fill('Mot-de-passe-erroné!');
    await page.locator('#authSubmit').click();
    check('Mot de passe incorrect refusé', await page.locator('#authError').textContent() === 'Mot de passe incorrect.');
    await page.getByText('Mot de passe oublié ?', { exact: true }).click();
    for (const width of widths) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
      report.routes.push({ screen: 'recuperation-compte', width, theme: 'dark', ...await dimensions() });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#authEmail').fill('nina.jour1@example.test');
    await page.locator('#recCode').fill(recoveryCode);
    await page.locator('#authPass').fill('Forge-Nouveau-2026!');
    await page.locator('#authSubmit').click();
    await page.waitForFunction(() => authMode === 'login');
    await page.locator('#authEmail').fill('nina.jour1@example.test');
    await page.locator('#authPass').fill('Forge-Nouveau-2026!');
    await page.locator('#authSubmit').click();
    await page.waitForSelector('.eh', { timeout: 10000 });
    check('Récupération par code puis connexion', await page.evaluate(() => isLogged() && DB.sessions.length === 1 && DB.profile.name === 'Nina Test J1'));
    const overflow = report.routes.filter(r => r.scrollWidth > r.viewport + 1 || r.offending.length);
    check('Aucun débordement horizontal toutes tailles/thèmes', overflow.length === 0, `${overflow.length}/${report.routes.length} états avec débordement`);
    const smallButtons = report.routes.filter(r => r.smallButtons.length);
    check('Cibles boutons mobiles au moins 44 px', smallButtons.length === 0, `${smallButtons.length}/${report.routes.length} états avec petits boutons`);
    check('Aucune exception JavaScript', report.pageErrors.length === 0, report.pageErrors.join('\n'));
  } catch (error) {
    check('Exécution complète du scénario', false, error.stack);
    await screenshot('echec').catch(() => {});
  } finally {
    report.finishedAt = new Date().toISOString();
    report.summary = { passed: report.checks.filter(x => x.status === 'passed').length, failed: report.checks.filter(x => x.status === 'failed').length, routeStates: report.routes.length, overflowStates: report.routes.filter(r => r.scrollWidth > r.viewport + 1 || r.offending.length).length };
    fs.writeFileSync(path.join(out, `${label}-results.json`), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ summary: report.summary, failures: report.checks.filter(x => x.status === 'failed'), pageErrors: report.pageErrors, overflowExamples: report.routes.filter(r => r.scrollWidth > r.viewport + 1 || r.offending.length).slice(0, 8), smallTargetExamples: report.routes.filter(r => r.smallButtons?.length).slice(0, 8).map(r => ({screen:r.screen,width:r.width,buttons:r.smallButtons})) }, null, 2));
    await browser.close();
    if (report.summary.failed) process.exitCode = 1;
  }
})();
