/* Forge — accueil vidéo : grille, corps animé, activité et pas.
 * À lancer sur les sources gelées, APERCU.html reconstruit.
 * FORGE_BASE_URL=http://127.0.0.1:8080 FORGE_TEST_OUTPUT=/tmp/forge-home-video node tests/home-video-smoke.cjs
 * Contexte Chromium neuf : aucune donnée de l’utilisateur n’est lue ou modifiée.
 */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');

const base = process.env.FORGE_BASE_URL || 'http://127.0.0.1:8080';
const output = process.env.FORGE_TEST_OUTPUT || '/tmp/forge-home-video';
const root = path.resolve(__dirname, '..');
fs.mkdirSync(output, { recursive: true });
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const sourcePaths = ['index.html', ...['js', 'css', 'assets', 'preview'].flatMap(folder =>
  fs.readdirSync(path.join(root, folder), { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && /\.(?:js|css|html|svg|png|webp|py)$/.test(entry.name) && !entry.parentPath.includes('__pycache__'))
    .map(entry => path.relative(root, path.join(entry.parentPath, entry.name)))
)].sort();
const sourceHashes = () => Object.fromEntries(sourcePaths.map(file => [file, sha256(fs.readFileSync(path.join(root, file)))]));
const initialSourceHashes = sourceHashes();
const initialApercuHash = sha256(fs.readFileSync(path.join(root, 'APERCU.html')));

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 805 },
    reducedMotion: 'reduce', locale: 'fr-FR', timezoneId: 'Europe/Paris'
  });
  const page = await context.newPage();
  const report = { checkedAt: new Date().toISOString(), browser: await browser.version(), checks: [], errors: [], layouts: [] };
  const captureErrors = p => p.on('pageerror', error => report.errors.push(error.message));
  captureErrors(page);
  const check = (name, value, detail) => {
    report.checks.push({ name, status: value ? 'passed' : 'failed', ...(detail ? { detail } : {}) });
    assert.ok(value, name);
  };
  const bodyMotion = () => page.evaluate(() => document.getAnimations().filter(animation => {
    const element = animation.effect?.target;
    return element instanceof Element && element.closest('.vf-body-glow') && animation.playState === 'running';
  }).length);
  const assertBodyLoaded = async (p, label) => {
    await p.locator('img.vf-body-image').first().waitFor();
    await p.waitForFunction(() => {
      const img = document.querySelector('img.vf-body-image');
      return img?.complete && img.naturalWidth > 0;
    });
    check(label, await p.locator('img.vf-body-image').first().evaluate(img => img.naturalWidth > 0 && img.naturalHeight > 0));
  };
  const rect = async selector => page.locator(selector).first().boundingBox();
  const near = (a, b, tolerance = 2) => Math.abs(a - b) <= tolerance;
  try {
    await page.goto(base + '/APERCU.html');
    await page.locator('.vf-dashboard').waitFor();
    await assertBodyLoaded(page, 'Le corps est une image chargée dans l’aperçu autonome');
    check('L’image du corps est intégrée au fichier autonome', await page.locator('img.vf-body-image').first().evaluate(img => img.currentSrc.startsWith('data:image/')));
    check('Les deux couches lumineuses des pectoraux existent', await page.locator('.vf-body-glow .vf-pec-outline').count() > 0 && await page.locator('.vf-body-glow .vf-pec-glow').count() > 0);
    check('La carte activité présente Bouger, Exercice et Debout', await page.locator('.vf-activity').first().innerText().then(text => ['Bouger', 'Exercice', 'Debout'].every(label => text.includes(label))));
    check('La carte des pas possède son historique visuel', await page.locator('.vf-steps-spark').count() > 0);

    const top = '.vf-dashboard .vf-top-grid > .vf-card';
    const middle = '.vf-dashboard .vf-mid-grid > .vf-card';
    const bottom = '.vf-dashboard .vf-bottom-grid > .vf-card';
    check('Grille desktop : trois cartes, trois cartes, deux cartes', await page.locator(top).count() === 3 && await page.locator(middle).count() === 3 && await page.locator(bottom).count() === 2);
    const hero = await rect('.vf-dashboard .vf-top-grid .vf-hero');
    const activity = await rect('.vf-dashboard .vf-activity');
    const macros = await rect('.vf-dashboard .vf-macro');
    const sleep = await rect('.vf-dashboard .vf-sleep');
    const pulse = await rect('.vf-dashboard .vf-pulse');
    const next = await rect('.vf-dashboard .vf-upcoming');
    const steps = await rect('.vf-dashboard .vf-week-volume');
    check('Premier rang aligné : héro à gauche, activité au centre, macros à droite', near(hero.y, activity.y) && near(activity.y, macros.y) && hero.x < activity.x && activity.x < macros.x && hero.width > activity.width * 1.35);
    check('Deuxième rang aligné : sommeil, pouls, prochaines séances', near(sleep.y, pulse.y) && near(pulse.y, next.y) && sleep.x < pulse.x && pulse.x < next.x && sleep.y >= hero.y + hero.height);
    check('Les pas sont au troisième rang et alignés à gauche', near(steps.x, hero.x) && steps.y >= sleep.y + sleep.height);
    check('L’espacement des deux rangs reste celui de la grille vidéo', sleep.y - (hero.y + hero.height) >= 8 && sleep.y - (hero.y + hero.height) <= 18);
    check('Le second rang garde une hauteur proche des 280 px de la référence', sleep.height >= 260 && sleep.height <= 290, { height: sleep.height });
    check('Le haut de la carte des pas est visible au premier écran desktop', steps.y <= 750, { y: steps.y });
    report.layouts.push({ width: 1280, hero, activity, macros, sleep, pulse, next, steps });
    await page.screenshot({ path: path.join(output, 'accueil-desktop-1280.png'), fullPage: true });

    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: width === 320 ? 740 : 844 });
      await page.evaluate(() => scrollTo(0, 0));
      await assertBodyLoaded(page, 'Corps chargé à ' + width + ' px');
      const sizes = await page.evaluate(() => {
        const card = document.querySelector('.vf-dashboard .vf-hero').getBoundingClientRect();
        const stats = document.querySelector('.vf-dashboard .vf-hero-stats').getBoundingClientRect();
        const smallButtons = innerWidth > 430 ? [] : [...document.querySelectorAll('.vf-dashboard button,.vf-topbar button')].filter(button => {
          const rect = button.getBoundingClientRect(), style = getComputedStyle(button);
          return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0 && (rect.width < 43.5 || rect.height < 43.5);
        }).map(button => ({ name: button.getAttribute('aria-label') || button.textContent.trim(), width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height }));
        return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, statsInside: stats.left >= card.left && stats.right <= card.right && stats.bottom <= card.bottom, smallButtons };
      });
      check('Pas de débordement horizontal à ' + width + ' px', sizes.scrollWidth <= width, sizes);
      check('Les indicateurs du héro restent dans leur carte à ' + width + ' px', sizes.statsInside);
      const imageRect = await rect('.vf-dashboard img.vf-body-image');
      const glowRect = await rect('.vf-dashboard .vf-body-glow');
      check('L’animation des pectoraux reste alignée au corps à ' + width + ' px', near(imageRect.x, glowRect.x) && near(imageRect.y, glowRect.y) && near(imageRect.width, glowRect.width) && near(imageRect.height, glowRect.height), { imageRect, glowRect });
      check('Boutons tactiles suffisants à ' + width + ' px', sizes.smallButtons.length === 0, sizes.smallButtons);
      report.layouts.push(sizes);
      if (width === 390) await page.screenshot({ path: path.join(output, 'accueil-mobile-390.png'), fullPage: true });
      if (width <= 430) {
        await page.locator('.vf-home-jumps a[href="#vf-daily-steps"]').click();
        const stepsTop = await page.locator('#vf-daily-steps').evaluate(el => el.getBoundingClientRect().top);
        check('Le raccourci mobile mène aux pas à ' + width + ' px', stepsTop >= 60 && stepsTop < 240, { stepsTop });
        await page.evaluate(() => scrollTo(0, 0));
      }
    }

    await page.locator('#vf-avatar-button').click();
    const pecColors = [], ringColors = [];
    for (const key of ['lime', 'red', 'orange', 'cyan', 'blue', 'violet', 'pink']) {
      await page.locator('[data-accent="' + key + '"]').click();
      check('Accent ' + key + ' sélectionné', await page.locator('[data-accent="' + key + '"]').getAttribute('aria-pressed') === 'true');
      pecColors.push(await page.locator('.vf-pec-outline').first().evaluate(el => {
        const style = getComputedStyle(el);
        return [style.stroke, style.fill, style.filter].join('|');
      }));
      ringColors.push(await page.locator('.vf-ring-value').first().evaluate(el => getComputedStyle(el).stroke));
    }
    check('Les sept accents recolorent les pectoraux', new Set(pecColors).size === 7, pecColors);
    check('Les sept accents recolorent l’activité', new Set(ringColors).size === 7, ringColors);
    await page.keyboard.press('Escape');
    check('Échap ferme le menu avatar', await page.locator('#vf-avatar-menu').count() === 0);

    // Scénario déterministe : les anneaux utilisent l’activité, pas les calories des repas.
    await page.evaluate(() => {
      const day = vfDateAgo(0), recent = vfDateAgo(3), month = vfDateAgo(15), old = vfDateAgo(45);
      DB.activity = {
        [day]: { activeCalories: 300, standHours: 5, distanceKm: 2.5, floors: 4, energy: 70, recovery: 80 },
        [recent]: { activeCalories: 200, standHours: 4, distanceKm: 1, floors: 2 },
        [month]: { activeCalories: 150, standHours: 3 },
        [old]: { activeCalories: 900, standHours: 8 }
      };
      const source = DB.sessions[0];
      DB.sessions = [[day, 1200], [recent, 600], [month, 1800], [old, 3600]].map(([date, duration], index) => ({ ...source, id: 'home-fixture-' + index, date, iso: date + 'T12:00:00.000Z', duration }));
      DB.meals = [{ ...DB.meals[0], kcal: 9999 }];
      nav('home');
    });
    const activityValues = () => page.locator('.vf-dashboard .vf-activity [data-vf-count]').evaluateAll(elements => elements.map(el => Number(el.dataset.vfCount)));
    for (const [period, expected] of [['today', [300, 20, 5]], ['week', [500, 30, 9]], ['month', [650, 60, 12]]]) {
      await page.locator('#vf-activite').selectOption(period);
      check('Période ' + period + ' : calories actives, minutes de séance, heures debout exactes', JSON.stringify(await activityValues()) === JSON.stringify(expected), await activityValues());
    }
    check('Le champ de période conserve le focus après recalcul', await page.locator('#vf-activite').evaluate(el => el === document.activeElement));
    await page.evaluate(() => { DB.activity = {}; vfActivityPeriod = 'today'; render(); });
    check('Les données d’activité absentes restent signalées', await page.locator('.vf-dashboard .vf-activity').innerText().then(text => (text.match(/—/g) || []).length >= 2));
    await page.evaluate(() => { DB.activity[vfDateAgo(0)] = { activeCalories: 0, standHours: 0 }; render(); });
    check('Des zéros saisis restent des zéros explicites', JSON.stringify(await activityValues()) === JSON.stringify([0, 20, 0]));

    // Le vrai carnet persiste les saisies et la préférence d’animation ; la démo ne persiste pas.
    await page.goto(base + '/index.html');
    await page.evaluate(() => {
      const email = 'accueil-test@forge.example';
      AUTH = { [email]: { email, name: 'Test accueil' } };
      localStorage.setItem('forge_accounts_v1', JSON.stringify(AUTH));
      localStorage.setItem('forge_session_v1', email);
      DB = defaultDB(); DB.profile.setup = true; DB.profile.name = 'Test accueil';
      commitUserDB(DB); view = 'home'; render();
    });
    await assertBodyLoaded(page, 'Le vrai carnet charge le corps depuis son fichier local');
    await page.evaluate(() => openActivityModal());
    await page.locator('#forge-activity-activeCalories').fill('-1');
    await page.locator('#modalbox').getByRole('button', { name: /Enregistrer/ }).click();
    check('Une saisie d’activité invalide ne modifie pas le carnet', await page.evaluate(() => Object.keys(DB.activity).length === 0) && await page.locator('#forge-activity-activeCalories').isVisible());
    for (const [field, value] of [['activeCalories', '350'], ['standHours', '6.5'], ['distanceKm', '3.2'], ['floors', '8'], ['energy', '76'], ['recovery', '83']]) {
      await page.locator('#forge-activity-' + field).fill(value);
    }
    await page.locator('#modalbox').getByRole('button', { name: /Enregistrer/ }).click();
    check('Le formulaire enregistre les six relevés', await page.evaluate(() => {
      const value = DB.activity[vfDateAgo(0)];
      return value.activeCalories === 350 && value.standHours === 6.5 && value.distanceKm === 3.2 && value.floors === 8 && value.energy === 76 && value.recovery === 83;
    }));
    await page.evaluate(() => vfOpenSteps());
    await page.locator('#vf-steps-value').fill('12345');
    await page.getByRole('button', { name: 'Enregistrer les pas', exact: true }).click();
    await page.locator('.vf-motion-toggle').first().click();
    check('Le carnet permet de désactiver son animation', await page.locator('.vf-motion-toggle').first().getAttribute('aria-pressed') === 'false');
    await page.reload();
    await page.locator('.vf-dashboard').waitFor();
    check('Activité et pas persistent après rechargement', await page.evaluate(() => DB.activity[vfDateAgo(0)].activeCalories === 350 && DB.activity[vfDateAgo(0)].standHours === 6.5 && DB.steps[vfDateAgo(0)] === 12345));
    check('La préférence d’animation persiste après rechargement', await page.locator('.vf-motion-toggle').first().getAttribute('aria-pressed') === 'false');
    check('Les nouveaux relevés sont compatibles avec l’export/import', await page.evaluate(() => {
      const restored = validateBackup(JSON.parse(JSON.stringify(DB)));
      return restored.activity[vfDateAgo(0)].distanceKm === 3.2 && restored.activity[vfDateAgo(0)].energy === 76;
    }));
    check('L’import refuse une durée debout impossible', await page.evaluate(() => {
      const invalid = JSON.parse(JSON.stringify(DB)); invalid.activity[vfDateAgo(0)].standHours = 25;
      try { validateBackup(invalid); return false; } catch { return true; }
    }));
    await page.goto(base + '/APERCU.html');
    await page.locator('.vf-dashboard').waitFor();

    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.evaluate(() => { nav('home'); scrollTo(0, 0); });
    await page.waitForTimeout(200);
    check('Les pectoraux sont animés en mode normal', await bodyMotion() > 0);
    const toggle = page.locator('.vf-motion-toggle').first();
    check('Le bouton annonce une animation active', await toggle.getAttribute('aria-pressed') === 'true');
    await toggle.click();
    check('Le bouton permet de suspendre l’animation', await toggle.getAttribute('aria-pressed') === 'false' && await bodyMotion() === 0);
    await toggle.click();
    check('Le bouton permet de relancer l’animation', await toggle.getAttribute('aria-pressed') === 'true' && await bodyMotion() > 0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    check('La préférence de mouvement réduit immobilise le corps', await bodyMotion() === 0);

    // Document neuf : les globals et le stockage isolé ne sont pas réinitialisables avec setContent sur le même document.
    await context.setOffline(true);
    const offlinePage = await context.newPage();
    captureErrors(offlinePage);
    await offlinePage.setContent(fs.readFileSync(path.join(root, 'APERCU.html'), 'utf8'));
    await offlinePage.locator('.vf-dashboard').waitFor();
    await assertBodyLoaded(offlinePage, 'Le corps et le dashboard fonctionnent dans le HTML sans réseau');
    check('La démonstration autonome garde un stockage isolé', await offlinePage.evaluate(() => window.__forgeDemoIsolated === true));
    await offlinePage.close();
    await context.setOffline(false);

    check('Aucune exception JavaScript', report.errors.length === 0, report.errors);
    report.passed = report.checks.length;
    report.failed = 0;
    report.sourceFileSha256 = sourceHashes();
    report.sourceSha256 = sha256(Buffer.from(JSON.stringify(report.sourceFileSha256)));
    report.apercuSha256 = sha256(fs.readFileSync(path.join(root, 'APERCU.html')));
    report.testSha256 = sha256(fs.readFileSync(__filename));
    report.finishedAt = new Date().toISOString();
    assert.deepEqual(report.sourceFileSha256, initialSourceHashes, 'Les sources ont changé pendant les tests.');
    assert.equal(report.apercuSha256, initialApercuHash, 'APERCU.html a changé pendant les tests.');
    fs.writeFileSync(path.join(output, 'home-video-results.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ passed: report.passed, failed: report.failed, output }));
  } catch (error) {
    report.passed = report.checks.filter(check => check.status === 'passed').length;
    report.failed = report.checks.filter(check => check.status === 'failed').length || 1;
    report.failure = error.stack;
    await page.screenshot({ path: path.join(output, 'accueil-echec.png'), fullPage: true }).catch(() => {});
    fs.writeFileSync(path.join(output, 'home-video-failure.json'), JSON.stringify(report, null, 2));
    throw error;
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
