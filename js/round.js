// Setting up and starting a round.

// ─── ROUND ───
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function resetScene() {
  for (const el of plates.values()) el.remove();
  plates.clear();
  $('stack').innerHTML = '';
  // clear anything left over from the last round so the roll always starts at the left of the mat
  for (const id of ['roll', 'sheet', 'matGlow']) $(id).getAnimations().forEach(a => a.cancel());
  $('roll').classList.remove('show', 'spinning', 'landing');
  $('matGlow').classList.add('off');
  $('roll').style.left = ROLL_START + 'px';
  $('roll').style.width = '40px';
  $('roll').style.transform = '';
  $('sheet').classList.remove('on', 'revealed', 'hurry');
  $('controls').classList.remove('up');
  $('tap').classList.remove('show');
  beltShift = 0;
  $('belt').style.backgroundPosition = '0 0';
  renderTickets();
}

function setupBelt(shuffled) {
  order = shuffled ? shuffle(room.items.slice()) : room.items.slice();
  idx = 0; opened = 0; cash = CONFIG.budget; picks = []; seen = []; phase = 'busy';
  resetScene();
  dealLooks();
  for (let j = 0; j <= AHEAD; j++) addPlate(j, j);
  updateHud();
}

function startRound(shuffled) {
  renderStreak();
  requestAnimationFrame(fitStreak);
  $('stage').classList.remove('closing');
  Sound.init();
  Sound.humOn();
  round++;
  practice = shuffled;
  $('hudMode').textContent = practice ? 'Practice' : "Today's round";
  $('hudMode').classList.toggle('practice', practice);
  clearInterval(timerId);
  for (const id of ['results', 'home', 'roomMenu']) $(id).classList.remove('show');
  setupBelt(shuffled);
  resetSkip();
  $('skip').hidden = false;
  // the chef remembers how many of today's rooms you've already played
  const cleared = clearedCount();
  if (practice) chefSay(['Welcome back!', 'One more round?', 'Hungry again?'][Math.floor(Math.random() * 3)]);
  else if (cleared === 2) chefSay('Last room. Go for the full house!', 2200);
  else if (cleared === 1) chefSay('Back again! ' + room.greet, 2000);
  else chefSay(room.greet);
  chefPose('bow', cleared === 2 && !practice ? 1500 : 900);
  setTimeout(arrive, 650);
}
