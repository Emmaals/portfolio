/* =========================================================
   LOGIQUE DU PORTFOLIO
   - intro, mise à l'échelle du tableau, fils rouges
   - jauge « Dossier complété » (remplissage progressif)
   - une transition différente pour chaque élément
   Le contenu vient de data.js, les sons de audio.js
   ========================================================= */
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');

  const W = 1600, H = 900;           // taille du « décor » (mis à l'échelle de l'écran)
  const stage = $('#stage'), world = $('#world'), viewport = $('#viewport');
  const svg = $('#strings');
  const toastEl = $('#toast');

  /* ======================================================
     1. MISE À L'ÉCHELLE + ZOOM
     ====================================================== */
  function fit() {
    const w = viewport.clientWidth, h = viewport.clientHeight;
    const s = Math.min(w / W, h / H);
    stage.style.transform = `translate(${(w - W * s) / 2}px, ${(h - H * s) / 2}px) scale(${s})`;
  }
  function zoomTo(cx, cy, z) {
    world.style.transform = `translate(${W / 2 - cx * z}px, ${H / 2 - cy * z}px) scale(${z})`;
  }
  function zoomReset() { world.style.transform = 'translate(0px, 0px) scale(1)'; }
  const centerOf = el => ({ x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 });

  /* ======================================================
     2. CONSTRUCTION DU DÉCOR À PARTIR DE data.js
     ====================================================== */
  const POSTIT_SLOTS = [
    { l: 410,  t: 150, r: -6, c: 'y' },
    { l: 590,  t: 40,  r: 4,  c: 'p' },
    { l: 1000, t: 50,  r: -3, c: 'b' },
    { l: 1190, t: 150, r: 6,  c: 'g' }
  ];
  const QUAL = QUALITIES.slice(0, POSTIT_SLOTS.length);

  $('#postits').innerHTML = QUAL.map((q, i) => {
    const s = POSTIT_SLOTS[i];
    return `<div class="card postit ${s.c} hot" id="c-q${i}" data-action="quality" data-i="${i}" data-key="q${i}" data-r="${s.r}"
              style="left:${s.l}px;top:${s.t}px;--r:${s.r}deg;--halo:#ffb703;--pin:#f2b705">
              <div class="pin"></div>
              <div class="kw">${esc(q.kw)}</div>
              <div class="dt">${esc(q.text)}</div>
            </div>`;
  }).join('');

  $('#projCount').textContent = `0/${PROJECTS.length}`;
  $('#meCap').textContent = '??? ???';
  $('#miniInd').innerHTML = SKILLS.slice(0, 4).map((s, i) => `<li>▸ Indice ${pad(i + 1)}</li>`).join('');

  /* ---- Planche (infos) ---- */
  $('#planche').innerHTML = `
    <div class="tape ta"></div><div class="tape tb"></div>
    <h2 class="pl-title">Fiche signalétique</h2>
    <p class="pl-sub">Dossier n°001 — ${esc(PROFILE.name)}</p>
    <div class="pl-grid">
      <div class="pl-left">
        <figure class="pl-photo"><img src="${esc(PROFILE.photo)}" alt=""><figcaption>${esc(PROFILE.caption)}</figcaption></figure>
        <div class="pl-postit">${esc(INFO.recherche.short)}</div>
      </div>
      <div class="pl-right">
        <section><h3>Formation</h3><ul>${INFO.formation.map(f => `<li><b>${esc(f.date)}</b>${esc(f.text)}</li>`).join('')}</ul></section>
        <section><h3>Parcours</h3><ul>${INFO.parcours.map(f => `<li><b>${esc(f.date)}</b>${esc(f.text)}</li>`).join('')}</ul></section>
        <section><h3>Poste recherché</h3><p>${esc(INFO.recherche.text)}</p></section>
      </div>
    </div>`;

  /* ---- Rapport d'expertise ---- */
  $('#indList').innerHTML = SKILLS.map((s, i) => `
    <li class="ind" style="--i:${i};--v:${s.level}%">
      <span class="n">INDICE ${pad(i + 1)}</span>
      <div class="ind-main"><strong>${esc(s.name)}</strong><small>${esc(s.note)}</small>
        <div class="bar"><i></i></div></div>
      <span class="lv">${s.level}%</span>
    </li>`).join('');

  /* ---- Classeur de projets ---- */
  const binder = $('#binder');
  const pages = PROJECTS.map((p, i) => {
    const pg = document.createElement('article');
    pg.className = 'page';
    pg.style.setProperty('--c', p.color);
    pg.style.setProperty('--i', i);
    pg.style.setProperty('--pr', (i === 0 ? 0 : (((i * 37) % 9) - 4) * 0.3) + 'deg');
    pg.style.zIndex = PROJECTS.length - i;
    pg.innerHTML = `
      <button class="tab" type="button" aria-label="${esc(p.tab)}"><span>${esc(p.tab)}</span></button>
      <div class="bigname">${esc(p.name)}</div>
      <div class="open-hint">Clique sur l'onglet pour consulter l'affaire</div>
      <div class="case-no">AFFAIRE N°${esc(p.n)}</div>
      <div class="detail">
        <div class="d-left">
          <figure class="photo"><img src="${esc(p.scene)}" alt=""><figcaption>${esc(p.sceneCaption)}</figcaption></figure>
        </div>
        <div class="d-right">
          <h2>${esc(p.name)}</h2>
          <div class="d-block"><h4>Arme du crime</h4><div class="weapons">${p.weapons.map(w => `<span>${esc(w)}</span>`).join('')}</div></div>
          <div class="d-block"><h4>Résumé de l'affaire</h4><p>${esc(p.summary)}</p></div>
          <div class="d-block"><h4>Indice retenu</h4><p class="clue">${esc(p.clue)}</p></div>
        </div>
      </div>
      <div class="stamp-p">${esc(p.stamp)}</div>`;
    binder.appendChild(pg);
    return pg;
  });

  /* ---- Badge de contact (style illustré, hors DA réaliste) ---- */
  $('#contactBox').innerHTML = `
    <div class="lanyard">
      <svg class="strap" viewBox="0 0 220 150" width="220" height="150" aria-hidden="true">
        <path d="M20 0 L62 0 L128 118 L98 130 Z" fill="#e63946"/>
        <path d="M200 0 L158 0 L92 118 L122 130 Z" fill="#c1121f"/>
        <rect x="92" y="108" width="36" height="34" rx="7" fill="#cfd3d8" stroke="#1b1b1b" stroke-width="4"/>
        <circle cx="110" cy="136" r="7" fill="#1b1b1b"/>
      </svg>
      <div class="badge">
        <div class="b-head"><span>★</span> BRIGADE CRÉATIVE <span>★</span></div>
        <div class="b-id">
          <div class="b-photo"><img src="${esc(PROFILE.photo)}" alt=""></div>
          <div class="b-name"><small>INSPECTEUR·TRICE</small><h2>${esc(PROFILE.first)}<br>${esc(PROFILE.last)}</h2></div>
        </div>
        <div class="b-plaque"><b>${esc(PROFILE.role)}</b><span>${esc(PROFILE.seeking)}</span></div>
        <div class="b-sub">Contacts autorisés</div>
        <ul class="b-list">
          <li><span class="hab">HABILITATION 01 · MAIL</span><a href="mailto:${esc(CONTACT.email)}">${esc(CONTACT.email)}</a></li>
          <li><span class="hab">HABILITATION 02 · LINKEDIN</span><a href="${esc(CONTACT.linkedinUrl)}" target="_blank" rel="noopener">${esc(CONTACT.linkedin)}</a></li>
          <li><span class="hab">HABILITATION 03 · TÉLÉPHONE</span><a href="tel:${esc(CONTACT.phone.replace(/\s/g, ''))}">${esc(CONTACT.phone)}</a></li>
        </ul>
        <div class="b-bar" aria-hidden="true"></div>
      </div>
    </div>`;

  /* ---- Écran final : qui suis-je ---- */
  $('#finalBox').innerHTML = `
    <div class="final">
      <figure class="f-photo"><img src="${esc(PROFILE.photo)}" alt=""><figcaption>${esc(PROFILE.name)}</figcaption></figure>
      <div class="f-text">
        <div class="f-stamp">${esc(FINAL.headline)}</div>
        <h2>${esc(PROFILE.name)}</h2>
        <p class="f-role">${esc(PROFILE.role)}</p>
        ${FINAL.bio.map(p => `<p>${esc(p)}</p>`).join('')}
        <dl>${FINAL.facts.map(f => `<div><dt>${esc(f[0])}</dt><dd>${esc(f[1])}</dd></div>`).join('')}</dl>
      </div>
    </div>`;

  /* ======================================================
     3. FILS ROUGES (se dessinent à l'arrivée sur le tableau)
     ====================================================== */
  const NS = 'http://www.w3.org/2000/svg';
  function pinPos(el) {
    const r = (parseFloat(el.dataset.r) || 0) * Math.PI / 180;
    const c = centerOf(el);
    const h = el.offsetHeight / 2;
    return { x: c.x + h * Math.sin(r), y: c.y - h * Math.cos(r) };
  }
  function drawStrings() {
    svg.innerHTML = '';
    LINKS.forEach(([a, b], i) => {
      const ea = document.getElementById(a), eb = document.getElementById(b);
      if (!ea || !eb) return;
      const p1 = pinPos(ea), p2 = pinPos(eb);
      const sag = Math.min(70, Math.hypot(p2.x - p1.x, p2.y - p1.y) * 0.13);
      const d = `M${p1.x},${p1.y} Q${(p1.x + p2.x) / 2},${(p1.y + p2.y) / 2 + sag} ${p2.x},${p2.y}`;
      ['sh', 's'].forEach(cls => {
        const p = document.createElementNS(NS, 'path');
        p.setAttribute('d', d);
        p.setAttribute('class', cls);
        svg.appendChild(p);
        const len = Math.ceil(p.getTotalLength()) + 2;
        p.style.setProperty('--len', len);
        p.style.setProperty('--d', (i * 0.09) + 's');
      });
    });
  }

  /* ======================================================
     4. JAUGE « DOSSIER COMPLÉTÉ »
     ====================================================== */
  // infos + post-its + onglets de projets + timeline + rapport d'expertise + badge de contact
  const TOTAL_ALL = 1 + QUAL.length + PROJECTS.length + 1 + 1 + 1;
  const visited = new Set();
  const gauge = $('#gauge'), gFill = $('#gFill'), gPct = $('#gPct');
  let shown = 0, raf = 0, unlocked = false;

  function toast(msg, ms) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toastEl.classList.remove('show'), ms || 3200);
  }

  function markDone(key) {
    $$('[data-key="' + key + '"]').forEach(e => e.classList.add('done'));
    if (PROJECTS.every((_, i) => visited.has('p' + i))) $('#c-proj').classList.add('done');
  }

  function visit(key) {
    if (visited.has(key)) return;
    visited.add(key);
    markDone(key);
    gaugeTo(Math.round(visited.size / TOTAL_ALL * 100));
  }

  function gaugeTo(target) {
    gFill.style.width = target + '%';
    gauge.classList.add('filling');
    const from = shown, t0 = performance.now(), dur = 1700;
    cancelAnimationFrame(raf);
    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    (function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      shown = from + (target - from) * ease(p);
      gPct.textContent = Math.round(shown) + '%';
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        gauge.classList.remove('filling');
        if (target >= 100 && !unlocked) unlock();
      }
    })(t0);
  }

  function unlock() {
    unlocked = true;
    const me = $('#c-me');
    me.classList.add('unlocked');
    $('#meCap').textContent = PROFILE.name;
    SFX.unlock();
    toast('Dossier complété ! Clique sur la photo du milieu.', 5000);
  }

  /* ======================================================
     5. OUVERTURE / FERMETURE DES ÉLÉMENTS
     ====================================================== */
  let active = null;                       // fonction de fermeture de l'élément ouvert
  const showOv = el => { el.classList.remove('closing'); el.classList.add('open'); };
  const hideOv = el => { el.classList.add('closing'); setTimeout(() => el.classList.remove('open', 'closing'), 380); };
  function closeActive() { if (active) { const c = active; active = null; c(); } }

  /* ---- INFOS : recul de caméra, comme si on sortait une feuille ---- */
  const ovInfo = $('#ov-info');
  function openInfo() {
    visit('info');
    SFX.typewriter();
    zoomTo(W / 2, H / 2, 0.86);
    world.classList.add('pullback');
    setTimeout(() => { SFX.paper(); showOv(ovInfo); }, 320);
    active = () => { hideOv(ovInfo); zoomReset(); world.classList.remove('pullback'); };
  }

  /* ---- QUALITÉS : zoom sur le mur, le reste s'assombrit ---- */
  const ovQuality = $('#ov-quality');
  let focusEl = null;
  function openQuality(el) {
    const i = el.dataset.i;
    visit('q' + i);
    SFX.swoosh();
    focusEl = el;
    const c = centerOf(el);
    el.classList.add('focus');
    world.classList.add('dimmed');
    zoomTo(c.x, c.y, 2.7);
    setTimeout(() => el.classList.add('open'), 520);
    showOv(ovQuality);
    active = () => {
      el.classList.remove('open');
      hideOv(ovQuality);
      zoomReset();
      world.classList.remove('dimmed');
      SFX.swoosh();
      setTimeout(() => el.classList.remove('focus'), 800);
    };
  }
  ovQuality.addEventListener('click', e => {
    if (e.target.closest('.x') || !focusEl) return;
    const r = focusEl.getBoundingClientRect();
    if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) return;
    closeActive();
  });

  /* ---- PROJETS : classeur d'archives, onglets, page « qu'on tire » ---- */
  const ovProjects = $('#ov-projects');
  let zTop = 50, frontIdx = 0;
  pages[0].classList.add('front');

  function updateCount() {
    const n = pages.filter(p => p.classList.contains('revealed')).length;
    $('#projCount').textContent = `${n}/${PROJECTS.length}`;
  }
  function bringFront(i) {
    const pg = pages[i];
    pg.style.zIndex = ++zTop;
    pages.forEach((p, k) => p.classList.toggle('front', k === i));
    frontIdx = i;
    pg.classList.remove('pull'); void pg.offsetWidth; pg.classList.add('pull');
    if (!pg.classList.contains('revealed')) {
      pg.classList.add('revealed');
      visit('p' + i);
      updateCount();
    }
    SFX.paper();
  }
  pages.forEach((pg, i) => {
    $('.tab', pg).addEventListener('click', e => {
      e.stopPropagation();
      if (i === frontIdx && pg.classList.contains('revealed')) return;
      bringFront(i);
    });
    pg.addEventListener('click', () => {
      if (pg.classList.contains('front') && !pg.classList.contains('revealed')) bringFront(i);
    });
  });
  function openProjects() {
    SFX.paper();
    showOv(ovProjects);
    const cover = $('.cover', ovProjects);
    cover.style.animation = 'none'; void cover.offsetWidth; cover.style.animation = '';
    active = () => hideOv(ovProjects);
  }

  /* ---- TIMELINE : règle de caméra, viseur ---- */
  const ovTime = $('#ov-time'), ruler = $('#ruler'), track = $('#track'), vfCard = $('#vfCard'), tcEl = $('#tc');
  const GAP = 430;
  let tlIdx = -1;
  function buildTimeline() {
    const sp = Math.round(ruler.clientWidth / 2);
    track.style.width = (sp * 2 + (TIMELINE.length - 1) * GAP) + 'px';
    track.innerHTML = TIMELINE.map((t, i) =>
      `<button type="button" class="mk" data-i="${i}" style="left:${sp + i * GAP}px"><b>${esc(t.date)}</b><i></i></button>`).join('');
    $$('.mk', track).forEach(m => m.addEventListener('click', () =>
      ruler.scrollTo({ left: m.dataset.i * GAP, behavior: 'smooth' })));
    tlIdx = -1;
    ruler.scrollLeft = 0;
    onRulerScroll();
  }
  function onRulerScroll() {
    const pos = ruler.scrollLeft;
    const frames = Math.floor(pos / 4);
    tcEl.textContent = `00:${pad(Math.floor(frames / 25 / 60) % 60)}:${pad(Math.floor(frames / 25) % 60)}:${pad(frames % 25)}`;
    const idx = Math.max(0, Math.min(TIMELINE.length - 1, Math.round(pos / GAP)));
    const dist = Math.abs(pos - idx * GAP);
    if (idx !== tlIdx) {
      tlIdx = idx;
      const t = TIMELINE[idx];
      vfCard.innerHTML = `<div class="date">${esc(t.date)}</div><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p>`;
      $$('.mk', track).forEach((m, k) => m.classList.toggle('on', k === idx));
    }
    vfCard.style.opacity = String(1 - Math.min(1, dist / 200) * 0.92);
  }
  ruler.addEventListener('scroll', onRulerScroll);
  ruler.addEventListener('wheel', e => { e.preventDefault(); ruler.scrollLeft += e.deltaY + e.deltaX; }, { passive: false });
  let drag = null;
  ruler.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') { drag = { x: e.clientX, s: ruler.scrollLeft }; ruler.classList.add('grab'); } });
  window.addEventListener('pointermove', e => { if (drag) ruler.scrollLeft = drag.s - (e.clientX - drag.x); });
  window.addEventListener('pointerup', () => { drag = null; ruler.classList.remove('grab'); });

  function openTime() {
    visit('time');
    SFX.camera();
    showOv(ovTime);
    buildTimeline();
    active = () => hideOv(ovTime);
  }

  /* ---- COMPÉTENCES : rapport d'expertise, scan des indices ---- */
  const ovSkills = $('#ov-skills');
  function openSkills() {
    visit('skills');
    SFX.paper();
    ovSkills.classList.remove('scan'); void ovSkills.offsetWidth; ovSkills.classList.add('scan');
    showOv(ovSkills);
    active = () => hideOv(ovSkills);
  }

  /* ---- CONTACT : badge direct, sans zoom ---- */
  const ovContact = $('#ov-contact');
  function openContact() {
    visit('contact');
    SFX.keys();
    showOv(ovContact);
    setTimeout(() => SFX.keys(), 320);
    active = () => hideOv(ovContact);
  }

  /* ---- DOSSIER CENTRAL : qui suis-je ---- */
  const ovFinal = $('#ov-final');
  function openMe() {
    const me = $('#c-me');
    if (!unlocked) {
      me.classList.remove('shake'); void me.offsetWidth; me.classList.add('shake');
      SFX.stamp();
      toast(`Dossier verrouillé — encore ${TOTAL_ALL - visited.size} indice(s) à consulter.`);
      return;
    }
    SFX.swoosh();
    const c = centerOf(me);
    world.classList.add('dimmed');
    zoomTo(c.x, c.y, 2.1);
    setTimeout(() => { showOv(ovFinal); setTimeout(() => SFX.stamp(), 900); }, 750);
    active = () => { hideOv(ovFinal); zoomReset(); world.classList.remove('dimmed'); SFX.swoosh(); };
  }

  /* ======================================================
     6. ÉVÉNEMENTS GÉNÉRAUX
     ====================================================== */
  world.addEventListener('click', e => {
    const t = e.target.closest('[data-action]');
    if (!t || active) return;
    switch (t.dataset.action) {
      case 'info': openInfo(); break;
      case 'quality': openQuality(t); break;
      case 'projects': openProjects(); break;
      case 'time': openTime(); break;
      case 'skills': openSkills(); break;
      case 'contact': openContact(); break;
      case 'me': openMe(); break;
    }
  });

  let lastHot = null;
  world.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-action]');
    if (t && t !== lastHot) { lastHot = t; if (!active) SFX.hover(); }
    else if (!t) lastHot = null;
  });
  binder.addEventListener('mouseover', e => { if (e.target.closest('.tab')) SFX.hover(); });

  document.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeActive(); });
  [ovInfo, ovProjects, ovTime, ovSkills, ovContact, ovFinal].forEach(ov =>
    ov.addEventListener('click', e => { if (e.target === ov) closeActive(); }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeActive();
    if (ovTime.classList.contains('open')) {
      if (e.key === 'ArrowRight') ruler.scrollBy({ left: GAP, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') ruler.scrollBy({ left: -GAP, behavior: 'smooth' });
    }
  });

  $('#mute').addEventListener('click', () => {
    const m = SFX.toggleMute();
    $('#mute').textContent = m ? '🔇' : '🔊';
  });

  /* ---- Démarrage : page noire → tableau ---- */
  $('#start').addEventListener('click', () => {
    SFX.init();
    SFX.swoosh();
    $('#intro').classList.add('hide');
    $('#topbar').classList.remove('hidden');
    viewport.classList.remove('hidden');
    fit();
    drawStrings();
    setTimeout(() => svg.classList.add('drawn'), 700);
    setTimeout(() => toast('Clique sur les éléments qui pulsent pour mener l\'enquête.', 5500), 1800);
  });

  window.addEventListener('resize', fit);
  fit();
  drawStrings();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawStrings);
})();
