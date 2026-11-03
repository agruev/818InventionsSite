// The list of shipped inventions. To add a new one, append an entry here
// and create its page folder. The counter and the home grid update automatically.
const GOAL = 818;

const ICONS = {
  cards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="11" height="15" rx="2"/><path d="M10 4.5 17.6 3a2 2 0 0 1 2.3 1.6l2 10.5a2 2 0 0 1-1.6 2.3L18 18"/><path d="M8.5 10.5c-1-1-2.5-.2-2.5 1 0 1.5 2.5 3 2.5 3s2.5-1.5 2.5-3c0-1.2-1.5-2-2.5-1z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3"/><circle cx="9" cy="12" r="2.5"/></svg>',
  trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 15 4-5 3 3 6-7"/><path d="M15 6h5v5"/></svg>'
};

// Graffiti on the wall between doors, reused in a loop as the corridor grows.
const DOODLES = {
  tally: '<svg class="doodle tally" viewBox="0 0 120 70"><path d="M8 10 v40 M20 8 v42 M32 10 v40 M44 9 v41 M2 40 L52 18 M66 10 v40 M78 8 v42 M90 10 v40"/></svg>',
  bulb: '<svg class="doodle bulb" viewBox="-8 -8 76 66"><path d="M30 8 a16 16 0 0 1 10 28 v6 h-20 v-6 a16 16 0 0 1 10 -28z M22 46 h16 M24 50 h12 M6 20 h-8 M54 20 h8 M12 4 l-6 -6 M48 4 l6 -6 M26 30 l4 -6 l4 6"/></svg>',
  smiley: '<svg class="doodle smiley" viewBox="0 0 60 60"><path d="M30 4 C14 3 3 16 5 31 C7 47 21 57 34 55 C49 52 58 40 55 25 C53 12 43 5 28 6 M21 22 v4 M38 21 v5 M17 37 Q30 49 43 36"/></svg>'
};

const WALL_ART = [
  `<span class="tag spray-1" style="transform: rotate(-6deg);">IT WORKS ON MY MACHINE</span>
   ${DOODLES.tally}
   <span class="tag pencil" style="transform: rotate(-3deg);">days w/o sleep</span>`,
  `<span class="tag spray-2" style="transform: rotate(-9deg); font-size: 1.7rem;">PUNK'S NOT DEAD</span>
   ${DOODLES.bulb}`,
  `<span class="tag spray-2" style="transform: rotate(-5deg); font-size: 2rem;">818 &hearts;</span>
   ${DOODLES.smiley}
   <span class="tag spray-1" style="transform: rotate(6deg);">ctrl+z</span>`,
  `<span class="tag spray-1" style="transform: rotate(8deg); font-size: 2.2rem;">YOU SUX</span>
   <span class="tag pencil" style="transform: rotate(-2deg);">deadline was yesterday</span>`,
  `<span class="tag spray-2" style="transform: rotate(-4deg); font-size: 1.8rem;">KNOCK LOUDER</span>`
];

// Optional quirks per door: 'small' (shorter door), 'loose' (crooked number plate).
const PROJECTS = [
  {
    number: 1,
    name: 'Belote Scorer',
    tagline: 'Keep score in Belote without pen and paper.',
    platform: 'Mobile',
    icon: 'cards',
    url: 'belote-scorer/',
    quirks: ['small']
  },
  {
    number: 2,
    name: 'Focus Me',
    tagline: 'A virtual camera that keeps you sharp and in frame on every video call.',
    platform: 'Windows',
    icon: 'camera',
    url: 'focus-me/',
    quirks: ['loose']
  },
  {
    number: 3,
    name: 'Trendline',
    tagline: 'Track your weight and see the real trend, not the daily noise.',
    platform: 'Web',
    icon: 'trend',
    url: 'trendline/'
  }
];

function pad(n) {
  return String(n).padStart(3, '0');
}

