# Mechanics

Standalone, dependency-free snippets. Each works on its own; rename the selectors and restyle to the product's world. All of them assume:

```js
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
```

## Variable-font swell
Letters gain weight and width as the cursor gets close. Needs a variable font with `wght` and `wdth` axes (for example Bricolage Grotesque: `opsz,wdth,wght@12..96,75..100,200..800`).

```html
<h1 id="headline"><span class="line">Make some</span><span class="line">noise.</span></h1>
<style>
  #headline .line { display: block; white-space: nowrap; }
  #headline .ch { display: inline-block; transition: font-variation-settings .25s ease-out;
    font-variation-settings: 'wdth' 75, 'wght' 300; }
</style>
<script>
  const h = document.getElementById('headline');
  h.querySelectorAll('.line').forEach((line) => {
    line.innerHTML = [...line.textContent].map((c) => (c === ' ' ? ' ' : `<span class="ch">${c}</span>`)).join('');
  });
  const chars = [...h.querySelectorAll('.ch')];
  if (reduce) chars.forEach((c) => (c.style.fontVariationSettings = "'wdth' 90, 'wght' 700"));
  else addEventListener('pointermove', (e) => {
    for (const c of chars) {
      const r = c.getBoundingClientRect();
      const k = Math.max(0, 1 - Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) / 320);
      c.style.fontVariationSettings = `'wdth' ${75 + 25 * k}, 'wght' ${300 + 500 * k}`;
    }
  }, { passive: true });
</script>
```
The screen reader still reads the `h1` text correctly. Keep the 320px radius, or the whole line lights up at once.

