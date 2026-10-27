// Opening a plate: the roll hops onto the mat and unrolls the item sheet.

// ─── UNROLL ───
function fillSheet(it) {
  const r = RARITY[it.rarity];
  $('sheet').style.setProperty('--plate', r.color);
  $('cat').innerHTML = `<i></i>${it.role} · ${r.label}`;
  const len = it.name.length;
  $('name').style.fontSize = (len <= 9 ? 30 : len <= 13 ? 24 : len <= 20 ? 20 : 17) + 'px';
  $('name').classList.remove('pop');
  let k = 0;
  $('name').innerHTML = it.name.split(' ').map(word =>
    `<span class="w">${[...word].map(c =>
      `<span class="ch" style="--r:${(Math.random() * 4 - 2).toFixed(1)}deg;--d:${(k++) * 30}ms">${c}</span>`).join('')}</span>`
  ).join(' ');
  $('sticker').textContent = `$${r.price}`;
  $('afford').classList.toggle('on', r.price > cash);
  $('sheet').classList.remove('revealed');
}

function sparkle(x, y) {
  const s = $('sparkle');
  const colors = ['#e8784c', '#7fae4c', '#fff', '#e0b04a'];
  s.style.left = x + 'px';
  s.style.top = y + 'px';
  s.innerHTML = Array.from({ length: 10 }, (_, i) => `<span style="--a:${i * 36}deg;--c:${colors[i % 4]}"></span>`).join('');
  s.classList.remove('go');
  s.offsetWidth;
  s.classList.add('go');
}

async function unroll() {
  phase = 'busy';
  $('tap').classList.remove('show');
  const it = order[idx];
  const plate = plates.get(idx);
  plate.classList.remove('current');
  plate.querySelector('.pc').style.visibility = 'hidden';
  opened = idx + 1;
  updateHud();
  fillSheet(it);

  const roll = $('roll'), sheet = $('sheet');
  roll.getAnimations().forEach(a => a.cancel());
  sheet.getAnimations().forEach(a => a.cancel());
  roll.style.left = ROLL_START + 'px';
  roll.style.width = '40px';
  const piece = SUSHI[looks[idx].kind], fill = piece.fill || SUSHI[0].fill, mat = MAT[piece.name] || {};
  roll.style.setProperty('--f1', fill[0]);
  roll.style.setProperty('--f2', fill[1]);
  for (const [el, k] of [[roll, 'skin'], [roll, 'cap'], [sheet, 'edge']])
    mat[k] ? el.style.setProperty('--' + k, mat[k]) : el.style.removeProperty('--' + k);
  // hop from the plate onto the mat, landing at the left end where the unroll starts. The roll is placed
  // on the plate before it becomes visible, so no frame ever shows it anywhere else first.
  const hop = plateHop();
  roll.style.transform = hop.at.transform;
  roll.classList.add('show', 'landing');
  await roll.animate([hop.at, hop.mid, hop.rest],
    { duration: 560, easing: 'cubic-bezier(.3,.6,.4,1)' }).finished;
  roll.style.transform = '';
  // gather itself
  await roll.animate([{ transform: 'none' }, { transform: 'scale(1.22, .86)' }, { transform: 'scale(.92, 1.06)' }, { transform: 'none' }],
    { duration: 300, easing: 'ease-in-out' }).finished;
  // roll across the mat, laying the sheet out behind it, while the mat glows in the plate's colour
  sheet.classList.add('on');
  Sound.unroll();
  const glow = $('matGlow');
  glow.style.setProperty('--plate', RARITY[it.rarity].color);
  glow.classList.toggle('gold', it.rarity === 'Gold');
  glow.getAnimations().forEach(a => a.cancel());
  glow.classList.remove('off');
  glow.animate([{ opacity: 0 }, { opacity: it.rarity === 'Gold' ? .95 : .6, offset: .6 }, { opacity: it.rarity === 'Gold' ? .55 : .25 }],
    { duration: 1300, easing: 'ease-out', fill: 'forwards' });
  roll.classList.remove('landing');
  roll.classList.add('spinning');
  const opts = { duration: 880, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' };
  const rolling = roll.animate([{ left: ROLL_START + 'px', width: '40px' }, { left: ROLL_END + 'px', width: '14px' }], opts);
  sheet.animate([{ clipPath: `inset(0 ${SHEET_HIDDEN}px 0 0)` }, { clipPath: 'inset(0 0px 0 0)' }], opts);
  await rolling.finished;
  roll.classList.remove('spinning');
  sparkle(ROLL_END + 7, 466);
  await roll.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3)', offset: .4 }, { transform: 'scale(0)' }],
    { duration: 220, fill: 'forwards' }).finished;

  $('name').classList.add('pop');
  sheet.classList.add('revealed');
  plate.querySelector('.rim').setAttribute('stroke', RARITY[it.rarity].color);
  seen[idx] = 'passed';

  const affordable = priceOf(it) <= cash;
  $('btnTake').disabled = !affordable;
  $('btnTake').textContent = affordable ? `Take · $${priceOf(it)}` : "Can't afford";
  $('controls').classList.add('up');
  startTimer();
  phase = 'deciding';
  chefPose('look');
  if (tutorial && idx === 0) chefSay(TUTORIAL.unroll, 0, true);
}

