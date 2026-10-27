// Order tickets, the timer, take / pass / "I'm full", and the top bar.

// ─── ORDER TICKETS ───
// One paper ticket per slot hangs on the rail above the window, so you can always see what you took.
function renderTickets(fresh) {
  $('tickets').innerHTML = Array.from({ length: CONFIG.slots }, (_, i) => {
    const it = picks[i], x = i * 58;
    if (!it) return `<div class="ticket empty" style="left:${x}px"><div class="pin"></div><div class="slip">${i + 1}</div></div>`;
    return `<div class="ticket filled${i === fresh ? ' new' : ''}" style="left:${x}px;--plate:${RARITY[it.rarity].color};--d:${-i * .7}s">
      <div class="pin"></div><div class="val">${it.value}</div>
      <div class="slip"><div class="tn">${it.name}</div><div class="tm"><span>${it.role}</span><b>$${priceOf(it)}</b></div></div>
    </div>`;
  }).join('');
  const t = $('tickets').querySelector('.new');
  if (t) t.addEventListener('animationend', () => t.classList.remove('new'), { once: true });
  renderMenuTags(fresh === undefined ? null : picks[fresh].role);
}

// The wall menu lists this room's categories. A stamp shows how many of your plates are in each.
function renderMenuTags(freshRole) {
  $('menuTags').innerHTML = room.cats.map((c, i) => {
    const n = picks.filter(p => p.role === c).length;
    const stamp = n ? `<i class="${c === freshRole ? 'new' : ''}">${n > 1 ? '×' + n : '済'}</i>` : '';
    return `<div class="mtag${n > 1 ? ' dup' : ''}" style="--d:${-i * 1.3}s"><span>${c}</span>${stamp}</div>`;
  }).join('');
}

// ─── TIMER ───
function startTimer() {
  let left = CONFIG.timerSeconds;
  const draw = () => {
    $('timerSec').textContent = left;
    $('timerBar').style.strokeDashoffset = String(100.5 * (1 - left / CONFIG.timerSeconds));
    $('timer').classList.toggle('low', left <= 3);
    $('sheet').classList.toggle('hurry', left <= 3 && left > 0);
  };
  draw();
  clearInterval(timerId);
  timerId = setInterval(() => {
    left--;
    draw();
    if (left > 0 && left <= 3) {
      Sound.tick(left === 1);
      if (left === 3) chefPose('glance');
    }
    if (left <= 0) { clearInterval(timerId); pass(true); }
  }, 1000);
}

// ─── DECISIONS ───
// Once you've decided on a plate, its hidden value pops up above your seat for a moment.
function flashWorth(it, took) {
  const el = document.createElement('div');
  el.className = 'worth' + (took ? ' took' : '');
  el.style.left = SEAT_X + 'px';
  el.innerHTML = `${it.name.length > 18 ? it.name.slice(0, 17) + '…' : it.name} was worth <b>${it.value}</b>`;
  $('core').append(el);
  setTimeout(() => el.remove(), 1700);
}
// In a real round the server records the decision and only then reveals the plate's value (and how it ranks
// among today's plates). The request goes out as the roll packs up, so there's no wait. Practice is all local.
async function decide(it, took) {
  if (practice) return room.items.filter(o => o.value > it.value).length / room.items.length;
  const r = await Backend.decide(roomKey, idx, took);
  it.value = r.value;
  return r.rank;
}

