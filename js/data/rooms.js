// The three rooms and how each one looks. Today's sale in each room comes from the server (js/backend.js) when
// the game starts, and fills in ROOMS, TODAY and MENU_NO. The sales themselves are kept off the public site:
// they live in puzzles/<date>.json on your computer and are uploaded with tools/upload_puzzles.py.
const ROOM_KEYS = ['game', 'screen', 'life'];
const ROOM_INFO = {
  game:   { name: 'Game Day',    icon: 'trophy', accent: '#c9442e', share: '🏟️', greet: 'Irasshaimase!' },
  screen: { name: 'Screen Time', icon: 'tv',     accent: '#22305a', share: '📺', greet: 'Showtime!' },
  life:   { name: 'Daily Life',  icon: 'bowl',   accent: '#4f7f4a', share: '🍔', greet: 'Order up!' },
};
const ROOMS = {};
let TODAY = new Date(); // the game day (set from the server's answer); a day starts at midnight US Eastern
let MENU_NO = '';       // counts up one per day from launch day (Mon Oct 26 2026), which is No. 001

const dateKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
// On your own computer (the local test server) ?day=YYYY-MM-DD previews another day's sales, played against the
// puzzles/ folder. It does nothing on the public site, where the server decides what day it is.
const LOCAL = ['localhost', '127.0.0.1', '[::1]', ''].includes(location.hostname);
const PREVIEW_DAY = LOCAL ? ((new URLSearchParams(location.search).get('day') || '').match(/^\d{4}-\d{2}-\d{2}$/) || [null])[0] : null;
