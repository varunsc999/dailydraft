// The conveyor belt: dealing plates, moving the belt, the next plate arriving.

// ─── BELT ───
// a fresh random look for every plate in the round, never the same piece twice in a row
let looks = [];
function dealLooks() {
  looks = [];
  for (let j = 0; j < order.length; j++) {
    let kind;
    do kind = Math.floor(Math.random() * SUSHI.length); while (j && kind === looks[j - 1].kind);
    looks.push({ kind, garnish: Math.random() < .55 ? 0 : 1 + Math.floor(Math.random() * 2) });
  }
}

function addPlate(j, offset) {
  if (j < 0 || j >= order.length || plates.has(j)) return;
  const el = document.createElement('div');
  el.className = 'bplate';
  el.innerHTML = plateSvg(looks[j]);
  el.style.left = (SEAT_X + offset * GAP - 40) + 'px';
  el.addEventListener('click', () => { if (j === idx && phase === 'waiting') unroll(); });
  $('plates').append(el);
  plates.set(j, el);
}

function layoutBelt() {
  for (const [j, el] of plates) el.style.left = (SEAT_X + (j - idx) * GAP - 40) + 'px';
}

function nothingAffordable() {
  return !order.slice(idx).some(it => priceOf(it) <= cash);
}

async function advance() {
  for (let j = idx + 1; j <= idx + AHEAD; j++) addPlate(j, j - idx);
  $('plates').offsetWidth; // place incoming plates before the belt moves
  idx++;
  beltShift -= GAP;
  $('belt').style.backgroundPosition = `${beltShift}px 0`;
  layoutBelt();
  updateHud();
  await sleep(900);
  for (const [j, el] of plates) if (j < idx - AHEAD) { el.remove(); plates.delete(j); }
  seatsGrab();

  if (picks.length >= CONFIG.slots) return finish('Your tray is full.');
  if (idx >= order.length) return finish('That was the last plate.');
  if (nothingAffordable()) return finish("You can't afford anything left on the belt.");
  arrive();
}

async function arrive() {
  const el = plates.get(idx);
  el.classList.add('current');
  await el.querySelector('.dome').animate(
    [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-20px)', opacity: 0 }],
    { duration: 360, easing: 'ease-out', fill: 'forwards' }).finished;
  if (phase === 'done') return;
  $('tap').classList.add('show');
  phase = 'waiting';
  if (tutorial && idx === 0) chefSay(TUTORIAL.arrive, 0, true);
}
