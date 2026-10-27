// The random sushi designs on the plates, and how the roll on the mat matches them.

// ─── BELT ───
// What sits under each dome is just for fun: it has nothing to do with the item, its price or the room.
// `fill` is the filling the big roll on the mat shows when the piece is a roll.
const maki = (a, b, c) => `
  <ellipse cx="40" cy="40" rx="14" ry="3.5" fill="rgba(0,0,0,.2)"/>
  <path d="M27 24 V37 Q27 41 40 41 Q53 41 53 37 V24Z" fill="url(#gNori)"/>
  <ellipse cx="40" cy="24" rx="13" ry="4.6" fill="#f7f2e7"/>
  <ellipse cx="40" cy="24" rx="13" ry="4.6" fill="none" stroke="#141d17" stroke-width="1.6"/>
  ${a}${b || ''}${c || ''}
  <ellipse cx="33" cy="23" rx="1" ry=".5" fill="#fff"/>
  <ellipse cx="47" cy="25" rx="1" ry=".5" fill="#fff"/>`;
const rice = `
  <ellipse cx="40" cy="41" rx="16" ry="3.4" fill="rgba(0,0,0,.2)"/>
  <path d="M25 37.6 Q24.4 32 30 31 H50 Q55.6 32 55 37.6 Q55 41.4 40 41.4 Q25 41.4 25 37.6Z" fill="url(#gRice)"/>
  <path d="M28 37 q1.4 .8 2.8 0 M35 38.4 q1.4 .8 2.8 0 M43 38 q1.4 .8 2.8 0 M49 37 q1.4 .8 2.8 0" stroke="#d8cfbd" stroke-width=".7" fill="none"/>`;
const drape = (fill, extra = '') => `${rice}
  <path d="M22 33.4 Q22.6 26.6 32 25.2 Q41 23.8 50 25 Q58.6 26.4 58.4 32 Q58 34.6 54 34 Q46 32.6 40 33 Q31 33.6 26 35 Q22 35.8 22 33.4Z" fill="${fill}"/>
  ${extra}
  <path d="M28 27 Q38 24.6 50 26" stroke="#fff" stroke-width=".9" fill="none" opacity=".55" stroke-linecap="round"/>`;
