// 8-bit dorm room. Every sprite is a grid of characters, one character per pixel;
// '.' is transparent and the other characters are looked up in a palette.

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function sprite(rows, pal, px, cls = '') {
  const h = rows.length;
  const w = Math.max(...rows.map(r => r.length));
  let rects = '';
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (!pal[c]) { x++; continue; }
      let end = x;
      while (end < row.length && row[end] === c) end++;
      rects += `<rect x="${x}" y="${y}" width="${end - x}" height="1" fill="${pal[c]}"/>`;
      x = end;
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" viewBox="0 0 ${w} ${h}" width="${w * px}" height="${h * px}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

const OUTLINE = '#1a1a2e';

const SPRITES = {
  cards: {
    pal: { K: OUTLINE, B: '#3b5dc9', b: '#6d8ff0', W: '#f4f4f4', G: '#c2c3c7', R: '#e43b44' },
    rows: [
      '.KKKKKKKKKK.....',
      '.KbBbBbBbBK.....',
      '.KBbBKKKKKKKKKK.',
      '.KbBbKRWWWWWWWK.',
      '.KBbBKRWWWWWWWK.',
      '.KbBbKWWWWWWWWK.',
      '.KBbBKWRRWRRWWK.',
      '.KbBbKRRRRRRRWK.',
      '.KBbBKRRRRRRRWK.',
      '.KbBbKWRRRRRWWK.',
      '.KBbBKWWRRRWWWK.',
      '.KbBbKWWWRWWWWK.',
      '.KBbBKWWWWWWWRK.',
      '.KKKKKWWWWWWWRK.',
      '.....KGGGGGGGGK.',
      '.....KKKKKKKKKK.'
    ]
  },
  camera: {
    pal: { K: OUTLINE, D: '#3a3a4a', M: '#5a5a6e', L: '#2a9df4', l: '#9fd8ff', R: '#e43b44', S: '#b0b0c0' },
    rows: [
      '....KKKKKKKK....',
      '...KDDDDDDDDK...',
      '..KDMMMMMMMMDK..',
      '.KDMMMKKKKMMMDK.',
      '.KDMMKLLLLKMRDK.',
      '.KDMKLLllLLKMDK.',
      '.KDMKLlLLLLKMDK.',
      '.KDMKLLLLLLKMDK.',
      '.KDMMKLLLLKMMDK.',
      '.KDMMMKKKKMMMDK.',
      '..KDMMMMMMMMDK..',
      '...KDDDDDDDDK...',
      '....KKKSSKKK....',
      '.......SS.......',
      '.....KSSSSK.....',
      '...KSSSSSSSSK...'
    ]
  },
  trend: {
    pal: { K: OUTLINE, Y: '#f7c948', y: '#c28a1e' },
    rows: [
      '.......KK.......',
      '......KYYK......',
      '.YYYYYYYYYYYYYY.',
      '.y....KYYK....y.',
      '.y.....YY.....y.',
      '.y.y...YY...y.y.',
      'KYYYK..YY..KYYYK',
      '.KyK...YY...KyK.',
      '.......YY.......',
      '.......YY.......',
      '.......YY.......',
      '.......YY.......',
      '......yYYy......',
      '.....KyyyyK.....',
      '....KYYYYYYK....',
      '...KKKKKKKKKK...'
    ]
  },
  box: {
    pal: { K: OUTLINE, C: '#c8915a', c: '#8f5e33', T: '#e8d7a8' },
    rows: [
      '.KKKKKKKKKKKKKK.',
      '.KCCCCCTTCCCCCK.',
      '.KcccccTTcccccK.',
      '.KCCCCCCCCCCCCK.',
      '.KCCCCCKKCCCCCK.',
      '.KCCCCKCCKCCCCK.',
      '.KCCCCCCCKCCCCK.',
      '.KCCCCCCKCCCCCK.',
      '.KCCCCCCCCCCCCK.',
      '.KCCCCCCKCCCCCK.',
      '.KccccccccccccK.',
      '.KKKKKKKKKKKKKK.'
    ]
  },
  noodles: {
    pal: { K: OUTLINE, W: '#f4f4f4', R: '#e43b44', Y: '#f2d16b' },
    rows: [
      '.KKKKKKKKKK.',
      '.KYYYYYYYYK.',
      'KWWWWWWWWWWK',
      'KRRRRRRRRRRK',
      '.KRWWRRWWRK.',
      '.KRRRRRRRRK.',
      '.KWWWWWWWWK.',
      '..KWWWWWWK..',
      '..KWWWWWWK..',
      '..KKKKKKKK..'
    ]
  }
};

const ROACH_PAL = { b: '#6b3a1e', d: '#2e170a' };
const ROACH_FRAMES = [
  [
    '.d..d..dd',
    '..bbbbbd.',
    '.bbbbbbbd',
    '..bbbbbd.',
    '.d..d..dd'
  ],
  [
    'd..d..d.d',
    '..bbbbbd.',
    '.bbbbbbbd',
    '..bbbbbd.',
    'd..d..d.d'
  ]
];

const WALLPAPER = {
  pal: { a: '#b8a77a', b: '#a8966a', c: '#7d6b45' },
  rows: [
    'aaaaabaaaaab',
    'aacaabaaaaab',
    'acccabaaaaab',
    'aacaabaaaaab',
    'aaaaabaaaaab',
    'aaaaabaaaaab',
    'aaaaabaacaab',
    'aaaaabacccab',
    'aaaaabaacaab',
    'aaaaabaaaaab',
    'aaaaabaaaaab',
    'aaaaabaaaaab'
  ]
};

/* Procedural wall damage */

function grid(w, h) {
  return Array.from({ length: h }, () => Array(w).fill('.'));
}

function line(g, x0, y0, x1, y1, ch) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    if (g[y0] && x0 >= 0 && x0 < g[0].length) g[y0][x0] = ch;
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

function blobMask(w, h, rnd, noise) {
  return Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => {
    const nx = (x + 0.5 - w / 2) / (w / 2);
    const ny = (y + 0.5 - h / 2) / (h / 2);
    return nx * nx + ny * ny + (rnd() - 0.5) * noise < 1;
  }));
}

