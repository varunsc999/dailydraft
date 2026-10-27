// Game settings, plate prices and small helpers used everywhere.

// ─── CONFIG ───
const CONFIG = { budget: 80, slots: 5, timerSeconds: 10, cashRate: 2, roleBonus: 10, dupPenalty: 15 };
const SEAT_X = 180, GAP = 96;
// Must match #roll / #sheet positions on the mat.
const ROLL_START = 64, ROLL_END = 282, SHEET_HIDDEN = 210;

const RARITY = {
  Gray:   { price: 5,  color: '#bdb5a6', label: 'White plate',  emoji: '⬜' },
  Green:  { price: 10, color: '#5c9a6a', label: 'Green plate',  emoji: '🟩' },
  Blue:   { price: 15, color: '#4473b4', label: 'Blue plate',   emoji: '🟦' },
  Purple: { price: 20, color: '#8459ad', label: 'Purple plate', emoji: '🟪' },
  Gold:   { price: 30, color: '#c99a35', label: 'Gold plate',   emoji: '🟨' },
};

const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const priceOf = it => RARITY[it.rarity].price;
