/* Stockage isolé AVANT l’app : aucune donnée personnelle lue ou écrite. */
(() => {
  'use strict';
  const memoryStorage = () => {
    const values = new Map();
    return {
      get length() { return values.size; },
      key(index) { return [...values.keys()][index] ?? null; },
      getItem(key) { return values.get(String(key)) ?? null; },
      setItem(key, value) { values.set(String(key), String(value)); },
      removeItem(key) { values.delete(String(key)); },
      clear() { values.clear(); }
    };
  };
  try {
    const local = memoryStorage();
    const session = memoryStorage();
    Object.defineProperty(window, 'localStorage', { value: local, configurable: false });
    Object.defineProperty(window, 'sessionStorage', { value: session, configurable: false });
    window.__forgeDemoIsolated = window.localStorage === local && window.sessionStorage === session;
    session.setItem('forgeSplash', '1');
  } catch (_) {
    document.open();
    document.write('<!doctype html><html lang="fr"><meta charset="utf-8"><title>Aperçu indisponible</title><body><p>Ce navigateur ne permet pas l’aperçu isolé. Ouvre l’application avec un navigateur récent.</p></body></html>');
    document.close();
    window.stop();
    throw new Error('Isolation impossible. Aperçu interrompu.');
  }
})();
