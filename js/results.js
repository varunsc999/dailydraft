// The receipt and results screen.

// ─── RESULTS ───
function verdictFor(pct) {
  if (pct >= 100) return 'A perfect meal. The chef bows.';
  if (pct >= 90) return 'Chef-level taste.';
  if (pct >= 75) return 'A solid meal.';
  if (pct >= 55) return 'Some good plates got away.';
  return 'Rough night at the counter.';
}

function receiptLines(items) {
  let html = '';
  for (let i = 0; i < CONFIG.slots; i++) {
    const it = items[i];
    html += it
      ? `<div class="rc-line" style="--plate:${RARITY[it.rarity].color}"><i></i><span>${it.name}</span><span class="p">$${priceOf(it)}</span><span class="v">${it.value}</span></div>`
      : `<div class="rc-line empty"><span></span><span>(empty)</span><span></span><span>0</span></div>`;
  }
  return html;
}

function finish(reason) {
  phase = 'done';
  endReason = reason;
  clearInterval(timerId);
  $('tap').classList.remove('show');
  $('controls').classList.remove('up');
  $('skip').hidden = true;
  $('sheet').classList.remove('hurry');
  Sound.humOff();
  chefPose('bow', 1600);
  chefSay('Here is your bill!', 1600);
  $('stage').classList.add('closing');
  setTimeout(() => { if (phase === 'done') chefPose('wipe'); }, 1700);
  // a real round is scored on the server, which also reveals every plate's value; practice is scored here
  const scored = practice ? Promise.resolve() : Backend.finish(roomKey).then(f => {
    f.values.forEach((v, i) => { room.items[i].value = v; });
  });
  setTimeout(async () => {
    try { await scored; } catch (e) { lostConnection(e); return; }
    Sound.chime();
    renderResults();
  }, 700);
}

function renderResults() {
  const you = scoreLoadout(picks, cash);
  const best = bestLoadout(order);
  const pct = Math.round(you.total / best.total * 100);
  const bestBuy = picks.slice().sort((a, b) => b.value / priceOf(b) - a.value / priceOf(a))[0];
  const gotAway = best.items.filter(it => !picks.includes(it)).sort((a, b) => b.value - a.value)[0];
  const date = TODAY.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });

  if (!practice && !today[roomKey]) {
    today[roomKey] = { pct, score: you.total, best: best.total, plates: Array.from({ length: CONFIG.slots }, (_, i) => picks[i] ? picks[i].rarity : null) };
    markPlayed(); // the new lantern lights when you leave the receipt
  }

  const all = order.map((it, i) => {
    const st = seen[i] === 'taken' ? `<span class="st t">TAKEN${best.items.includes(it) ? ' ★' : ''}</span>`
      : best.items.includes(it) ? `<span class="st m">${seen[i] ? 'PASSED' : 'UNSEEN'} ★</span>`
      : `<span class="st p">${seen[i] ? 'passed' : 'unseen'}</span>`;
    return `<div class="all-row" style="--plate:${RARITY[it.rarity].color}"><span class="n">${i + 1}</span><i></i><span>${it.name}</span><span class="pr">$${priceOf(it)}</span>${st}<span class="v">${it.value}</span></div>`;
  }).join('');

  $('resultsBody').innerHTML = `
    <div class="receipt">
      <div class="rc-head">
        <div class="shop">daily draft<span>.</span></div>
        <div>${room.name.toUpperCase()} · ${room.topic.toUpperCase()}</div>
        <div>${date} · SEAT 05 · ROUND ${round}</div>
      </div>
      <div class="rc-cols"><span></span><span>Plate</span><span>Paid</span><span>Pts</span></div>
      ${receiptLines(picks)}
      <div class="rc-sep"></div>
      <div class="rc-sum"><span>Plates</span><span>${you.itemPts}</span></div>
      <div class="rc-sum"><span>${room.catWord} (${you.roles} × ${CONFIG.roleBonus})</span><span>+${you.roleBonus}</span></div>
      <div class="rc-sum"><span>Doubles (${you.dupes} × ${CONFIG.dupPenalty})</span><span>−${you.dupPenalty}</span></div>
      <div class="rc-sum"><span>Cash kept ($${you.cashLeft} × ${CONFIG.cashRate})</span><span>+${you.cashPts}</span></div>
      <div class="rc-sep"></div>
      <div class="rc-total"><span>TOTAL</span><span>${you.total} / ${best.total}</span></div>
      <div class="hanko"><div><div class="pct">${pct}%</div><div class="sub">of chef's pick</div></div></div>
      <div class="verdict">${verdictFor(pct)}</div>
      <div class="rc-foot">${endReason}<br>arigatō! a new menu opens at midnight</div>
    </div>

    <div class="callouts">
      <div class="callout"><div class="k"><img src="assets/icons/game/sparkle.svg" alt="">Best value</div><div class="v">${bestBuy ? bestBuy.name : '—'}</div></div>
      <div class="callout"><div class="k"><img src="assets/icons/game/away.svg" alt="">Got away</div><div class="v">${gotAway ? gotAway.name : 'Nothing!'}</div></div>
    </div>

    <div class="card">
      <h3><img src="assets/icons/game/chefhat.svg" alt="">Chef's pick · ${best.total} pts</h3>
      <div class="chip-row">${best.items.map(it => `<span class="chip" style="--plate:${RARITY[it.rarity].color}"><i></i>${it.name} <b>${it.value}</b></span>`).join('')}</div>
      <p class="note">Costs $${CONFIG.budget - best.cashLeft} and keeps $${best.cashLeft} (+${best.cashPts}), with ${best.roles} ${room.catWord.toLowerCase()} covered.</p>
    </div>

    <div class="card">
      <details class="all">
        <summary>Every plate on the belt</summary>
        <div style="margin-top:8px">${all}</div>
      </details>
    </div>

    <div class="card">
      <h3>Share your meal</h3>
      <div class="share-box" id="shareBox"></div>
      <div class="btn-row">
        <button class="big-btn ghost" id="btnCopy">Copy</button>
        <button class="big-btn" id="btnAgain">Eat again</button>
      </div>
      <button class="big-btn ghost" id="btnHome">Back to the menu</button>
      <p class="note">${practice ? 'This was a practice round, so it doesn\'t change today\'s score.' : 'Eat again for practice: the plates get shuffled and today\'s score stays.'}</p>
    </div>
  `;
  $('shareBox').innerHTML = sharePreview();
  $('btnCopy').onclick = () => copyShare($('btnCopy'));
  $('btnAgain').onclick = () => startRound(true);
  $('btnHome').onclick = showHome;
  $('results').scrollTop = 0;
  $('resultsBody').scrollTop = 0;
  $('results').classList.add('show');
}