// The hop between the plate and the mat, as keyframes for the roll. The roll always starts / ends at its
// resting spot at the left end of the mat (left ROLL_START, 40 × 124, centre 84, 466 in core units), and
// every keyframe pins left and width there, so nothing left over from rolling across the mat can move it.
// The plate is measured as it is on screen right now, so the roll lands exactly on the sushi piece on every
// screen size and zoom. Only the piece counts (not the wasabi or ginger beside it), centred on the plate.
// `at` is the roll squashed to the piece's size right on top of it, `mid` halfway along the straight line
// (lifted a touch), `rest` the roll on the mat. They share one list of transform functions so every browser
// blends them smoothly instead of jumping.
function plateHop() {
  const c = $('core').getBoundingClientRect(), k = c.width / 360; // screen pixels per core unit
  const svg = plates.get(idx).querySelector('svg'), s = svg.getBoundingClientRect();
  let box = { y: 19, width: 28, height: 24 };                      // a typical piece, in the plate's 80×60 units
  try { const b = svg.querySelector('.pc').getBBox(); if (b.width > 0 && b.height > 0) box = b; } catch {}
  const px = (s.left - c.left) / k + 40 * s.width / k / 80;
  const py = (s.top - c.top) / k + (box.y + box.height / 2) * s.height / k / 60;
  const ok = v => (Number.isFinite(v) ? Math.round(v * 100) / 100 : 0);
  const dx = ok(px - (ROLL_START + 20)), dy = ok(py - (404 + 62));
  const w = ok(box.width * s.width / k / 80 / 40) || .7, h = ok(box.height * s.height / k / 60 / 124) || .2;
  const frame = (x, y, a, b, deg) => ({
    left: ROLL_START + 'px', width: '40px',
    transform: `translate(${x}px, ${y}px) scale(${a}, ${b}) rotate(${deg}deg)`,
  });
  return {
    at: frame(dx, dy, w, h, 0),
    mid: { ...frame(dx * .5, dy * .5 - 14, (1 + w) / 2, (1 + h) / 2, -8), offset: .5 },
    rest: frame(0, 0, 1, 1, 0),
  };
}

async function reroll() {
  const roll = $('roll'), sheet = $('sheet');
  $('controls').classList.remove('up');
  sheet.classList.remove('hurry', 'revealed');
  // the glow goes the moment you decide, not when the next plate arrives
  $('matGlow').classList.add('off');
  $('matGlow').getAnimations().forEach(a => a.cancel());
  roll.getAnimations().forEach(a => a.cancel());
  sheet.getAnimations().forEach(a => a.cancel());
  const opts = { duration: 380, easing: 'cubic-bezier(.5,0,.6,1)', fill: 'forwards' };
  const back = roll.animate([{ left: ROLL_END + 'px', width: '14px', transform: 'scale(.5)' }, { left: ROLL_START + 'px', width: '40px', transform: 'none' }], opts);
  sheet.animate([{ clipPath: 'inset(0 0px 0 0)' }, { clipPath: `inset(0 ${SHEET_HIDDEN}px 0 0)` }], opts);
  await back.finished;
  sheet.classList.remove('on', 'revealed');
  sheet.getAnimations().forEach(a => a.cancel());
  // pin it where the roll-up ended before clearing the roll-up, so it can't jump anywhere in between
  roll.style.left = ROLL_START + 'px';
  roll.style.width = '40px';
  roll.getAnimations().forEach(a => a.cancel());
  // glide from there straight into the plate it came from
  const hop = plateHop();
  await roll.animate([hop.rest, hop.mid, hop.at],
    { duration: 420, easing: 'cubic-bezier(.5,0,.6,1)', fill: 'forwards' }).finished;
  // swap in one frame: the roll is gone the moment the piece is back on the plate, so the two never
  // show together (on a nigiri or roe plate the squashed roll would look like a second copy on top)
  const plate = plates.get(idx);
  roll.classList.remove('show');
  if (plate) plate.querySelector('.pc').style.visibility = '';
  roll.getAnimations().forEach(a => a.cancel());
}
