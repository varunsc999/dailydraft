// Today's results (from the server), the weather and the streak lanterns.

// ─── TODAY'S RESULTS ───
// Filled from the server when the game starts (loadToday), then kept up to date as you finish rooms.
const dayKey = dateKey;
let today = {};
const clearedCount = () => ROOM_KEYS.filter(k => today[k]).length;
// full house: your three scores added up, as a % of the three best loadouts added up
function totalPct() {
  const rs = ROOM_KEYS.map(k => today[k]);
  if (rs.every(r => r.best)) return Math.round(rs.reduce((a, r) => a + r.score, 0) / rs.reduce((a, r) => a + r.best, 0) * 100);
  return Math.round(rs.reduce((a, r) => a + r.pct, 0) / 3);
}
// what a finished room looks like on the home screen and share card
function roomResult(sale, run) {
  const taken = run.decisions.filter(x => x.take).map(x => sale.items[x.i]);
  return { pct: run.pct, score: run.score, best: run.best, plates: Array.from({ length: CONFIG.slots }, (_, i) => taken[i] ? taken[i].rarity : null) };
}

// Asks the server for today's sales, your rounds and the days you've played. A round left half-way (the page was
// closed mid-round) is finished as it stands, so it can't be replayed.
async function loadToday() {
  // results this browser kept before there was a server
  try { Object.keys(localStorage).filter(k => k === 'dd-days' || k.startsWith('daily-draft-')).forEach(k => localStorage.removeItem(k)); } catch {}
  const t = await Backend.today();
  const [y, m, d] = t.day.split('-').map(Number);
  TODAY = new Date(y, m - 1, d);
  MENU_NO = String(t.menuNo).padStart(3, '0');
  playedDays = t.playedDays.slice();
  for (const k of ROOM_KEYS) {
    const sale = t.rooms[k];
    if (!sale) throw Object.assign(new Error('no sale today'), { closed: true });
    ROOMS[k] = { ...ROOM_INFO[k], ...sale, items: sale.items.map(it => ({ value: null, ...it })) };
    let run = sale.run;
    if (run && !run.finished) {
      const f = await Backend.finish(k);
      run = { ...run, finished: true, score: f.score, best: f.best, pct: f.pct };
      f.values.forEach((v, i) => { ROOMS[k].items[i].value = v; });
      if (!playedDays.includes(t.day)) playedDays.push(t.day);
    }
    if (run && run.finished) today[k] = roomResult(ROOMS[k], run);
  }
  room = ROOMS[roomKey];
}

// ─── WEATHER ───
// It's always raining outside the sushi bar. Add ?rain=0 to the URL to turn it off.
const rainy = (() => {
  const force = new URLSearchParams(location.search).get('rain');
  return force !== '0';
})();
$('stage').classList.toggle('rainy', rainy);

// ─── STREAK ───
// Game days on which you finished at least one real round, from the server. Seven lanterns, one per day this week.
let playedDays = [];
let newLantern = false;
function markPlayed() {
  const k = dayKey(TODAY);
  if (playedDays.includes(k)) return;
  playedDays.push(k);
  newLantern = true;
}
function streakDays() {
  const d = new Date(TODAY);
  if (!playedDays.includes(dayKey(d))) d.setDate(d.getDate() - 1); // today not played yet: the streak still counts
  let n = 0;
  while (playedDays.includes(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
// This week, Sunday to Saturday: which days you finished a today's round.
function weekDays() {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - d.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(d);
    day.setDate(d.getDate() + i);
    return { played: playedDays.includes(dayKey(day)), today: dayKey(day) === dayKey(TODAY) };
  });
}
// a cord across with seven paper lanterns, one for each day of this week; `letters` adds S M T W T F S under them
function lanternRow(letters = false) {
  const week = weekDays();
  const full = week.every(w => w.played);
  let g = '<path d="M1 3 Q49 10 97 3" stroke="#2a1a10" stroke-width="1" fill="none"/>';
  for (let i = 0; i < 7; i++) {
    const x = 7 + i * 14, y = 3 + 7 * (1 - Math.pow((x - 49) / 48, 2));
    const on = week[i].played;
    const body = on ? (full ? '#e8b23a' : '#d9442e') : '#6e5a4c';
    if (letters) g += `<text x="${x}" y="33" text-anchor="middle" font-size="5" font-weight="${week[i].today ? 900 : 600}" fill="${week[i].today ? '#ffd27a' : '#a8977f'}">${'SMTWTFS'[i]}</text>`;
    g += `<g class="lan${on ? ' lit' : ''}${on && newLantern && week[i].today ? ' new' : ''}">
      <path d="M${x} ${y} V${y + 3}" stroke="#2a1a10" stroke-width=".8"/>
      ${on ? `<circle class="halo" cx="${x}" cy="${y + 9}" r="8" fill="${full ? '#ffd27a' : '#ff9a5a'}" opacity=".6" filter="url(#lanBlur)"/>` : ''}
      <g class="body" opacity="${on ? 1 : .7}">
        <rect x="${x - 2.4}" y="${y + 3}" width="4.8" height="1.6" rx=".4" fill="#1e140c"/>
        <ellipse cx="${x}" cy="${y + 9}" rx="4.6" ry="4.8" fill="${body}"/>
        ${on ? `<ellipse cx="${x - .6}" cy="${y + 8.4}" rx="2.4" ry="3" fill="#ffd9a0" opacity=".55"/>` : ''}
        <path d="M${x - 4.4} ${y + 7.4} H${x + 4.4} M${x - 4.6} ${y + 9} H${x + 4.6} M${x - 4.4} ${y + 10.6} H${x + 4.4}" stroke="#000" stroke-width=".35" opacity=".3"/>
        <rect x="${x - 2.4}" y="${y + 13.4}" width="4.8" height="1.6" rx=".4" fill="#1e140c"/>
        <path d="M${x} ${y + 15} V${y + 18}" stroke="${on ? '#d9442e' : '#5a4a40'}" stroke-width=".8"/>
      </g>
    </g>`;
  }
  return `<svg viewBox="0 0 98 ${letters ? 35 : 28}"><defs><filter id="lanBlur" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="2.4"/></filter></defs>${g}</svg>`;
}
function renderStreak() {
  const n = streakDays();
  const row = lanternRow();
  $('streak').innerHTML = row;
  if (newLantern) Sound.lantern();
  $('streak').title = n ? `${n}-day streak` : 'Play today to light your first lantern';
  const week = weekDays().filter(w => w.played).length;
  $('streakHome').innerHTML = `<div class="lanterns">${lanternRow(true)}</div>
    <div><div class="eyebrow">Streak this week</div>${week === 7 ? 'A full week!' : week ? `${week} of 7 days` : 'Play a room to light a lantern'}</div>
    <div class="total"><b>${n}</b><span>day streak</span></div>`;
  newLantern = false;
}
