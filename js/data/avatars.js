/* FORGE — Avatars originaux embarqués : disponibles hors ligne, sans service tiers. */
const AVATARS=[['#DCE5D7','#315648'],['#EBDDCB','#866D4B'],['#D5E3E8','#41616D'],['#E3DCEC','#756083']].map(([bg,ink])=>
 'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="${bg}"/><circle cx="50" cy="39" r="16" fill="${ink}"/><path d="M17 94c1-25 15-38 33-38s32 13 33 38" fill="${ink}"/></svg>`)
);
