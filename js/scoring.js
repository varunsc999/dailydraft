// Scoring a loadout and finding the best possible one.

// ─── SCORING ───
function scoreLoadout(items, cashLeft) {
  const itemPts = items.reduce((s, it) => s + it.value, 0);
  const roles = new Set(items.map(it => it.role)).size;
  const dupes = items.length - roles;
  const roleBonus = roles * CONFIG.roleBonus;
  const dupPenalty = dupes * CONFIG.dupPenalty;
  const cashPts = cashLeft * CONFIG.cashRate;
  return { items, cashLeft, itemPts, roles, dupes, roleBonus, dupPenalty, cashPts, total: itemPts + roleBonus - dupPenalty + cashPts };
}

// Tries every set of up to 5 plates that fits the budget (order doesn't matter: any set can be taken in sequence).
function bestLoadout(pool) {
  let best = null;
  const pick = [];
  (function walk(start, spent) {
    const s = scoreLoadout(pick, CONFIG.budget - spent);
    if (!best || s.total > best.total) best = { ...s, items: pick.slice() };
    if (pick.length === CONFIG.slots) return;
    for (let j = start; j < pool.length; j++) {
      const p = priceOf(pool[j]);
      if (spent + p > CONFIG.budget) continue;
      pick.push(pool[j]);
      walk(j + 1, spent + p);
      pick.pop();
    }
  })(0, 0);
  return best;
}
