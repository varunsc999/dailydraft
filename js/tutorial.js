// First-visit tutorial in the chef's speech bubbles.

// ─── FIRST-VISIT TUTORIAL ───
// The chef talks you through the first plate of your first round, then never again.
let tutorial = false;
try { tutorial = localStorage.getItem('dd-tutorial-done') !== '1'; } catch {}
const TUTORIAL = {
  arrive: 'Welcome! Tap the plate in front of you to open it.',
  unroll: 'Take it or let it pass. You have 10 seconds, and passed plates never come back.',
};
// Called after your first decision: explains the tickets and ends the tutorial. Returns true if it spoke.
function tutorialStep() {
  if (!tutorial) return false;
  tutorial = false;
  try { localStorage.setItem('dd-tutorial-done', '1'); } catch {}
  chefSay('Plates you take hang on the rail above me. Five plates, $80. Good luck!', 4200, true);
  return true;
}
