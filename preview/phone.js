/* Chaque aperçu utilise son propre stockage en mémoire. */
(() => {
  'use strict';
  const selector = document.getElementById('third-screen');
  const frame = document.getElementById('explore-frame');
  selector.addEventListener('change', () => { frame.src = 'demo.html?screen=' + encodeURIComponent(selector.value); });
  document.getElementById('reset-demos').addEventListener('click', () => {
    document.querySelectorAll('iframe').forEach(iframe => { iframe.src = iframe.getAttribute('src'); });
  });
})();
