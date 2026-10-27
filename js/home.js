// The share card, the home screen and the room menu.

// The copied text uses emoji; the on-screen preview shows the same card with the game's icons.
function shareText() {
  const n = clearedCount();
  const lines = ROOM_KEYS.map(k => {
    const r = today[k];
    return r ? `${ROOMS[k].share} ${r.pct}%  ${r.plates.map(p => p ? RARITY[p].emoji : '⬛').join('')}` : `${ROOMS[k].share} --`;
  });
  return [`daily draft · No. ${MENU_NO}`, ...lines, n === 3 ? `🍣 full house! total ${totalPct()}%` : `🍣 ${n}/3 rooms cleared today`].join('\n');
}
function sharePreview() {
  const n = clearedCount();
  const dot = p => p ? `<i class="sdot" style="--plate:${RARITY[p].color}"></i>` : '<i class="sdot empty"></i>';
  return `<div>daily draft · No. ${MENU_NO}</div>` + ROOM_KEYS.map(k => {
    const r = today[k];
    return `<div class="srow"><img src="assets/icons/game/${ROOMS[k].icon}.svg" alt="${ROOMS[k].name}"><span class="pc">${r ? r.pct + '%' : '--'}</span>${r ? `<span class="sdots">${r.plates.map(dot).join('')}</span>` : ''}</div>`;
  }).join('') + (n === 3 ? `<div class="stotal">full house! total <b>${totalPct()}%</b></div>` : `<div>${n}/3 rooms cleared today</div>`);
}
async function copyShare(btn) {
  try { await navigator.clipboard.writeText(shareText()); btn.textContent = 'Copied!'; }
  catch { btn.textContent = 'Copy failed'; }
  setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
}

function showHome() {
  renderStreak();
  $('stage').classList.remove('closing');
  if (phase === 'done') chefPose('');
  const n = clearedCount();
  $('house').className = 'house' + (n === 3 ? ' full' : '');
  $('house').innerHTML = (n === 3 ? 'full house ' : `${n}/3 `) +
    ROOM_KEYS.map(k => `<i class="${today[k] ? 'on' : ''}" style="--plate:${ROOMS[k].accent}"></i>`).join('');
  $('roomList').innerHTML = ROOM_KEYS.map(k => {
    const r = ROOMS[k], done = today[k];
    return `<button class="room-card" data-room="${k}" style="--accent:${r.accent}">
      <img src="assets/icons/game/${r.icon}.svg" alt="">
      <div><div class="nm">${r.name}</div><div class="tp">${r.topic}</div></div>
      <span class="tag${done ? ' done' : ''}">${done ? done.pct + '%' : 'Open'}</span>
    </button>`;
  }).join('');
  $('roomList').querySelectorAll('.room-card').forEach(b => b.onclick = () => openRoom(b.dataset.room));
  $('homeShare').hidden = n === 0;
  $('homeShareBox').innerHTML = sharePreview();
  for (const id of ['results', 'roomMenu']) $(id).classList.remove('show');
  $('home').classList.add('show');
  $('home').querySelector('.scroll').scrollTop = 0;
}

function openRoom(key) {
  roomKey = key;
  room = ROOMS[key];
  $('hudRoom').textContent = room.name;
  $('hudRoomIcon').src = `assets/icons/game/${room.icon}.svg`;
  setupBelt(false);
  const done = today[key];
  $('roomMenuBody').innerHTML = `
    <div class="card room-hero">
      <img src="assets/icons/game/${room.icon}.svg" alt="">
      <div class="eyebrow">${room.name} · No. ${MENU_NO}</div>
      <h2>${room.topic}</h2>
      <p>${room.blurb}</p>
      ${done ? `<div class="played">You ate here today: <b>${done.pct}%</b>. Another round is practice, with the plates shuffled.</div>` : ''}
    </div>
    <div class="card">
      <h3>${room.catWord}</h3>
      <div class="cats">${room.cats.map(c => `<span>${c}</span>`).join('')}</div>
      <p class="note">+${CONFIG.roleBonus} for each different one on your tray, −${CONFIG.dupPenalty} for each double.</p>
    </div>
    <div class="card">
      <h3><img src="assets/icons/game/tag.svg" alt="">What a plate is worth</h3>
      <p class="note" style="margin:0">${room.valueNote} You only see the real values at the end.</p>
    </div>
    <div class="card">
      <h3>How it works</h3>
      <ul class="rules">
        <li><img src="assets/icons/game/roll.svg" alt=""><span>20 plates ride past your seat. Tap one to unroll it and see what's inside.</span></li>
        <li><img src="assets/icons/game/timer.svg" alt=""><span>You get ${CONFIG.timerSeconds} seconds to <b>take it</b> or <b>let it pass</b>. Passed plates never come back.</span></li>
        <li><img src="assets/icons/game/coin.svg" alt=""><span>You have <b>$${CONFIG.budget}</b> and room for <b>${CONFIG.slots} plates</b>. Plate colour sets the price, not how good it is.</span></li>
        <li><img src="assets/icons/game/tray.svg" alt=""><span>Your plates hang as tickets above the kitchen. Full early? Tap <b>I'm full</b> to keep your cash: every $1 left is worth ${CONFIG.cashRate} points.</span></li>
      </ul>
    </div>
    <div class="seat-row">
      <button class="big-btn ghost" id="btnBack">Back</button>
      <button class="big-btn" id="btnSeat">${done ? 'Practice round' : 'Take a seat'}</button>
    </div>`;
  $('btnBack').onclick = showHome;
  $('btnSeat').onclick = () => startRound(!!done);
  $('home').classList.remove('show');
  $('roomMenu').classList.add('show');
  $('roomMenuBody').scrollTop = 0;
}