function isEdge(m, x, y) {
  return [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !(m[y + dy] && m[y + dy][x + dx]));
}

// A patch of torn-off wallpaper: ragged paper edge, plaster or bricks underneath
function torn(w, h, seed, brick) {
  const rnd = mulberry32(seed);
  const m = blobMask(w, h, rnd, 0.5);
  return m.map((row, y) => row.map((inside, x) => {
    if (!inside) return '.';
    if (isEdge(m, x, y)) return 'e';
    if (m[y - 1] && isEdge(m, x, y - 1)) return 's';
    if (brick) {
      const course = Math.floor(y / 3);
      const mortar = y % 3 === 2 || (x + (course % 2) * 3) % 6 === 5;
      return mortar ? 'm' : (rnd() < 0.2 ? 'R' : 'r');
    }
    return rnd() < 0.25 ? 'q' : 'p';
  }).join(''));
}
const TORN_PAL = { e: '#efe6cf', s: '#6e6960', p: '#a39d92', q: '#8f897e', r: '#9c4f3c', R: '#843f2f', m: '#b3aa9a' };

function hole(w, h, seed) {
  const rnd = mulberry32(seed);
  const m = blobMask(w, h, rnd, 0.3);
  return m.map((row, y) => row.map((inside, x) => !inside ? '.' : isEdge(m, x, y) ? 'h' : 'k').join(''));
}
const HOLE_PAL = { h: '#5a544b', k: '#1b1714' };

function crack(len, seed) {
  const rnd = mulberry32(seed);
  const h = 16;
  const g = grid(len, h);
  let y = h / 2;
  for (let x = 0; x < len; x++) {
    g[y][x] = 'k';
    if (rnd() < 0.4) y = Math.min(h - 1, Math.max(0, y + (rnd() < 0.5 ? -1 : 1)));
    if (rnd() < 0.08) {
      let by = y, bx = x;
      const dir = rnd() < 0.5 ? -1 : 1;
      for (let i = 0; i < 4; i++) {
        bx++; by += dir;
        if (g[by] && bx < len) g[by][bx] = 'k';
      }
    }
  }
  return g.map(r => r.join(''));
}
const CRACK_PAL = { k: '#3b342c' };

function cobweb(n) {
  const g = grid(n, n);
  const angles = [4, 24, 45, 66, 86].map(a => a * Math.PI / 180);
  angles.forEach(a => line(g, 0, 0, Math.cos(a) * n * 1.3, Math.sin(a) * n * 1.3, 'w'));
  [0.3, 0.55, 0.8].forEach(r => {
    for (let i = 0; i < angles.length - 1; i++) {
      const a = angles[i], b = angles[i + 1];
      line(g, Math.cos(a) * n * r, Math.sin(a) * n * r, Math.cos(b) * n * r, Math.sin(b) * n * r, 'w');
    }
  });
  return g.map(r => r.join(''));
}
const WEB_PAL = { w: 'rgba(240, 240, 240, 0.75)' };

function stain(w, h, seed) {
  const rnd = mulberry32(seed);
  const m = blobMask(w, h, rnd, 0.7);
  return m.map(row => row.map(inside => !inside ? '.' : rnd() < 0.3 ? 'y' : 'x').join(''));
}
const STAIN_PAL = { x: 'rgba(80, 55, 20, 0.16)', y: 'rgba(80, 55, 20, 0.26)' };

function roach(cls) {
  const [a, b] = ROACH_FRAMES.map(f => sprite(f, ROACH_PAL, 4));
  return `<div class="roach ${cls}" aria-hidden="true"><span class="f1">${a}</span><span class="f2">${b}</span></div>`;
}