## Fleeing critter, then catch
A `<button>` (so it's keyboard reachable) wanders the viewport, runs when the cursor is within 140px, and bounces off the edges. Put any SVG inside; animate its legs or wings with CSS while `.walking`.

```html
<button id="critter" class="walking" aria-label="Catch it"><svg><!-- your creature --></svg></button>
<style>
  #critter { position: fixed; left: 0; top: 0; width: 44px; height: 44px; padding: 0; border: 0;
    background: none; z-index: 50; will-change: transform; cursor: pointer; }
</style>
<script>
  const critter = document.getElementById('critter');
  let x, y, ang, born, loose = true, mx = -999, my = -999;
  function spawn() {
    x = innerWidth * (.2 + Math.random() * .6); y = innerHeight * (.2 + Math.random() * .6);
    ang = Math.random() * Math.PI * 2; born = performance.now(); loose = true;
    critter.classList.toggle('walking', !reduce); place();
  }
  const place = () => (critter.style.transform = `translate(${x - 22}px, ${y - 22}px) rotate(${ang + Math.PI / 2}rad)`);
  addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  (function crawl() {
    if (loose && !reduce) {
      const d = Math.hypot(mx - x, my - y);
      if (d < 140) { const away = Math.atan2(y - my, x - mx); ang += Math.atan2(Math.sin(away - ang), Math.cos(away - ang)) * .2; }
      else ang += (Math.random() - .5) * .35;
      const v = d < 140 ? 3.4 : 1.3;
      x += Math.cos(ang) * v; y += Math.sin(ang) * v;
      if (x < 24 || x > innerWidth - 24) { ang = Math.PI - ang; x = Math.min(Math.max(x, 24), innerWidth - 24); }
      if (y < 24 || y > innerHeight - 24) { ang = -ang; y = Math.min(Math.max(y, 24), innerHeight - 24); }
      place();
    }
    requestAnimationFrame(crawl);
  })();
  critter.addEventListener('click', () => {
    loose = false;
    const secondsLoose = (performance.now() - born) / 1000; // feed this into the result, e.g. a score
    // → run the self-typing form below, then spawn() again after ~1.5s
  });
  spawn();
</script>
```

## Self-typing replica form
The product's real form, filling itself in. Use real visitor facts so it feels alive.

```js
let cancelled = false; // set true from the Cancel button and Esc; check it after every await
async function type(el, text) {
  el.textContent = '';
  if (reduce) { el.textContent = text; return; }
  for (const c of text) { if (cancelled) return; el.textContent += c; await sleep(c === '\n' ? 60 : 14); }
}
const browser = (/Edg\//.test(navigator.userAgent) && 'Edge') || (/Chrome\//.test(navigator.userAgent) && 'Chrome')
  || (/Firefox\//.test(navigator.userAgent) && 'Firefox') || (/Safari\//.test(navigator.userAgent) && 'Safari') || 'a browser';
const platform = navigator.userAgentData?.platform || navigator.platform || 'this device';
// await type(field, `${browser} on ${platform}, ${innerWidth}×${innerHeight}`);
```
Add a blinking caret with `.typing::after { content: '▍'; animation: blink .6s steps(1) infinite; }`. After the last field, briefly "press" Submit (scale .94 for 180ms), shrink the modal toward where the result will appear, and insert the result there.

## DevTools box-model overlay
Hovering anything shows its margin, border, padding and content boxes with a `tag.class W × H` label. Default it on for `(pointer: fine)` only; let `I` toggle it.

```html
<div id="inspect" class="idle" aria-hidden="true"><div class="m"></div><div class="b"></div><div class="p"></div><div class="c"></div><div class="tag"></div></div>
<style>
  #inspect { position: fixed; inset: 0; pointer-events: none; z-index: 45; }
  #inspect.idle { display: none; }
  #inspect > div { position: fixed; border-style: solid; opacity: .45; }
  #inspect .m { border-color: #F9CC9D; } #inspect .b { border-color: #FDDD9B; }
  #inspect .p { border-color: #C3D08B; } #inspect .c { background: #8CB6C0; }
  #inspect .tag { opacity: 1; border: 0; background: #1B1F3B; color: #fff; font: .75rem ui-monospace, monospace;
    padding: .2rem .45rem; border-radius: 3px; white-space: nowrap; }
</style>
<script>
  const ov = document.getElementById('inspect');
  const [om, ob, op, oc, tag] = ov.children;
  const px = (v) => parseFloat(v) || 0;
  const sides = (cs, f) => ['Top', 'Right', 'Bottom', 'Left'].map((s) => px(cs[f(s)]));
  const put = (el, [t, r, b, l]) => Object.assign(el.style, { top: `${t}px`, left: `${l}px`, width: `${r - l}px`, height: `${b - t}px` });
  let target = null;
  addEventListener('pointerover', (e) => {
    const r = e.target.getBoundingClientRect();
    // Big layout boxes would tint the whole screen: inspect things, not layouts.
    if (e.target === document.body || r.width * r.height > innerWidth * innerHeight * .3) { target = null; ov.classList.add('idle'); return; }
    target = e.target; ov.classList.remove('idle'); requestAnimationFrame(draw);
  });
  addEventListener('scroll', () => target && requestAnimationFrame(draw), { passive: true });
  function draw() {
    const r = target.getBoundingClientRect(), cs = getComputedStyle(target);
    const m = sides(cs, (s) => `margin${s}`), bw = sides(cs, (s) => `border${s}Width`), pd = sides(cs, (s) => `padding${s}`);
    const pad = [r.top + bw[0], r.right - bw[1], r.bottom - bw[2], r.left + bw[3]];
    put(om, [r.top - m[0], r.right + m[1], r.bottom + m[2], r.left - m[3]]); om.style.borderWidth = m.map((v) => `${Math.max(v, 0)}px`).join(' ');
    put(ob, [r.top, r.right, r.bottom, r.left]); ob.style.borderWidth = bw.map((v) => `${v}px`).join(' ');
    put(op, pad); op.style.borderWidth = pd.map((v) => `${v}px`).join(' ');
    put(oc, [pad[0] + pd[0], pad[1] - pd[1], pad[2] - pd[2], pad[3] + pd[3]]);
    const cls = typeof target.className === 'string' && target.className.trim() ? '.' + target.className.trim().split(/\s+/)[0] : '';
    tag.textContent = `${target.tagName.toLowerCase()}${cls} ${Math.round(r.width)} × ${Math.round(r.height)}`;
    tag.style.left = `${Math.min(Math.max(r.left, 4), innerWidth - 220)}px`;
    tag.style.top = `${r.top > 30 ? r.top - 26 : r.bottom + 6}px`;
  }
</script>
```
Each layer is a border ring, not a filled box, so the colors don't stack on top of each other.

## FLIP state board
Items move between columns and glide there. Keep one DOM element per item and move it; never rebuild the elements.

```js
function render(items, columns) {
  const before = new Map(items.map((it) => [it, it.el.getBoundingClientRect()]));
  for (const col of columns) {
    col.querySelectorAll('.row').forEach((n) => n.remove());
    items.filter((it) => it.state === col.dataset.state).forEach((it) => col.append(it.el));
  }
  if (reduce) return;
  for (const it of items) {
    const a = before.get(it), b = it.el.getBoundingClientRect();
    if (!a.width) continue; // new item: let it appear
    it.el.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px)` }, { transform: 'none' }],
      { duration: 450, easing: 'cubic-bezier(.2, 1.2, .4, 1)' });
  }
}
```

## `/` command palette
Press `/` anywhere (except in inputs) to open a filterable list. Arrows move, Enter runs, Esc closes.

```js
const cmds = [{ c: '/start', d: 'Play the hero toy', go: () => {} } /* … */];
let sel = 0, shown = cmds;
function paint(q) {
  q = q.replace(/^\//, '').toLowerCase();
  shown = cmds.filter((x) => x.c.includes(q) || x.d.toLowerCase().includes(q));
  sel = Math.min(sel, Math.max(shown.length - 1, 0));
  list.innerHTML = shown.map((x, i) => `<li role="option" aria-selected="${i === sel}" data-i="${i}"><code>${x.c}</code> ${x.d}</li>`).join('')
    || '<li>No command matches.</li>';
}
input.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, shown.length - 1); paint(input.value); e.preventDefault(); }
  if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); paint(input.value); e.preventDefault(); }
  if (e.key === 'Enter') { close(); shown[sel]?.go(); }
  if (e.key === 'Escape') close();
});
addEventListener('keydown', (e) => {
  if (e.target.matches('input, textarea')) return;
  if (e.key === '/') { e.preventDefault(); open(); }
});
```
Style it like the product's own command UI, if it has one.
