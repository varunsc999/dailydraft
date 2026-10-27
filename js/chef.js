// The chef's speech bubble and poses.

// ─── CHEF ───
let bubbleTimer;
// ms = how long the bubble stays up (0 keeps it until the next line); tip = tutorial styling
function chefSay(text, ms = 1500, tip = false) {
  $('bubble').textContent = text;
  $('bubble').classList.toggle('tip', tip);
  $('bubble').classList.add('show');
  clearTimeout(bubbleTimer);
  if (ms) bubbleTimer = setTimeout(() => $('bubble').classList.remove('show'), ms);
}

// The chef SVG is loaded inline so its pose can be switched with a class.
// Poses: '' (slicing), look, happy, shrug, cross, bow — see assets/scene/chef.svg.
let chefSvg = null, poseTimer;
fetch('assets/scene/chef.svg?v=15').then(r => r.text()).then(svg => {
  $('chef').innerHTML = svg;
  chefSvg = $('chef').querySelector('svg');
});
function chefPose(pose, ms) {
  if (!chefSvg) return;
  clearTimeout(poseTimer);
  chefSvg.setAttribute('class', 'chef' + (pose ? ' ' + pose : ''));
  if (ms) poseTimer = setTimeout(() => chefPose(phase === 'deciding' ? 'look' : ''), ms);
}
// Now and then, glance up at the customer while waiting.
setInterval(() => {
  if (chefSvg && chefSvg.getAttribute('class') === 'chef' && Math.random() < .5) chefPose('look', 1400);
}, 4000);