function place(svg, pos, cls = '') {
  const style = Object.entries(pos).map(([k, v]) => `${k}:${v}`).join(';');
  return `<div class="decor ${cls}" style="${style}">${svg}</div>`;
}

function renderWall(room) {
  const tile = sprite(WALLPAPER.rows, WALLPAPER.pal, 4);
  room.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(tile)}")`;

  const decor = [
    place(sprite(stain(20, 12, 21), STAIN_PAL, 6), { left: '14%', top: '30%' }),
    place(sprite(stain(26, 14, 22), STAIN_PAL, 6), { left: '68%', top: '72%' }),
    place(sprite(stain(18, 10, 23), STAIN_PAL, 6), { left: '40%', top: '6%' }),

    place(sprite(torn(22, 16, 3, true), TORN_PAL, 6), { left: '3%', top: '12%' }),
    place(sprite(torn(16, 22, 7, false), TORN_PAL, 6), { right: '4%', top: '16%' }),
    place(sprite(torn(28, 14, 11, true), TORN_PAL, 6), { right: '6%', top: '64%' }, 'wide'),
    place(sprite(torn(14, 18, 5, false), TORN_PAL, 6), { left: '5%', top: '66%' }, 'wide'),

    place(sprite(hole(6, 5, 2), HOLE_PAL, 6), { left: '22%', top: '46%' }),
    place(sprite(hole(5, 5, 9), HOLE_PAL, 6), { left: '76%', top: '40%' }, 'wide'),
    place(sprite(hole(7, 5, 4), HOLE_PAL, 6), { left: '32%', top: '88%' }),

    place(sprite(crack(34, 1), CRACK_PAL, 4), { left: '24%', top: '3%' }),
    place(sprite(crack(28, 8), CRACK_PAL, 4), { left: '56%', top: '90%' }, 'wide'),
    place(sprite(crack(24, 6), CRACK_PAL, 4), { left: '1%', top: '44%' }),

    place(sprite(cobweb(30), WEB_PAL, 4), { left: '0', top: '0' }),
    place(sprite(cobweb(26), WEB_PAL, 4), { right: '0', top: '0' }, 'flip'),

    roach('roach-1'),
    roach('roach-2'),
    roach('roach-3')
  ];
  document.getElementById('wall-decor').innerHTML = decor.join('');
}

/* Shelves */

function itemSprite(key) {
  const s = SPRITES[key];
  return sprite(s.rows, s.pal, 6);
}

function slotHtml(slot) {
  if (slot.kind === 'project') {
    const p = slot.project;
    return `
      <div class="slot">
        <a class="item" href="${p.url}">
          ${itemSprite(p.icon)}
          <span class="bubble"><b>${p.name}</b>${p.tagline}<em>${p.platform}</em></span>
        </a>
        <span class="label"><i>${pad(p.number)}</i>${p.name}</span>
      </div>`;
  }
  if (slot.kind === 'box') {
    return `
      <div class="slot">
        <div class="item" tabindex="0">
          ${itemSprite('box')}
          <span class="bubble"><b>Invention ${pad(slot.number)}</b>Still in the box. Coming soon&hellip;</span>
        </div>
        <span class="label"><i>${pad(slot.number)}</i>???</span>
      </div>`;
  }
  if (slot.kind === 'decor') {
    return `<div class="slot"><div class="junk">${itemSprite(slot.sprite)}</div></div>`;
  }
  return '<div class="slot"></div>';
}

function renderShelves() {
  const cols = window.innerWidth < 600 ? 2 : 3;
  const items = PROJECTS.map(p => ({ kind: 'project', project: p }));
  items.push({ kind: 'box', number: PROJECTS.length + 1 });
  const junk = [{ kind: 'decor', sprite: 'noodles' }];

  const shelves = Math.max(3, Math.ceil((items.length + junk.length) / cols));
  const slots = Array(shelves * cols).fill({ kind: 'empty' });
  items.forEach((it, i) => { slots[i] = it; });
  junk.forEach((it, i) => { slots[slots.length - 1 - i] = it; });

  let html = '<span class="post left"></span><span class="post right"></span>';
  for (let s = 0; s < shelves; s++) {
    const row = slots.slice(s * cols, (s + 1) * cols).map(slotHtml).join('');
    html += `<div class="shelf" style="--cols:${cols}">${row}${s === shelves - 1 ? roach('roach-shelf') : ''}</div>`;
  }
  const unit = document.getElementById('shelves');
  unit.innerHTML = html;
  unit.dataset.cols = cols;
}

function renderRoom() {
  const count = PROJECTS.length;
  document.getElementById('count').textContent = pad(count);
  document.getElementById('goal').textContent = GOAL;
  document.getElementById('fill').style.width = (count / GOAL * 100) + '%';

  renderWall(document.getElementById('room'));
  renderShelves();

  window.addEventListener('resize', () => {
    const cols = window.innerWidth < 600 ? 2 : 3;
    if (String(cols) !== document.getElementById('shelves').dataset.cols) renderShelves();
  });
}
