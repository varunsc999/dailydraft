// Wires up the buttons and keys, then opens the home screen.

$('btnTake').addEventListener('click', take);
$('btnPass').addEventListener('click', () => pass(false));
$('skip').addEventListener('click', skipRest);
$('mute').addEventListener('click', () => { Sound.init(); Sound.setMuted(!Sound.muted); syncMute(); });
$('musicBtn').addEventListener('click', () => { Sound.init(); Sound.setMusicOff(!Sound.musicOff); syncMute(); });
syncMute();
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (k === ' ' && phase === 'waiting') { e.preventDefault(); unroll(); }
  else if (k === 't') take();
  else if (k === 'p') pass(false);
});

// A message in place of the game: the kitchen is closed (no sale for today), or the server can't be reached.
function showNotice(title, text) {
  $('noticeBody').innerHTML = `<h3>${title}</h3><p class="note">${text}</p>
    <button class="big-btn" id="btnReload">Try again</button>`;
  $('btnReload').onclick = () => location.reload();
  for (const id of ['home', 'roomMenu', 'results']) $(id).classList.remove('show');
  $('notice').classList.add('show');
}
// The server stopped answering mid-round. Your plates so far are already saved; reloading finishes the round.
function lostConnection(e) {
  console.error(e);
  phase = 'done';
  clearInterval(timerId);
  Sound.humOff();
  showNotice('Lost the connection to the kitchen',
    'Your plates so far are saved. Reload to see your bill: the round is finished with what you had.');
}

setupSeats();
(async () => {
  try {
    await loadToday();
  } catch (e) {
    console.error(e);
    if (e.closed || /no sale today/.test(e.message)) showNotice('The kitchen is closed', "Today's menu isn't ready yet. Check back soon!");
    else showNotice("Can't reach the kitchen", 'Check your connection and try again.');
    return;
  }
  $('menuNo').textContent = MENU_NO;
  $('today').textContent = TODAY.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  setupBelt(false);
  renderStreak();
  showHome();
})();
