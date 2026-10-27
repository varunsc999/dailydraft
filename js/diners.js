// The other diners along the bar. Decoration only.

// ─── OTHER DINERS ───
// Drinks and condiments, picked at random for each diner. Drinks: 52×80, standing on y 76. Condiments: 52×34, on y 30.
const steam = (x, y = 22) => `<path class="nsteam" d="M${x} ${y} q-4 -6 0 -12 q4 -6 0 -12" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/><path class="nsteam b" d="M${x + 10} ${y + 2} q-4 -6 0 -12 q4 -6 0 -12" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
const DRINKS = [
  // green tea in a yunomi
  `${steam(20)}<ellipse cx="27" cy="76" rx="18" ry="3.4" fill="#000" opacity=".2"/>
   <path d="M8 32 L12 72 Q27 78 42 72 L46 32Z" fill="#cdd1bd"/><path d="M34 32 L46 32 L42 72 Q38 74.6 33 75.4Z" fill="#000" opacity=".1"/>
   <path d="M12 34 L15 70" stroke="#fff" stroke-width="2" opacity=".45" stroke-linecap="round"/>
   <ellipse cx="27" cy="32" rx="19" ry="4.6" fill="#4f5d4a"/><ellipse cx="27" cy="32.5" rx="15.5" ry="3.3" fill="#a9b26a"/>`,
  // a mug of beer with a foamy head
  `<ellipse cx="25" cy="76" rx="17" ry="3.2" fill="#000" opacity=".2"/>
   <path d="M37 34 Q48 34 48 46 Q48 58 37 58" stroke="#e9eef0" stroke-width="3.4" fill="none" opacity=".8"/>
   <path d="M11 26 L12 72 Q25 77 38 72 L39 26Z" fill="#e7a02c" opacity=".93"/>
   <path d="M30 28 L38 28 L38 72 Q34 74.6 30 75Z" fill="#000" opacity=".12"/>
   <circle cx="20" cy="56" r="1" fill="#ffe1a0"/><circle cx="25" cy="46" r=".8" fill="#ffe1a0"/><circle cx="18" cy="40" r=".8" fill="#ffe1a0"/><circle cx="28" cy="62" r="1" fill="#ffe1a0"/>
   <path d="M14 28 L15 70" stroke="#fff" stroke-width="1.8" opacity=".5" stroke-linecap="round"/>
   <path d="M9 28 Q9 20 15 21 Q18 16 24 18 Q29 14 34 19 Q41 19 41 27 Q41 31 25 31 Q9 31 9 28Z" fill="#fffaf0"/>`,
  // cola on ice with a striped straw
  `<ellipse cx="26" cy="76" rx="16" ry="3" fill="#000" opacity=".2"/>
   <path d="M32 34 L40 8" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M33.4 30 L35 25.4 M35.8 22.8 L37.4 18.2 M38.2 15.6 L39.6 11" stroke="#d9442e" stroke-width="3"/>
   <path d="M12 34 L14 72 Q26 76 38 72 L40 34Z" fill="#3a1a12"/>
   <rect x="15" y="34" width="9" height="8" rx="2" fill="#d6ecf4" opacity=".55" transform="rotate(-12 19 38)"/><rect x="26" y="36" width="9" height="8" rx="2" fill="#d6ecf4" opacity=".45" transform="rotate(10 30 40)"/>
   <path d="M11 28 L14 72 Q26 77 38 72 L41 28" stroke="#e6eef2" stroke-width="1.6" fill="none" opacity=".8"/>
   <ellipse cx="26" cy="28" rx="15" ry="3" fill="none" stroke="#e6eef2" stroke-width="1.2" opacity=".8"/>
   <path d="M15 32 L17 70" stroke="#fff" stroke-width="1.6" opacity=".35" stroke-linecap="round"/>`,
  // iced water with a slice of lemon
  `<ellipse cx="26" cy="76" rx="16" ry="3" fill="#000" opacity=".18"/>
   <path d="M12 38 L14 72 Q26 76 38 72 L40 38Z" fill="#cfe8f2" opacity=".75"/>
   <path d="M11 28 L14 72 Q26 77 38 72 L41 28" stroke="#e6eef2" stroke-width="1.6" fill="none" opacity=".9"/>
   <ellipse cx="26" cy="28" rx="15" ry="3" fill="none" stroke="#e6eef2" stroke-width="1.2" opacity=".9"/>
   <circle cx="38" cy="29" r="7" fill="#f5d33f"/><circle cx="38" cy="29" r="5.6" fill="#fbe98a"/><path d="M38 23.4 V34.6 M32.4 29 H43.6 M34 25 L42 33 M42 25 L34 33" stroke="#f5d33f" stroke-width=".7"/>
   <path d="M15 34 L17 70" stroke="#fff" stroke-width="1.6" opacity=".5" stroke-linecap="round"/>`,
  // sake: a tokkuri bottle and a little cup
  `<ellipse cx="26" cy="76" rx="20" ry="3.2" fill="#000" opacity=".2"/>
   <path d="M12 74 Q6 70 7 58 Q8 46 15 40 V24 Q15 20 18 20 H22 Q25 20 25 24 V40 Q32 46 33 58 Q34 70 28 74Z" fill="#efe9dc"/>
   <path d="M7.6 56 H32.4 V62 H7.4Z" fill="#2a4a7a" opacity=".85"/>
   <path d="M25 28 V40 Q32 46 33 58 Q34 70 28 74 H24 Q30 68 29 58 Q28 48 22 42Z" fill="#000" opacity=".08"/>
   <ellipse cx="20" cy="20.4" rx="5" ry="1.6" fill="#d8d0c0"/>
   <path d="M35 66 L37 74 Q42 76 47 74 L49 66Z" fill="#efe9dc"/><ellipse cx="42" cy="66" rx="7" ry="1.8" fill="#e6dccb"/><ellipse cx="42" cy="66.2" rx="5.6" ry="1.2" fill="#f6f1e2"/>`,
  // a ramune soda bottle with its marble
  `<ellipse cx="26" cy="76" rx="12" ry="2.6" fill="#000" opacity=".2"/>
   <path d="M18 74 Q16 72 16 66 V46 Q16 40 21 37 Q20 32 21 28 Q23 25 22 18 H30 Q29 25 31 28 Q32 32 31 37 Q36 40 36 46 V66 Q36 72 34 74Z" fill="#7fc3d8" opacity=".85"/>
   <circle cx="26" cy="32" r="3.6" fill="#e6f6fb"/><circle cx="25" cy="31" r="1.2" fill="#fff"/>
   <rect x="21" y="14" width="10" height="5" rx="1.5" fill="#e04a7a"/>
   <rect x="17" y="50" width="18" height="10" rx="1" fill="#fff" opacity=".85"/><path d="M19 55 H33" stroke="#2a6aa0" stroke-width="1.6"/>
   <path d="M19 42 V70" stroke="#fff" stroke-width="1.6" opacity=".5" stroke-linecap="round"/>`,
];
const CONDIMENTS = [
  // soy sauce dish
  `<ellipse cx="26" cy="30" rx="17" ry="3.6" fill="#000" opacity=".16"/>
   <path d="M11 22 Q12 28 26 28.4 Q40 28 41 22Z" fill="#e6dccb"/>
   <ellipse cx="26" cy="22" rx="15.2" ry="4.4" fill="#f4efe4"/><ellipse cx="26" cy="22.4" rx="12" ry="3.2" fill="#e9e1d1"/><ellipse cx="26" cy="22.8" rx="10" ry="2.4" fill="#4a2414"/>
   <ellipse cx="22.6" cy="22.2" rx="3.6" ry=".6" fill="#fff" opacity=".3"/>`,
  // wasabi and pickled ginger on a little plate
  `<ellipse cx="26" cy="30" rx="20" ry="3.4" fill="#000" opacity=".16"/>
   <path d="M6 24 Q8 29 26 29.4 Q44 29 46 24Z" fill="#dfe6ee"/><ellipse cx="26" cy="24" rx="20" ry="4.6" fill="#f2f6f8"/><ellipse cx="26" cy="24" rx="20" ry="4.6" fill="none" stroke="#4a6a9a" stroke-width=".8"/>
   <path d="M12 24 Q13 18 18 18.4 Q22 19 21 24 Q16 26 12 24Z" fill="#8fbf4a"/>
   <path d="M27 24.6 Q28 18 34 18.6 Q32 21 36 22.4 Q38 17.6 41 21 Q40 25 34 25.4 Q30 26 27 24.6Z" fill="#f4b5b0"/><path d="M30 22 Q33 20 36 21" stroke="#fde0dc" stroke-width=".6" fill="none"/>`,
  // a glass soy sauce bottle with a red cap
  `<ellipse cx="26" cy="30" rx="9" ry="2.4" fill="#000" opacity=".2"/>
   <path d="M19 29 Q17 28 17 24 Q17 18 22 14 V9 H30 V14 Q35 18 35 24 Q35 28 33 29Z" fill="#e8eef0" opacity=".85"/>
   <path d="M18 22 Q18 28 20 28.4 H32 Q34 28 34 22Z" fill="#3a1a0e"/>
   <path d="M21 3 Q21 1 26 1 Q31 1 31 3 V9 H21Z" fill="#c9302a"/><path d="M26 1 L26 -2" stroke="#c9302a" stroke-width="1.6"/>
   <path d="M20 16 V26" stroke="#fff" stroke-width="1.2" opacity=".6"/>`,
  // a bowl of edamame
  `<ellipse cx="26" cy="30" rx="16" ry="3" fill="#000" opacity=".16"/>
   <path d="M12 18 Q22 12 30 16 Q36 12 40 18Z" fill="#7fae4c"/>
   <path d="M15 17 q4 -5 8 -1 M27 15 q5 -4 9 0 M20 14 q4 -3 7 0" stroke="#5c8f33" stroke-width="2.6" fill="none" stroke-linecap="round"/>
   <path d="M10 18 Q11 28 26 28.4 Q41 28 42 18Z" fill="#2c2420"/><ellipse cx="26" cy="18" rx="16" ry="3.6" fill="none" stroke="#4a3c34" stroke-width="1"/>`,
  // miso soup in a black lacquer bowl
  `${steam(18, 8)}
   <ellipse cx="26" cy="30" rx="15" ry="3" fill="#000" opacity=".2"/>
   <path d="M11 14 Q12 28 26 28.6 Q40 28 41 14Z" fill="#1e1612"/><path d="M14 22 Q18 27 26 27.6" stroke="#c9302a" stroke-width="1" fill="none" opacity=".7"/>
   <ellipse cx="26" cy="14" rx="15" ry="3.6" fill="#a8222f"/><ellipse cx="26" cy="14.4" rx="13" ry="2.8" fill="#c8a26a"/>
   <rect x="20" y="13" width="3" height="2" fill="#f2ead8"/><rect x="28" y="14" width="3" height="2" fill="#f2ead8"/><circle cx="25" cy="15" r=".9" fill="#6fa84a"/><circle cx="31" cy="13.6" r=".9" fill="#6fa84a"/>`,
];
const any = arr => arr[Math.floor(Math.random() * arr.length)];
// Purely for looks (only visible on wider screens). Diners to the left sometimes grab a plate you let pass,
// and everyone slowly eats the pieces on their mat. Nothing here touches the score.
const PLATE_COLORS = Object.values(RARITY).map(r => r.color);
const SEATS = [-492, -204, 564, 852].map(x => ({ x, plates: [], pieces: 0 }));
function seatAddPlate(seat, color) {
  const el = document.createElement('div');
  el.className = 'splate nplate';
  el.style.setProperty('--plate', color);
  el.style.left = (seat.x + 70) + 'px';
  el.style.top = (526 - seat.plates.length * 9) + 'px';
  $('seats').append(el);
  seat.plates.push(el);
}
function seatAddPiece(seat) {
  if (seat.pieces >= 4) return;
  const el = document.createElement('div');
  el.className = 'piece';
  // any of the belt designs, just without the plate
  el.innerHTML = `<svg viewBox="18 14 46 31">${any(SUSHI).svg}</svg>`;
  el.style.left = (14 + seat.pieces * 38) + 'px';
  seat.mat.append(el);
  seat.pieces++;
}
function seatEat(seat) {
  const all = seat.mat.querySelectorAll('.piece:not(.eaten)');
  if (!all.length) return;
  const el = all[all.length - 1];
  el.classList.add('eaten');
  setTimeout(() => { el.remove(); seat.pieces--; }, 520);
}
function setupSeats() {
  for (const seat of SEATS) {
    seat.mat = document.createElement('div');
    seat.mat.className = 'nmat';
    seat.mat.style.left = (seat.x - 110) + 'px';
    $('seats').append(seat.mat);
    for (const [cls, list, dx] of [['ndrink', DRINKS, 62], ['ncond', CONDIMENTS, -164]]) {
      const el = document.createElement('div');
      el.className = cls;
      el.style.left = (seat.x + dx) + 'px';
      el.innerHTML = `<svg viewBox="0 0 52 ${cls === 'ndrink' ? 80 : 34}">${any(list)}</svg>`;
      $('seats').append(el);
    }
    const n = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) seatAddPlate(seat, PLATE_COLORS[Math.floor(Math.random() * 5)]);
    for (let i = Math.floor(Math.random() * 3); i > 0; i--) seatAddPiece(seat);
  }
}
// A diner on the left reaches for a plate that has already gone past you.
function seatsGrab() {
  for (const seat of SEATS) {
    const j = idx + (seat.x - SEAT_X) / GAP;
    const plate = plates.get(j);
    if (j >= idx || !plate || seen[j] === 'taken' || seat.plates.length >= 7 || Math.random() > .3) continue;
    plates.delete(j);
    const color = plate.querySelector('.rim').getAttribute('stroke');
    const n = seat.plates.length;
    plate.animate(
      [{ transform: 'none' }, { transform: 'translate(60px, -60px) scale(.8)', offset: .45 }, { transform: `translate(92px, ${190 - n * 9}px) scale(.55)` }],
      { duration: 650, easing: 'ease-in-out', fill: 'forwards' }).finished.then(() => {
        plate.remove();
        seatAddPlate(seat, color);
        seatAddPiece(seat);
      });
  }
}
// Everyone keeps eating; the diners on the right get served now and then.
setInterval(() => {
  const seat = SEATS[Math.floor(Math.random() * SEATS.length)];
  if (seat.pieces && Math.random() < .6) seatEat(seat);
  else if (seat.x > SEAT_X) {
    seatAddPiece(seat);
    if (seat.plates.length < 7) seatAddPlate(seat, PLATE_COLORS[Math.floor(Math.random() * 5)]);
  }
}, 3500);
