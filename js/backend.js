// The game's server. Today's sale comes from there without the hidden values: a plate's value is only revealed
// once you've decided on it, and the server keeps the one real round per room per day and its score.
//   Backend.today()                  today's three sales, your rounds so far and the days you've played
//   Backend.decide(room, index, take)  take or pass the next plate; returns { value, rank }
//   Backend.finish(room)             end the round; returns { values, score, best, pct }
// With a Supabase project in js/backend-config.js it calls the functions in supabase/schema.sql.
// Without one (or with ?local=1 on your own computer) a stand-in follows the same rules against the puzzles/
// folder, keeping your rounds in this browser. The stand-in only exists on localhost.
const GAME_TZ = 'America/New_York'; // one reset for everyone, at midnight here (matches dd_today() in schema.sql)

const Backend = (() => {
  const useLocal = LOCAL && (!SUPABASE_URL || !SUPABASE_KEY || new URLSearchParams(location.search).get('local') === '1');

  // retry a request a couple of times before giving up, so a brief dropout doesn't end a round
  async function retry(fn) {
    for (let i = 0; ; i++) {
      try { return await fn(); } catch (e) {
        if (i >= 2 || e.final) throw e;
        await sleep(600 * (i + 1));
      }
    }
  }

  // ─── SUPABASE ───
  let sb = null;
  async function client() {
    if (sb) return sb;
    if (!window.supabase) {
      await new Promise((ok, fail) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
        s.onload = ok;
        s.onerror = () => fail(new Error('could not load the Supabase library'));
        document.head.append(s);
      });
    }
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data } = await sb.auth.getSession();
    if (!data.session) {
      const { error } = await sb.auth.signInAnonymously();
      if (error) throw error;
    }
    return sb;
  }
  async function rpc(name, args) {
    const c = await client();
    const { data, error } = await c.rpc(name, args);
    if (error) {
      const e = new Error(error.message);
      e.final = !!error.code && error.code.startsWith('P'); // a rule broken on the server: retrying won't help
      throw e;
    }
    return data;
  }
  const remote = {
    today: () => retry(() => rpc('get_today')),
    decide: (room, index, take) => retry(() => rpc('decide', { p_room: room, p_index: index, p_take: take })),
    finish: room => retry(() => rpc('finish', { p_room: room })),
  };

  // ─── LOCAL STAND-IN (your computer only) ───
  const PRICES = { Gray: 5, Green: 10, Blue: 15, Purple: 20, Gold: 30 };
  const gameDay = () => PREVIEW_DAY || new Intl.DateTimeFormat('en-CA', { timeZone: GAME_TZ }).format(new Date());
  const runs = () => { try { return JSON.parse(localStorage.getItem('dd-local-runs')) || {}; } catch { return {}; } };
  const saveRuns = all => { try { localStorage.setItem('dd-local-runs', JSON.stringify(all)); } catch {} };
  let sales = null; // today's sales with their values, kept inside the stand-in like the server's table
  async function loadSales(day) {
    const get = async d => { const r = await fetch(`puzzles/${d}.json`, { cache: 'no-store' }); if (!r.ok) throw new Error('no file'); return r.json(); };
    try { return (await get(day)).rooms; } catch {}
    const err = new Error('no sale today'); err.final = true; throw err;
  }
  function runFor(all, day, room) {
    all[day] = all[day] || {};
    return all[day][room] = all[day][room] || { decisions: [], cash: CONFIG.budget, finished: false, score: null, pct: null };
  }
  function bestOf(items) { return bestLoadout(items).total; }
  const local = {
    async today() {
      const day = gameDay();
      sales = await loadSales(day);
      const all = runs(), rooms = {};
      for (const [k, s] of Object.entries(sales)) {
        const r = all[day] && all[day][k];
        rooms[k] = {
          topic: s.topic, blurb: s.blurb, catWord: s.catWord, cats: s.cats, valueNote: s.valueNote,
          items: s.items.map((it, i) => {
            const shown = { name: it.name, rarity: it.rarity, role: it.role };
            if (r && (r.finished || i < r.decisions.length)) shown.value = it.value;
            return shown;
          }),
          run: r ? { ...r, best: bestOf(s.items) } : null,
        };
      }
      const launch = Date.UTC(2026, 9, 26), [y, m, d] = day.split('-').map(Number);
      return {
        day, menuNo: Math.round((Date.UTC(y, m - 1, d) - launch) / 864e5) + 1, rooms,
        playedDays: Object.keys(all).filter(d2 => Object.values(all[d2]).some(r => r.finished)).sort(),
      };
    },
    async decide(room, index, take) {
      const day = gameDay(), all = runs(), r = runFor(all, day, room), items = sales[room].items, it = items[index];
      const fail = msg => { const e = new Error(msg); e.final = true; throw e; };
      if (!it) fail('no such plate');
      const last = r.decisions[r.decisions.length - 1];
      if (!(index === r.decisions.length - 1 && last.take === take)) {
        if (r.finished) fail('round already finished');
        if (index !== r.decisions.length) fail('plates come in order');
        if (take && r.decisions.filter(x => x.take).length >= CONFIG.slots) fail('tray is full');
        if (take && PRICES[it.rarity] > r.cash) fail('not enough cash');
        r.decisions.push({ i: index, take });
        if (take) r.cash -= PRICES[it.rarity];
        saveRuns(all);
      }
      return { value: it.value, rank: items.filter(o => o.value > it.value).length / items.length };
    },
    async finish(room) {
      const day = gameDay(), all = runs(), r = runFor(all, day, room), items = sales[room].items;
      const best = bestOf(items);
      if (!r.finished) {
        const taken = r.decisions.filter(x => x.take).map(x => items[x.i]);
        r.score = scoreLoadout(taken, r.cash).total;
        r.pct = Math.round(r.score * 100 / best);
        r.finished = true;
        saveRuns(all);
      }
      return { values: items.map(it => it.value), score: r.score, best, pct: r.pct };
    },
  };

  const impl = useLocal ? local : remote;
  return {
    local: useLocal,
    configured: useLocal || !!(SUPABASE_URL && SUPABASE_KEY),
    today: () => impl.today(),
    decide: (room, index, take) => impl.decide(room, index, take),
    finish: room => impl.finish(room),
  };
})();
