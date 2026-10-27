// Round state, and scaling the stage to fit the window.

// ─── STATE ───
let room = ROOMS.game, roomKey = 'game', practice = false;
let order, idx, cash, picks, seen, phase, timerId, beltShift, round = 0, endReason;
let opened = 0; // plates unrolled so far: the HUD counts a plate as soon as you tap it
const plates = new Map(); // index in order -> plate element on the belt

// ─── STAGE SCALE ───
// The 360×640 core always fits on screen; the stage grows around it to fill the window.
const MAX_W = 1440, MAX_H = 860;
let AHEAD = 4; // plates drawn on each side of the seat, enough to reach the screen edge
function fit() {
  if (!innerWidth || !innerHeight) return; // not laid out yet (e.g. a hidden frame): keep the defaults until it is
  const k = Math.min(innerWidth / 360, innerHeight / 640);
  const w = Math.min(innerWidth / k, MAX_W), h = Math.min(innerHeight / k, MAX_H);
  const st = $('stage').style;
  st.setProperty('--k', k);
  st.setProperty('--w', w);
  st.setProperty('--h', h);
  $('stage').classList.toggle('fill', innerWidth / k <= MAX_W + 1 && innerHeight / k <= MAX_H + 1 && (w > 361 || h > 641));
  AHEAD = Math.ceil((w / 2 + 60) / GAP) + 1;
}
addEventListener('resize', fit);
fit();
// the streak lanterns hang between the top-bar pills only when there's room (they're always on the home screen)
function fitStreak() {
  const a = document.querySelector('.pill.audio').getBoundingClientRect(), b = document.querySelector('.room-pill').getBoundingClientRect();
  const k = $('core').getBoundingClientRect().width / 360;
  $('streak').style.visibility = (b.left - a.right) / k > 110 ? '' : 'hidden';
}
addEventListener('resize', fitStreak);
requestAnimationFrame(fitStreak);