function renderHome() {
  const count = PROJECTS.length;
  document.getElementById('count').textContent = count;
  document.getElementById('goal').textContent = GOAL;
  document.getElementById('left').textContent = GOAL - count;
  document.getElementById('fill').style.width = (count / GOAL * 100) + '%';
  document.getElementById('progress').setAttribute('aria-valuenow', count);

  const wall = i => `<div class="wall-seg" aria-hidden="true">${WALL_ART[i % WALL_ART.length]}</div>`;

  const cards = PROJECTS.map(p => `
    <a class="card ${(p.quirks || []).join(' ')}" href="${p.url}">
      <span class="plate mono">${pad(p.number)}</span>
      <div class="door-body">
        <div class="icon">${ICONS[p.icon]}</div>
        <h3>${p.name}</h3>
        <p>${p.tagline}</p>
        <div class="card-footer">
          <span class="badge">${p.platform}</span>
          <span class="arrow" aria-hidden="true">&rarr;</span>
        </div>
      </div>
      <span class="knob" aria-hidden="true"></span>
    </a>`);

  cards.push(`
    <div class="card placeholder">
      <svg class="cobweb" viewBox="0 0 160 160" aria-hidden="true"><path d="M0 0 L158.4 22.2 M0 0 L145 67.7 M0 0 L113 113 M0 0 L67.7 145 M0 0 L22.2 158.4 M39.6 5.6 Q33.4 9.9 36.2 16.9 Q28.4 19.9 28.3 28.3 Q19.9 28.4 16.9 36.2 Q9.9 33.4 5.6 39.6 M79.2 11.1 Q66.7 19.8 72.5 33.8 Q56.8 39.8 56.6 56.6 Q39.8 56.8 33.8 72.5 Q19.8 66.7 11.1 79.2 M123.8 17.4 Q104.3 30.9 113.3 52.9 Q88.7 62.2 88.4 88.4 Q62.2 88.7 52.9 113.3 Q30.9 104.3 17.4 123.8"/></svg>
      <span class="plate mono">${pad(count + 1)}</span>
      <div class="door-body">
        <div class="hanger">DO NOT DISTURB<small>inventing</small></div>
        <p>Something new is being built behind this door&hellip;</p>
      </div>
      <span class="knob" aria-hidden="true"></span>
    </div>`);

  // A wall segment before every door and one more at the end of the corridor
  const corridor = document.getElementById('grid');
  corridor.innerHTML = cards.map((c, i) => wall(i) + c).join('') + wall(cards.length);

  setupWalking(corridor);
  setupKnocking();
}

// Knocking on door 818 replays the conversation
function setupKnocking() {
  const door = document.getElementById('door');
  const replay = () => {
    const parts = [door, ...document.querySelectorAll('.chat .bubble')];
    door.classList.add('knocked');
    parts.forEach(el => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });
  };
  door.addEventListener('click', replay);
  door.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      replay();
    }
  });
}

function setupWalking(corridor) {
  const left = document.getElementById('walk-left');
  const right = document.getElementById('walk-right');
  const step = () => {
    const door = corridor.querySelector('.card:not(.small)');
    const seg = corridor.querySelector('.wall-seg');
    return door.offsetWidth + seg.offsetWidth;
  };
  const walk = dir => corridor.scrollBy({ left: dir * step(), behavior: 'smooth' });

  const update = () => {
    const max = corridor.scrollWidth - corridor.clientWidth;
    left.disabled = corridor.scrollLeft <= 2;
    right.disabled = corridor.scrollLeft >= max - 2;
  };

  left.addEventListener('click', () => walk(-1));
  right.addEventListener('click', () => walk(1));
  corridor.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  document.addEventListener('keydown', e => {
    if (e.target.closest('input, textarea')) return;
    if (e.key === 'ArrowLeft') walk(-1);
    if (e.key === 'ArrowRight') walk(1);
  });
  update();
}