const SUSHI = [
  { name: 'salmon roll', fill: ['#e8784c', '#7fae4c'], svg: maki(
    '<ellipse cx="38.8" cy="24" rx="4.4" ry="1.8" fill="#e8784c"/>',
    '<ellipse cx="43.6" cy="24.4" rx="1.9" ry=".9" fill="#7fae4c"/>') },
  { name: 'tuna roll', fill: ['#c8343f', '#c8343f'], svg: maki(
    '<rect x="36.4" y="22.2" width="7.2" height="3.6" rx="1" fill="#c8343f"/>',
    '<rect x="37" y="22.6" width="3" height="1" rx=".5" fill="#ec7880" opacity=".7"/>') },
  { name: 'cucumber roll', fill: ['#6fa84a', '#cfe6a0'], svg: maki(
    '<ellipse cx="40" cy="24" rx="4" ry="1.9" fill="#4d8a34"/>',
    '<ellipse cx="40" cy="24" rx="2.6" ry="1.1" fill="#cfe6a0"/>',
    '<path d="M38.6 24 h2.8" stroke="#8fbf62" stroke-width=".5"/>') },
  { name: 'futomaki', fill: ['#f2c94a', '#e86f8f'], svg: maki(
    '<rect x="34" y="22.4" width="4.4" height="2" rx=".5" fill="#f2c94a"/><rect x="39" y="21.6" width="2.4" height="2.4" rx=".6" fill="#e86f8f"/>',
    '<rect x="42" y="23.2" width="4.4" height="1.6" rx=".5" fill="#6fa84a"/><rect x="36.6" y="24.8" width="5" height="1.4" rx=".5" fill="#e8784c"/>',
    '<rect x="42.4" y="25.2" width="2.6" height="1.2" rx=".4" fill="#7a4a2a"/>') },
  { name: 'rainbow roll', fill: ['#e8784c', '#7fae4c'], svg: `
    <ellipse cx="40" cy="40" rx="14" ry="3.5" fill="rgba(0,0,0,.2)"/>
    <path d="M27 24 V37 Q27 41 40 41 Q53 41 53 37 V24Z" fill="url(#gRice)"/>
    <path d="M27.4 30 Q28 33 31 34 M33 34.6 V37 M38 35 V39.6 M44 35 V39.6 M49 34.6 V37.4" stroke="#d8cfbd" stroke-width=".7" fill="none"/>
    <path d="M27 24 Q27 31 33 32 V36 Q28 35 27 31Z" fill="url(#gSalmon)"/>
    <path d="M33 32 Q40 33.4 47 32 V36.4 Q40 37.8 33 36.4Z" fill="#7fae4c"/>
    <path d="M47 32 Q53 31 53 24 V31 Q52 35 47 36.4Z" fill="url(#gTuna)"/>
    <ellipse cx="40" cy="24" rx="13" ry="4.6" fill="#f7f2e7"/>
    <ellipse cx="40" cy="24" rx="9.4" ry="3.2" fill="none" stroke="#141d17" stroke-width="1.1"/>
    <ellipse cx="40" cy="24" rx="3.4" ry="1.5" fill="#e8784c"/>
    <ellipse cx="43.4" cy="24.4" rx="1.4" ry=".7" fill="#7fae4c"/>
    <circle cx="31" cy="23" r=".45" fill="#3a2a20"/><circle cx="48" cy="25.4" r=".45" fill="#3a2a20"/><circle cx="35" cy="27" r=".45" fill="#3a2a20"/>` },
  { name: 'salmon nigiri', svg: drape('url(#gSalmon)',
    '<path d="M28 33.6 Q33 27.4 40 25 M36 33.2 Q41 27.4 48 25.2 M44 32.8 Q49 28.4 55 26.4" stroke="#ffe0cc" stroke-width="1.3" fill="none" opacity=".85"/>') },
  { name: 'tuna nigiri', svg: drape('url(#gTuna)',
    '<path d="M30 33 Q36 29 42 27.6" stroke="#f08a92" stroke-width=".8" fill="none" opacity=".6"/>') },
  { name: 'shrimp nigiri', svg: drape('#fbe9de',
    '<path d="M28 33.8 Q31 27 34 25 M34.6 33.2 Q37.6 26.4 41 24.4 M41.4 32.8 Q44.6 26.4 48 24.8 M48 33 Q51 27.4 54 26" stroke="#f0703e" stroke-width="2.4" fill="none"/>' +
    '<path d="M57.6 30.4 L62.4 25.6 L61.4 30.6 L64 32.4 L58.4 33Z" fill="#e0482c"/>') },
  { name: 'egg nigiri', svg: `${rice}
    <path d="M23 27.4 Q23 25 26 25 H54 Q57 25 57 27.4 V32.4 Q57 34 54 34 H26 Q23 34 23 32.4Z" fill="url(#gTamago)"/>
    <path d="M24 27.6 H56" stroke="#fff3b8" stroke-width=".8" opacity=".8"/>
    <path d="M24 30.4 H56" stroke="#d9a62c" stroke-width=".5" opacity=".7"/>
    <path d="M37 24.6 H43 V41.2 H37Z" fill="url(#gNori)"/>` },
  { name: 'salmon roe', svg: `
    <ellipse cx="40" cy="40.6" rx="15" ry="3.4" fill="rgba(0,0,0,.2)"/>
    <path d="M26 29 V37.6 Q26 41.6 40 41.6 Q54 41.6 54 37.6 V29Z" fill="url(#gNori)"/>
    <ellipse cx="40" cy="29" rx="14" ry="5" fill="#141d17"/>
    <ellipse cx="40" cy="28.6" rx="12.6" ry="4.2" fill="#d9531f"/>
    ${[[32, 28], [36, 26.6], [40, 28.2], [44, 26.8], [48, 28.4], [34.4, 30], [38.4, 30.4], [42.6, 30.2], [46.4, 30], [40, 25.8], [30, 29.6], [50, 29.8]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.7" fill="#f2752e"/><circle cx="${x - .5}" cy="${y - .6}" r=".5" fill="#ffd6b0"/>`).join('')}
    <path d="M45 24.6 Q49 21.4 52 24.6 Q49 26 45 24.6Z" fill="#7fae4c"/>` },
];
// How each piece looks as the big roll on the mat: its outside (skin), its rolled end (cap)
// and the colour of the sheet's border. Plain rolls keep the nori look with their own filling.
const SHADE = 'linear-gradient(90deg, rgba(0,0,0,.5), rgba(0,0,0,.08) 20%, rgba(255,255,255,.2) 34%, rgba(0,0,0,.05) 52%, rgba(0,0,0,.3) 80%, rgba(0,0,0,.55))';
const spiral = (a, b, rim) => `radial-gradient(ellipse at 50% 50%, ${b} 0 16%, ${a} 20% 38%, ${b} 41% 45%, ${a} 48% 62%, ${rim} 66%)`;
const MAT = {
  'rainbow roll': { edge: '#2a3a2f',
    skin: `${SHADE}, repeating-linear-gradient(160deg, #f07a45 0 12px, #7fae4c 12px 21px, #c8343f 21px 33px, #f7f2e7 33px 36px)`,
    cap: 'radial-gradient(ellipse 18% 26% at 46% 50%, #e8784c 70%, transparent 74%), radial-gradient(ellipse at 50% 50%, #f7f2e7 0 34%, #17221b 37% 41%, #f7f2e7 44% 58%, #e8784c 61%, #c9583a 66%)' },
  'salmon nigiri': { edge: '#ec7444',
    skin: `${SHADE}, repeating-linear-gradient(160deg, #f07a45 0 9px, #ffd9c0 9px 11px)`,
    cap: spiral('#f07a45', '#ffd9c0', '#c95f35') },
  'tuna nigiri': { edge: '#b52a35',
    skin: `${SHADE}, repeating-linear-gradient(160deg, #c8343f 0 14px, #dd5a62 14px 15px)`,
    cap: spiral('#c8343f', '#e8737a', '#8e1f29') },
  'shrimp nigiri': { edge: '#ee6c3c',
    skin: `${SHADE}, repeating-linear-gradient(0deg, #fbe9de 0 7px, #f0703e 7px 12px)`,
    cap: spiral('#f0703e', '#fbe9de', '#c9532a') },
  'egg nigiri': { edge: '#e2ad34',
    skin: `${SHADE}, linear-gradient(0deg, transparent 44%, #1a281f 44% 56%, transparent 56%), repeating-linear-gradient(0deg, #f6cd52 0 10px, #e8b83a 10px 11px)`,
    cap: spiral('#f6cd52', '#ffe9a0', '#c9962a') },
  'salmon roe': {
    cap: 'radial-gradient(circle, #ffc08a 0 .9px, transparent 1.5px) 0 0 / 5px 4px, radial-gradient(ellipse at 50% 50%, #e8601f 0 60%, #17221b 64%)' },
};
// a little wasabi and ginger on some plates
const GARNISH = [
  '',
  '<path d="M57 40.4 Q57.6 37.4 60 37.6 Q62.4 38 61.6 40.8 Q59.4 42 57 40.4Z" fill="#8fbf4a"/><path d="M58.4 38.6 q1 -.6 1.8 0" stroke="#c6e08a" stroke-width=".6" fill="none"/>',
  '<path d="M18 39.6 Q20 36.4 23.4 37.2 Q22.4 39.4 24.4 40.6 Q21 42.4 18 39.6Z" fill="#f4b5b0"/><path d="M19.4 39.4 Q21 38 22.6 38.4" stroke="#fde0dc" stroke-width=".6" fill="none"/>',
];

function plateSvg(look) {
  return `<svg viewBox="0 0 80 60">
    <ellipse cx="40" cy="46" rx="34" ry="9" fill="rgba(0,0,0,.38)"/>
    <ellipse class="rim" cx="40" cy="40" rx="35" ry="12.5" fill="url(#gPorcelain)" stroke="#d6cfc2" stroke-width="3.5"/>
    <ellipse cx="40" cy="40.5" rx="24" ry="7.5" fill="url(#gWell)"/>
    <g class="proll">${GARNISH[look.garnish]}<g class="pc">${SUSHI[look.kind].svg}</g></g>
    <g class="dome">
      <path d="M5 40 Q5 3 40 3 Q75 3 75 40" fill="url(#gGlass)" stroke="rgba(255,255,255,.5)" stroke-width="1"/>
      <path d="M14 32 Q15 13 32 8" stroke="rgba(255,255,255,.7)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M63 14 Q68 20 69 28" stroke="rgba(255,255,255,.3)" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <ellipse cx="40" cy="4" rx="5" ry="2.2" fill="rgba(255,255,255,.75)"/>
    </g>
  </svg>`;
}
