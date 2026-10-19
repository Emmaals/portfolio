/* =========================================================
   LOGIQUE : intro, fils rouges, glisser-déposer, fenêtre de détail
   (le contenu vient de data.js : DATA et LINKS)
   ========================================================= */

const board = document.getElementById('board');
const svg = document.getElementById('strings');
const modal = document.getElementById('modal');
const sheet = document.getElementById('sheet');
const hint = document.getElementById('hint');
const NS = 'http://www.w3.org/2000/svg';

/* ---------- INTRO ---------- */
document.getElementById('start').addEventListener('click', () => {
  document.getElementById('intro').classList.add('hide');
  document.getElementById('app').classList.add('show');
  hint.classList.add('visible');
  requestAnimationFrame(drawStrings);
  setTimeout(drawStrings, 100);
  setTimeout(() => hint.classList.remove('visible'), 6000);
});

/* ---------- FILS ROUGES ---------- */
function pinPos(card) {
  const b = board.getBoundingClientRect();
  const p = card.querySelector('.pin').getBoundingClientRect();
  return { x: p.left - b.left + p.width / 2, y: p.top - b.top + p.height / 2 };
}

function drawStrings() {
  svg.innerHTML = '';
  svg.setAttribute('width', board.scrollWidth);
  svg.setAttribute('height', board.scrollHeight);

  LINKS.forEach(([a, b]) => {
    const ca = document.getElementById('c-' + a);
    const cb = document.getElementById('c-' + b);
    if (!ca || !cb) return;

    const p1 = pinPos(ca), p2 = pinPos(cb);
    const mx = (p1.x + p2.x) / 2;
    const sag = Math.min(60, Math.hypot(p2.x - p1.x, p2.y - p1.y) * 0.12);
    const my = (p1.y + p2.y) / 2 + sag;
    const d = `M${p1.x},${p1.y} Q${mx},${my} ${p2.x},${p2.y}`;

    const shadow = document.createElementNS(NS, 'path');
    shadow.setAttribute('d', d);
    shadow.setAttribute('class', 'sh');

    const thread = document.createElementNS(NS, 'path');
    thread.setAttribute('d', d);
    thread.setAttribute('class', 's');

    svg.appendChild(shadow);
    svg.appendChild(thread);
  });
}
window.addEventListener('resize', drawStrings);

/* ---------- GLISSER-DÉPOSER + CLIC ---------- */
document.querySelectorAll('.card').forEach(card => {
  let startX, startY, origL, origT, moved = false, active = false;

  card.addEventListener('pointerdown', e => {
    active = true;
    moved = false;
    card.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startY = e.clientY;
    origL = card.offsetLeft;
    origT = card.offsetTop;
    card.classList.add('dragging');
  });

  card.addEventListener('pointermove', e => {
    if (!active) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
    if (!moved) return;

    const maxL = board.scrollWidth - card.offsetWidth;
    const maxT = board.scrollHeight - card.offsetHeight;
    card.style.left = Math.max(0, Math.min(maxL, origL + dx)) + 'px';
    card.style.top = Math.max(0, Math.min(maxT, origT + dy)) + 'px';
    drawStrings();
  });

  card.addEventListener('pointerup', () => {
    active = false;
    card.classList.remove('dragging');
    if (!moved) openModal(card.dataset.id);
  });

  card.addEventListener('pointercancel', () => {
    active = false;
    card.classList.remove('dragging');
  });
});

/* ---------- FENÊTRE DE DÉTAIL ---------- */
function openModal(id) {
  const d = DATA[id];
  if (!d) return;

  sheet.innerHTML = `
    <button class="close" aria-label="Fermer">×</button>
    <div class="stamp">DOSSIER OUVERT</div>
    <h2>${d.title}</h2>
    <div class="sub">${d.sub}</div>
    ${d.body.map(t => `<p>${t}</p>`).join('')}
    <div class="tags">${(d.tags || []).map(t => `<span>${t}</span>`).join('')}</div>
    ${d.link ? `<p><a href="${d.link.href}">→ ${d.link.label}</a></p>` : ''}
  `;
  modal.classList.add('open');
  sheet.querySelector('.close').addEventListener('click', closeModal);
}

function closeModal() {
  modal.classList.remove('open');
}

modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