async function take() {
  const it = order[idx];
  if (phase !== 'deciding' || priceOf(it) > cash) return;
  phase = 'busy';
  clearInterval(timerId);
  const told = decide(it, true);
  told.catch(() => {}); // handled below, once the roll has packed up
  await reroll();
  let rank;
  try { rank = await told; } catch (e) { lostConnection(e); return; }
  Sound.take();
  flashWorth(it, true);
  // the chef reacts to how good the plate really was, compared with the rest of today's sale
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  if (rank < .25) {
    if (!tutorialStep()) chefSay(pick(['Sugoi!', 'Great pick!', 'The best!']));
    chefPose('happy wow', 1700);
  } else if (rank >= .75) {
    if (!tutorialStep()) chefSay(pick(['Hmm…', 'Brave choice…', 'Are you sure?']));
    chefPose('wince', 1500);
  } else {
    if (!tutorialStep()) chefSay(pick(['Oishii!', 'Good pick!', 'Nice choice.']));
    chefPose('happy', 1400);
  }
  cash -= priceOf(it);
  const n = picks.length;
  picks.push(it);
  seen[idx] = 'taken';
  updateHud(true);

  // the plate goes straight from the belt onto your stack, shrinking to the stacked plate's size
  const plate = plates.get(idx);
  const s = document.createElement('div');
  s.className = 'splate';
  s.style.setProperty('--plate', RARITY[it.rarity].color);
  s.style.top = (526 - n * 9) + 'px';
  s.style.visibility = 'hidden';
  s.style.animation = 'none'; // measure where it rests, not where its landing bounce starts
  $('stack').append(s);
  const k = $('core').getBoundingClientRect().width / 360;
  const pr = plate.getBoundingClientRect(), rim = plate.querySelector('.rim').getBoundingClientRect(), to = s.getBoundingClientRect();
  const scale = to.width / rim.width;
  const ox = pr.left + pr.width / 2, oy = pr.top + pr.height / 2; // transform origin: the plate's centre
  const dx = (to.left + to.width / 2 - (ox + (rim.left + rim.width / 2 - ox) * scale)) / k;
  const dy = (to.top + to.height / 2 - (oy + (rim.top + rim.height / 2 - oy) * scale)) / k;
  plate.querySelector('.pc').animate([{ opacity: 1 }, { opacity: 1, offset: .6 }, { opacity: 0 }], { duration: 520, fill: 'forwards' });
  await plate.animate(
    [{ transform: 'none' }, { transform: `translate(${dx / 2}px, ${dy / 2 - 18}px) scale(${(1 + scale) / 2})`, offset: .5 }, { transform: `translate(${dx}px, ${dy}px) scale(${scale})` }],
    { duration: 520, easing: 'ease-in-out', fill: 'forwards' }).finished;
  plate.remove();
  plates.delete(idx);
  Sound.clink();
  s.remove();
  s.style.visibility = '';
  s.style.animation = '';
  $('stack').append(s); // re-added so its little landing bounce plays now
  renderTickets(n);
  await advance();
}

async function pass(timedOut = false) {
  if (phase !== 'deciding') return;
  phase = 'busy';
  clearInterval(timerId);
  Sound.pass();
  const told = decide(order[idx], false);
  told.catch(() => {});
  await reroll();
  try { await told; } catch (e) { lostConnection(e); return; }
  flashWorth(order[idx], false);
  if (!tutorialStep()) chefSay(timedOut ? 'Too slow…' : 'Next plate!');
  chefPose(timedOut ? 'cross' : 'shrug', timedOut ? 1700 : 1200);
  await advance();
}

// "I'm full": first tap asks, second tap ends the round and keeps the cash.
let skipArmed = false, skipTimer;
async function skipRest() {
  if (!skipArmed) {
    skipArmed = true;
    $('skip').classList.add('confirm');
    $('skip').textContent = `Skip the last ${order.length - idx}? Tap again`;
    clearTimeout(skipTimer);
    skipTimer = setTimeout(resetSkip, 2500);
    return;
  }
  resetSkip();
  if (phase === 'deciding') {
    phase = 'busy';
    clearInterval(timerId);
    await reroll();
  } else if (phase !== 'waiting') return;
  phase = 'busy';
  $('tap').classList.remove('show');
  chefSay('Arigatō!');
  chefPose('bow', 1800);
  await sleep(500);
  finish('You said you were full.');
}
function resetSkip() {
  skipArmed = false;
  clearTimeout(skipTimer);
  $('skip').classList.remove('confirm');
  $('skip').textContent = "I'm full · skip the rest";
}

// ─── HUD ───
function updateHud(bump) {
  $('hudCash').textContent = `$${cash}`;
  $('hudPlate').textContent = `${opened}/${order.length}`;
  if (bump) {
    $('hudCash').classList.remove('bump');
    $('hudCash').offsetWidth;
    $('hudCash').classList.add('bump');
  }
}
