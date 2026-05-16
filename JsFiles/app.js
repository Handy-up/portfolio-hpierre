/* ============================================================
   HANDY.DEV — Interactions & Animations v2
   ============================================================ */

/* ── Curseur editor focus ─────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Pas sur touch
  if (window.matchMedia('(hover: none)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let mx = -200, my = -200;
  let rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  const hoverEls = 'a, button, .skill-featured-card, .skill-chip, .project-card, .edu-card';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hover');
      dot.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hover');
      dot.classList.remove('hover');
    });
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'; ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1'; ring.style.opacity = '1';
  });
})();

/* ── Navbar ───────────────────────────────────────────────── */
(function initNavbar() {
  const nav     = document.querySelector('.navbar');
  const toggle  = document.getElementById('nav-toggle');
  const overlay = document.getElementById('mobile-nav-overlay');
  if (!nav) return;

  /* Scroll state */
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* Mobile toggle — contrôle l'overlay SÉPARÉ (hors nav)
     Le nav a backdrop-filter qui empêche les fixed enfants de couvrir l'écran */
  function openMenu() {
    if (!overlay || !toggle) return;
    overlay.classList.add('open');
    overlay.style.display = 'block';
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!overlay || !toggle) return;
    overlay.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    /* Petit délai avant display:none pour laisser la transition opacity */
    setTimeout(() => {
      if (!overlay.classList.contains('open')) overlay.style.display = '';
    }, 300);
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      overlay && overlay.classList.contains('open') ? closeMenu() : openMenu();
    });
  }

  /* Fermer au clic sur un lien mobile */
  if (overlay) {
    overlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });
    /* Fermer si on clique hors du menu (sur le fond) */
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeMenu();
    });
  }

  /* Fermer avec Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) closeMenu();
  });

  /* Active link on scroll */
  const allNavLinks = document.querySelectorAll('.nav-links-desktop a, .mobile-nav-links a');
  document.querySelectorAll('section[id], div[id]').forEach(s => {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          allNavLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + s.id));
        }
      });
    }, { threshold: 0.35 }).observe(s);
  });
})();

/* ── Scroll Reveal ────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ── Typewriter ───────────────────────────────────────────── */
const translations = {
  fr: {
    'nav.about': 'À propos',
    'nav.skills': 'Compétences',
    'nav.projects': 'Projets',
    'nav.education': 'Formations',
    'nav.contact': 'Contact',
    'hero.book': 'Réserver un Meet',
    'hero.greeting': 'Je suis,',
    'hero.desc': "Développeur full-stack passionné par la technologie, le multimédia et l'entrepreneuriat. Je conçois des produits solides, des interfaces soignées et des architectures pensées pour durer.",
    'hero.cv': 'Voir mon CV',
    'hero.github': 'Voir GitHub',
    'stats.projects': 'Projets réalisés',
    'stats.freelance': 'Dev freelance',
    'stats.study': "Ans d'études",
    'skills.label': 'Stack technique',
    'skills.title': 'Compétences',
    'skills.desc': "Mon stack principal tourne autour de l'écosystème JavaScript moderne — du web au mobile, avec des outils de production robustes.",
    'skills.certifications': 'Voir mes certifications',
    'projects.label': 'Travaux récents',
    'projects.title': 'Projets',
    'projects.desc': "Des projets concrets, construits pour résoudre de vrais problèmes. Chaque ligne de code pense à l'expérience utilisateur.",
    'projects.view': 'Voir le projet',
    'projects.demo': 'Voir la démo',
    'project.biblio.desc': "Plateforme de partage de livres entre usagers sur entente mutuelle. Panel admin complet avec statistiques et gestion des clés d'accès.",
    'project.editor.desc': 'Application desktop développée en Java avec interface Swing. Ouverture, édition, sauvegarde avec recherche et remplacement intégrés.',
    'project.pendu.desc': "Jeu du pendu classique en Kotlin avec minuteur intégré, niveaux de difficulté et design mobile-first pensé pour l'UX.",
    'education.label': 'Parcours académique',
    'education.title': 'Formations',
    'contact.label': 'Travaillons ensemble',
    'contact.desc': 'Un projet, une opportunité ? Je suis disponible. Réponse sous 24h.',
    'contact.name': 'Nom',
    'contact.subject': 'Sujet',
    'contact.submit': 'Envoyer le message',
    'footer.copy': '© 2025 Pierre Handy Charles — Tous droits réservés.'
  },
  en: {
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.education': 'Education',
    'nav.contact': 'Contact',
    'hero.book': 'Book a Meet',
    'hero.greeting': 'I am,',
    'hero.desc': 'Full-stack developer passionate about technology, multimedia, and entrepreneurship. I build solid products, polished interfaces, and architectures designed to last.',
    'hero.cv': 'View my resume',
    'hero.github': 'View GitHub',
    'stats.projects': 'Projects shipped',
    'stats.freelance': 'Freelance dev',
    'stats.study': 'Years studying',
    'skills.label': 'Technical stack',
    'skills.title': 'Skills',
    'skills.desc': 'My core stack is centered on the modern JavaScript ecosystem — from web to mobile, with robust production tooling.',
    'skills.certifications': 'View certifications',
    'projects.label': 'Recent work',
    'projects.title': 'Projects',
    'projects.desc': 'Concrete projects built to solve real problems. Every line of code is shaped around user experience.',
    'projects.view': 'View project',
    'projects.demo': 'View demo',
    'project.biblio.desc': 'Book-sharing platform for users based on mutual agreement. Complete admin panel with statistics and access key management.',
    'project.editor.desc': 'Desktop app built in Java with a Swing interface. Open, edit, save, search and replace in one workflow.',
    'project.pendu.desc': 'Classic hangman game in Kotlin with timer, difficulty levels, and a mobile-first UX.',
    'education.label': 'Academic path',
    'education.title': 'Education',
    'contact.label': "Let's work together",
    'contact.desc': 'A project or opportunity? I am available. Reply within 24 hours.',
    'contact.name': 'Name',
    'contact.subject': 'Subject',
    'contact.submit': 'Send message',
    'footer.copy': '© 2025 Pierre Handy Charles — All rights reserved.'
  }
};

const typedRoles = {
  fr: ['Développeur Full-Stack', 'React & Next.js Dev', 'Builder de produits', 'Dev Freelance', 'React Native Dev'],
  en: ['Full-Stack Developer', 'React & Next.js Dev', 'Product Builder', 'Freelance Dev', 'React Native Dev']
};

(function initLanguage() {
  const switchBtns = document.querySelectorAll('#lang-switch, #mobile-lang-switch');
  const savedLang = localStorage.getItem('site-lang');
  let lang = savedLang === 'en' ? 'en' : 'fr';

  function applyLanguage(nextLang) {
    lang = nextLang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = translations[lang][el.dataset.i18n];
      if (value) el.textContent = value;
    });
    switchBtns.forEach(btn => {
      btn.textContent = lang === 'fr' ? 'FR / EN' : 'EN / FR';
    });
    localStorage.setItem('site-lang', lang);
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
  }

  window.getCurrentLang = () => lang;
  window.getTypedRoles = () => typedRoles[lang] || typedRoles.fr;
  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(lang === 'fr' ? 'en' : 'fr'));
  });
  applyLanguage(lang);
})();

(function initMeetBooking() {
  const btn = document.getElementById('book-meet-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const bookingUrl = window.SCHEDULING_CONFIG && window.SCHEDULING_CONFIG.bookingUrl;
    if (bookingUrl && !bookingUrl.includes('xxxxxxxx')) {
      if (window.openPreviewModal) {
        window.openPreviewModal({
          title: 'Google Meet',
          pill: 'Calendar',
          url: bookingUrl,
          type: 'calendar'
        });
        return;
      }
      return;
    }
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  });
})();

(function initTyped() {
  const el = document.getElementById('typed-role');
  if (!el) return;
  let roles = window.getTypedRoles ? window.getTypedRoles() : typedRoles.fr;
  let ri = 0, ci = 0, del = false;
  let generation = 0;

  function type() {
    const currentGeneration = generation;
    const cur = roles[ri];
    if (!del) {
      el.textContent = cur.slice(0, ci + 1);
      ci++;
      if (ci === cur.length) { del = true; setTimeout(() => currentGeneration === generation && type(), 2200); return; }
      setTimeout(() => currentGeneration === generation && type(), 55);
    } else {
      el.textContent = cur.slice(0, ci - 1);
      ci--;
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; setTimeout(() => currentGeneration === generation && type(), 300); return; }
      setTimeout(() => currentGeneration === generation && type(), 30);
    }
  }
  window.addEventListener('languagechange', () => {
    roles = window.getTypedRoles ? window.getTypedRoles() : typedRoles.fr;
    ri = 0; ci = 0; del = false; generation++;
    el.textContent = '';
    setTimeout(type, 120);
  });
  setTimeout(type, 600);
})();

/* ── Compteurs ────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count, 10);
      const suf = el.dataset.suffix || '';
      const dur = 1100;
      let cur = 0;
      const timer = setInterval(() => {
        cur++;
        el.textContent = cur + suf;
        if (cur >= end) clearInterval(timer);
      }, dur / end);
      new IntersectionObserver(() => {}).observe(el); // stop re-triggering
    });
  }, { threshold: 0.6 }).observe ? null : counters.forEach(c => {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const end = parseInt(el.dataset.count, 10);
        const suf = el.dataset.suffix || '';
        let cur = 0;
        const timer = setInterval(() => {
          cur++;
          el.textContent = cur + suf;
          if (cur >= end) { clearInterval(timer); }
        }, 1100 / end);
      });
    }, { threshold: 0.6 }).observe(c);
  });

  // Simple fix: use per-counter observer
  counters.forEach(c => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        const el  = entry.target;
        const end = parseInt(el.dataset.count, 10);
        const suf = el.dataset.suffix || '';
        let cur = 0;
        const step = Math.max(1100 / end, 20);
        const timer = setInterval(() => {
          cur++;
          el.textContent = cur + suf;
          if (cur >= end) clearInterval(timer);
        }, step);
      });
    }, { threshold: 0.6 });
    obs.observe(c);
  });
})();

/* ── Parallax orbs ────────────────────────────────────────── */
(function initParallax() {
  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    orbs[0] && (orbs[0].style.transform = `translateY(${y * 0.1}px)`);
    orbs[1] && (orbs[1].style.transform = `translateY(${y * 0.06}px)`);
  }, { passive: true });
})();

/* ── Portfolio config (.env -> config.js) ─────────────────── */
function getPortfolioConfigValue(path) {
  return String(path || '').split('.').reduce((value, key) => {
    if (!value || typeof value !== 'object') return '';
    return value[key];
  }, window.PORTFOLIO_LINKS || '') || '';
}

(function initPortfolioConfigValues() {
  document.querySelectorAll('[data-config-src]').forEach(img => {
    const src = getPortfolioConfigValue(img.dataset.configSrc);
    if (src) img.src = src;
  });

  document.querySelectorAll('[data-preview-key]').forEach(el => {
    const url = getPortfolioConfigValue(el.dataset.previewKey);
    if (url) el.dataset.previewUrl = url;
  });

  if (window.projectData) {
    Object.values(window.projectData).forEach(project => {
      if (project.linkKey) project.github = getPortfolioConfigValue(project.linkKey);
    });
  }
})();

/* ── Project Modal ────────────────────────────────────────── */
(function initProjectModal() {
  const overlay   = document.getElementById('project-modal');
  if (!overlay) return;
  const titleEl   = overlay.querySelector('.modal-title');
  const carouselEl= overlay.querySelector('.modal-carousel');
  const ghLink    = overlay.querySelector('.modal-gh-link');
  const closeBtn  = overlay.querySelector('.modal-close');
  const prevBtn   = overlay.querySelector('.carousel-ctrl.prev');
  const nextBtn   = overlay.querySelector('.carousel-ctrl.next');
  const captionEl = overlay.querySelector('.carousel-caption-text');
  const dotsWrap  = overlay.querySelector('.carousel-dots');

  let slides = [], idx = 0;

  function renderSlide(i) {
    const s = slides[i];
    if (!s) return;
    carouselEl.innerHTML = '';
    const el = s.type === 'video' ? (() => {
      const v = document.createElement('video');
      v.controls = true; v.style.width = '100%';
      const src = document.createElement('source');
      src.src = s.src; src.type = 'video/mp4';
      v.appendChild(src); return v;
    })() : (() => {
      const img = document.createElement('img');
      img.src = s.src; img.alt = s.caption || ''; return img;
    })();
    carouselEl.appendChild(el);
    if (captionEl) captionEl.textContent = s.caption || '';
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, j) => d.classList.toggle('active', j === i));
  }

  function open(data) {
    slides = data.slides || []; idx = 0;
    titleEl.textContent = data.title || '';
    if (ghLink) { ghLink.href = data.github || getPortfolioConfigValue(data.linkKey) || '#'; }
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => { idx = i; renderSlide(i); });
      dotsWrap.appendChild(d);
    });
    renderSlide(0);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    const v = carouselEl.querySelector('video');
    if (v) v.pause();
  }

  closeBtn && closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  prevBtn && prevBtn.addEventListener('click', () => { idx = (idx - 1 + slides.length) % slides.length; renderSlide(idx); });
  nextBtn && nextBtn.addEventListener('click', () => { idx = (idx + 1) % slides.length; renderSlide(idx); });

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft')  { idx = (idx - 1 + slides.length) % slides.length; renderSlide(idx); }
    if (e.key === 'ArrowRight') { idx = (idx + 1) % slides.length; renderSlide(idx); }
  });

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = window.projectData && window.projectData[btn.dataset.modal];
      if (data) open(data);
    });
  });
})();

/* ── Preview Modal (CV, GitHub, URLs) ─────────────────────── */
(function initPreviewModal() {
  const overlay  = document.getElementById('preview-modal');
  const bodyEl   = document.getElementById('preview-modal-body');
  const titleEl  = document.getElementById('preview-modal-title');
  const openLink = document.getElementById('preview-open-link');
  const closeBtn = document.getElementById('preview-close');
  if (!overlay) return;

  function open(config) {
    // config: { title, pill, url, type: 'iframe'|'github'|'pdf' }
    overlay.classList.add('open');
    overlay.dataset.previewType = config.type || 'iframe';
    document.body.style.overflow = 'hidden';

    // Update header
    const pillHtml = config.pill ? `<span class="pill">${escapeHTML(config.pill)}</span>` : '';
    titleEl.innerHTML = escapeHTML(config.title) + ' ' + pillHtml;
    if (openLink) { openLink.href = config.url; }

    // Build body
    bodyEl.innerHTML = '';

    if (config.type === 'github') {
      buildGitHubPreview(config.url);
    } else if (config.type === 'calendar') {
      bodyEl.innerHTML = buildCalendarPreview(config.url);
    } else if (config.type === 'external') {
      bodyEl.innerHTML = buildExternalPreview(config.url, config.title);
      const readmeButton = bodyEl.querySelector('.external-readme-btn');
      if (readmeButton) loadExternalReadme(readmeButton);
      loadExternalArchitecture(config.url);
    } else {
      // iframe (PDF, website)
      const iframe = document.createElement('iframe');
      iframe.src = config.type === 'pdf' && !String(config.url).includes('#')
        ? `${config.url}#zoom=page-width`
        : config.url;
      iframe.title = config.title;
      iframe.loading = 'lazy';
      iframe.allow = 'fullscreen';
      iframe.addEventListener('error', () => {
        // Fallback if blocked
        bodyEl.innerHTML = buildBlockedFallback(config.url, config.title);
      });
      bodyEl.appendChild(iframe);
    }
  }
  window.openPreviewModal = open;

  function close() {
    overlay.classList.remove('open');
    delete overlay.dataset.previewType;
    document.body.style.overflow = '';
    bodyEl.innerHTML = '';
  }

  closeBtn && closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  bodyEl.addEventListener('click', e => {
    const readmeButton = e.target.closest('.external-readme-btn');
    if (readmeButton) loadExternalReadme(readmeButton);
  });
  bodyEl.addEventListener('change', e => {
    const branchSelect = e.target.closest('.repo-branch-select');
    if (branchSelect) loadGitHubBranchContent(branchSelect);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function formatNumber(value) {
    return typeof value === 'number' ? value.toLocaleString('fr-CA') : '0';
  }

  function decodeBase64(content) {
    const binary = atob(String(content || '').replace(/\n/g, ''));
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  }

  function renderMarkdown(markdown) {
    const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n');
    const html = [];
    let paragraph = [];
    let listItems = [];
    let codeLines = [];
    let inCode = false;

    function flushParagraph() {
      if (!paragraph.length) return;
      html.push(`<p>${renderInlineMarkdown(paragraph.join(' '))}</p>`);
      paragraph = [];
    }

    function flushList() {
      if (!listItems.length) return;
      html.push(`<ul>${listItems.map(item => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</ul>`);
      listItems = [];
    }

    lines.forEach(line => {
      if (line.trim().startsWith('```')) {
        if (inCode) {
          html.push(`<pre><code>${escapeHTML(codeLines.join('\n'))}</code></pre>`);
          codeLines = [];
          inCode = false;
        } else {
          flushParagraph();
          flushList();
          inCode = true;
        }
        return;
      }

      if (inCode) {
        codeLines.push(line);
        return;
      }

      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      const list = line.match(/^\s*[-*]\s+(.+)$/);

      if (!line.trim()) {
        flushParagraph();
        flushList();
      } else if (heading) {
        flushParagraph();
        flushList();
        const level = heading[1].length + 2;
        html.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      } else if (list) {
        flushParagraph();
        listItems.push(list[1]);
      } else {
        flushList();
        paragraph.push(line.trim());
      }
    });

    if (inCode) html.push(`<pre><code>${escapeHTML(codeLines.join('\n'))}</code></pre>`);
    flushParagraph();
    flushList();

    return html.join('');
  }

  function renderInlineMarkdown(value) {
    return escapeHTML(value)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  function renderBranchOptions(branches, selectedBranch) {
    if (!Array.isArray(branches) || !branches.length) {
      return '';
    }

    return branches.map(branch => `
      <option value="${escapeHTML(branch.name)}"${branch.name === selectedBranch ? ' selected' : ''}>
        ${escapeHTML(branch.name)}
      </option>
    `).join('');
  }

  function renderBranchChips(branches, defaultBranch) {
    if (!Array.isArray(branches) || !branches.length) {
      return '<div class="repo-empty-line">Branches non disponibles.</div>';
    }

    return branches.slice(0, 8).map(branch => `
      <span class="repo-branch-chip${branch.name === defaultBranch ? ' is-default' : ''}">
        ${escapeHTML(branch.name)}${branch.name === defaultBranch ? ' · default' : ''}
      </span>
    `).join('');
  }

  function renderTree(tree) {
    const entries = Array.isArray(tree?.tree) ? tree.tree : [];
    if (!entries.length) {
      return '<div class="repo-empty-line">Arborescence non disponible.</div>';
    }

    const sortedEntries = entries
      .filter(item => item.path)
      .sort((a, b) => {
        const folderCompare = Number(a.type !== 'tree') - Number(b.type !== 'tree');
        return folderCompare || a.path.localeCompare(b.path);
      });

    return sortedEntries.map(item => {
      const parts = item.path.split('/');
      const name = parts[parts.length - 1];
      const depth = parts.length - 1;
      const isFolder = item.type === 'tree';
      return `
        <div class="repo-tree-row${isFolder ? '' : ' is-file'}" style="--depth:${depth}" title="${escapeHTML(item.path)}">
          <span class="repo-tree-icon">${isFolder ? '▸' : '·'}</span>
          <span class="repo-tree-name">${escapeHTML(name)}</span>
        </div>`;
    }).join('');
  }

  function parseGitHubUrl(url) {
    try {
      const parsed = new URL(url);
      if (parsed.hostname !== 'github.com') return null;
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (!parts[0]) return null;
      return { owner: parts[0], repo: parts[1] || null };
    } catch {
      return null;
    }
  }

  function githubIcon() {
    return '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>';
  }

  // GitHub profile or repository card via API
  function buildGitHubPreview(githubUrl) {
    const target = parseGitHubUrl(githubUrl);
    if (!target) {
      bodyEl.innerHTML = buildExternalPreview(githubUrl, 'GitHub');
      return;
    }
    target.repo
      ? buildGitHubRepoCard(githubUrl, target.owner, target.repo)
      : buildGitHubProfileCard(githubUrl, target.owner);
  }

  function buildGitHubProfileCard(profileUrl, username) {
    bodyEl.innerHTML = `
      <div class="gh-profile-card">
        <div class="gh-loading">
          <div class="gh-spinner"></div>
          <span>Chargement du profil GitHub...</span>
        </div>
      </div>`;

    Promise.all([
      fetch(`https://api.github.com/users/${username}`).then(r => {
        if (!r.ok) throw new Error('GitHub profile unavailable');
        return r.json();
      }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`).then(r => r.ok ? r.json() : [])
    ]).then(([user, repos]) => {
      const langColors = { JavaScript:'#F7DF1E', TypeScript:'#3178C6', Python:'#3572A5', Java:'#b07219', Kotlin:'#A97BFF', PHP:'#4F5D95', CSS:'#563d7c', HTML:'#e34c26', Shell:'#89e051' };

      const reposHtml = Array.isArray(repos) ? repos.slice(0, 6).map(r => `
        <div class="gh-repo-card">
          <div class="gh-repo-name">${escapeHTML(r.name)}</div>
          <div class="gh-repo-desc">${escapeHTML(r.description || 'Pas de description')}</div>
          ${r.language ? `<div class="gh-repo-lang" style="--lang-color:${langColors[r.language] || '#94a3b8'}">${escapeHTML(r.language)}</div>` : ''}
        </div>`).join('') : '';

      bodyEl.querySelector('.gh-profile-card').innerHTML = `
        <img class="gh-avatar" src="${escapeHTML(user.avatar_url)}" alt="${escapeHTML(user.login)}">
        <div class="gh-name">${escapeHTML(user.name || user.login)}</div>
        ${user.bio ? `<div class="gh-bio">${escapeHTML(user.bio)}</div>` : ''}
        <div class="gh-stats">
          <div>
            <div class="gh-stat-val">${formatNumber(user.public_repos)}</div>
            <div class="gh-stat-lbl">Repositories</div>
          </div>
          <div>
            <div class="gh-stat-val">${formatNumber(user.followers)}</div>
            <div class="gh-stat-lbl">Followers</div>
          </div>
          <div>
            <div class="gh-stat-val">${formatNumber(user.following)}</div>
            <div class="gh-stat-lbl">Following</div>
          </div>
        </div>
        ${reposHtml ? `<div class="gh-repos-grid">${reposHtml}</div>` : ''}
        <a href="${escapeHTML(profileUrl)}" class="btn-primary gh-open-btn" target="_blank" rel="noopener">
          ${githubIcon()}
          Voir le profil complet
        </a>`;
    }).catch(() => {
      bodyEl.innerHTML = buildBlockedFallback(profileUrl, 'GitHub');
    });
  }

  function buildGitHubRepoCard(repoUrl, owner, repoName) {
    bodyEl.innerHTML = `
      <div class="gh-profile-card">
        <div class="gh-loading">
          <div class="gh-spinner"></div>
          <span>Chargement du dépôt GitHub...</span>
        </div>
      </div>`;

    Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repoName}`).then(r => {
        if (!r.ok) throw new Error('GitHub repo unavailable');
        return r.json();
      }),
      fetch(`https://api.github.com/repos/${owner}/${repoName}/languages`).then(r => r.ok ? r.json() : {}),
      fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`).then(r => r.ok ? r.json() : null),
      fetch(`https://api.github.com/repos/${owner}/${repoName}/branches?per_page=20`).then(r => r.ok ? r.json() : [])
    ]).then(async ([repo, languages, readme, branches]) => {
      const tree = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/trees/${repo.default_branch}?recursive=1`).then(r => r.ok ? r.json() : null);
      const langColors = { JavaScript:'#F7DF1E', TypeScript:'#3178C6', Python:'#3572A5', Java:'#b07219', Kotlin:'#A97BFF', PHP:'#4F5D95', CSS:'#563d7c', HTML:'#e34c26', Shell:'#89e051' };
      const languageNames = Object.keys(languages || {});
      const languageHtml = languageNames.length ? languageNames.slice(0, 5).map(lang => `
        <span class="gh-repo-lang-chip" style="--lang-color:${langColors[lang] || '#94a3b8'}">${escapeHTML(lang)}</span>
      `).join('') : '<span class="gh-repo-lang-chip">Code</span>';
      const readmeHtml = readme?.content
        ? renderMarkdown(decodeBase64(readme.content))
        : '<p>README non disponible pour ce dépôt.</p>';
      const branchOptionsHtml = renderBranchOptions(branches, repo.default_branch);
      const treeHtml = renderTree(tree);

      bodyEl.querySelector('.gh-profile-card').innerHTML = `
        <div class="repo-browser-shell">
          <header class="repo-browser-header">
            <div class="gh-repo-hero">
              <div class="gh-repo-mark">${githubIcon()}</div>
              <div>
                <div class="gh-repo-owner">${escapeHTML(repo.owner?.login || owner)}</div>
                <div class="gh-name">${escapeHTML(repo.name || repoName)}</div>
              </div>
            </div>
            <label class="repo-branch-control">
              <span>Branche</span>
              <select class="repo-branch-select" data-owner="${escapeHTML(owner)}" data-repo="${escapeHTML(repoName)}">
                ${branchOptionsHtml}
              </select>
            </label>
          </header>
          <div class="gh-bio">${escapeHTML(repo.description || 'Dépôt de projet')}</div>
          <div class="gh-stats">
            <div>
              <div class="gh-stat-val">${formatNumber(repo.stargazers_count)}</div>
              <div class="gh-stat-lbl">Stars</div>
            </div>
            <div>
              <div class="gh-stat-val">${formatNumber(repo.forks_count)}</div>
              <div class="gh-stat-lbl">Forks</div>
            </div>
            <div>
              <div class="gh-stat-val">${escapeHTML(repo.language || 'Code')}</div>
              <div class="gh-stat-lbl">Principal</div>
            </div>
          </div>
          <div class="gh-repo-languages">${languageHtml}</div>
          <section class="repo-browser">
            <aside class="repo-browser-sidebar">
              <div class="repo-browser-panel-title">Fichiers</div>
              <div class="repo-tree">${treeHtml}</div>
            </aside>
            <main class="repo-browser-main">
              <article class="repo-readme">
                <div class="repo-readme-title">README</div>
                <div class="repo-readme-content">${readmeHtml}</div>
              </article>
            </main>
          </section>
          <a href="${escapeHTML(repo.html_url || repoUrl)}" class="btn-primary gh-open-btn" target="_blank" rel="noopener">
            ${githubIcon()}
            Voir le dépôt
          </a>
        </div>
      `;
    }).catch(() => {
      bodyEl.innerHTML = buildExternalPreview(repoUrl, `${owner}/${repoName}`);
    });
  }

  async function loadGitHubBranchContent(select) {
    const owner = select.dataset.owner;
    const repoName = select.dataset.repo;
    const branch = select.value;
    const shell = select.closest('.repo-browser-shell');
    const treeTarget = shell?.querySelector('.repo-tree');
    const readmeTarget = shell?.querySelector('.repo-readme-content');

    if (!owner || !repoName || !branch || !treeTarget || !readmeTarget) return;

    select.disabled = true;
    treeTarget.innerHTML = '<div class="repo-empty-line">Chargement de l’arborescence...</div>';
    readmeTarget.innerHTML = '<p>Chargement du README...</p>';

    try {
      const [tree, readme] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repoName}/git/trees/${encodeURIComponent(branch)}?recursive=1`).then(r => r.ok ? r.json() : null),
        fetch(`https://api.github.com/repos/${owner}/${repoName}/readme?ref=${encodeURIComponent(branch)}`).then(r => r.ok ? r.json() : null)
      ]);

      treeTarget.innerHTML = renderTree(tree);
      readmeTarget.innerHTML = readme?.content
        ? renderMarkdown(decodeBase64(readme.content))
        : '<p>README non disponible sur cette branche.</p>';
    } catch {
      treeTarget.innerHTML = '<div class="repo-empty-line">Impossible de charger cette branche.</div>';
      readmeTarget.innerHTML = '<p>README non disponible sur cette branche.</p>';
    } finally {
      select.disabled = false;
    }
  }

  function buildBlockedFallback(url, name) {
    return `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:1.5rem;padding:2rem;text-align:center;">
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        <div style="font-size:1rem;color:var(--text-secondary);max-width:340px;line-height:1.7;">
          Ce site bloque l'aperçu intégré. Cliquez sur <strong style="color:var(--text-primary)">Ouvrir ↗</strong> pour le voir dans un nouvel onglet.
        </div>
        <a href="${escapeHTML(url)}" target="_blank" rel="noopener" class="btn-primary">Ouvrir ${escapeHTML(name)} ↗</a>
      </div>`;
  }

  function buildExternalPreview(url, name) {
    let host = '';
    try {
      host = new URL(url).hostname;
    } catch {
      host = 'Lien externe';
    }

    const readmeCandidates = getExternalReadmeCandidates(url);
    const readmeButton = readmeCandidates.length
      ? `<button class="btn-secondary external-readme-btn" type="button" data-readme-url="${escapeHTML(readmeCandidates[0])}">Afficher le README</button>`
      : '';

    return `
      <div class="external-preview-card">
        <div class="external-preview-icon">↗</div>
        <div class="gh-name">${escapeHTML(name || host)}</div>
        <div class="gh-bio">
          L'aperçu intégré peut être bloqué par ce serveur. Le lien est prêt à être ouvert dans un nouvel onglet.
        </div>
        <div class="external-preview-url">${escapeHTML(host)}</div>
        <div class="external-architecture-target"></div>
        <div class="external-readme-target"></div>
        ${readmeButton}
        <a href="${escapeHTML(url)}" target="_blank" rel="noopener" class="btn-primary gh-open-btn">Ouvrir le lien ↗</a>
      </div>`;
  }

  function buildCalendarPreview(url) {
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'fr';
    const copy = lang === 'en'
      ? {
          title: 'Book a Google Meet',
          body: 'Choose a time that works for a project, product, or business conversation.',
          action: 'Open booking page ↗',
          note: 'The meeting will be created from Google Calendar.',
          availabilityTitle: 'Usual availability'
        }
      : {
          title: 'Réserver un Google Meet',
          body: 'Choisis un créneau pour discuter projet, produit ou business.',
          action: 'Ouvrir la réservation ↗',
          note: 'Le rendez-vous sera créé depuis Google Calendar.',
          availabilityTitle: 'Disponibilités habituelles'
        };
    const scheduling = window.SCHEDULING_CONFIG || {};
    const availability = lang === 'en'
      ? scheduling.availabilityEn
      : scheduling.availabilityFr;
    const availabilityParts = String(availability || '').split('|').filter(Boolean);
    const availabilityHeadline = availabilityParts[0] || copy.availabilityTitle;
    const availabilitySlots = availabilityParts.slice(1);

    return `
      <div class="calendar-preview-card">
        <div class="calendar-preview-icon">
          <span></span><span></span><span></span><span></span>
        </div>
        <div class="gh-name">${copy.title}</div>
        <div class="gh-bio">${copy.body}</div>
        ${availability ? `
          <div class="calendar-availability">
            <div class="calendar-availability-label">${copy.availabilityTitle}</div>
            <div class="calendar-availability-value">${escapeHTML(availabilityHeadline)}</div>
            <div class="calendar-slots">
              ${availabilitySlots.map(slot => `
                <div class="calendar-slot">
                  <span class="calendar-slot-dot"></span>
                  <span>${escapeHTML(slot)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        <div class="calendar-preview-note">${copy.note}</div>
        <a href="${escapeHTML(url)}" target="_blank" rel="noopener" class="btn-primary gh-open-btn">${copy.action}</a>
      </div>`;
  }

  function getExternalReadmeCandidates(url) {
    try {
      const parsed = new URL(url);
      const gitlabHost = getPortfolioConfigValue('externalHosts.gitlab');
      if (!gitlabHost || !parsed.hostname.includes(gitlabHost)) return [];
      const path = parsed.pathname.replace(/\/$/, '');
      return [
        `${parsed.origin}${path}/-/raw/main/README.md`,
        `${parsed.origin}${path}/-/raw/master/README.md`
      ];
    } catch {
      return [];
    }
  }

  function getGitLabProjectApi(url) {
    try {
      const parsed = new URL(url);
      const gitlabHost = getPortfolioConfigValue('externalHosts.gitlab');
      if (!gitlabHost || !parsed.hostname.includes(gitlabHost)) return null;
      const projectPath = parsed.pathname.replace(/^\/|\/$/g, '');
      return `${parsed.origin}/api/v4/projects/${encodeURIComponent(projectPath)}`;
    } catch {
      return null;
    }
  }

  async function loadExternalReadme(button) {
    const target = button.closest('.external-preview-card')?.querySelector('.external-readme-target');
    const candidates = getExternalReadmeCandidates(openLink.href);
    if (!target || !candidates.length) return;

    button.disabled = true;
    button.textContent = 'Chargement du README...';

    for (const candidate of candidates) {
      try {
        const response = await fetch(candidate);
        if (!response.ok) continue;
        const markdown = await response.text();
        target.innerHTML = `
          <article class="repo-readme">
            <div class="repo-readme-title">README</div>
            <div class="repo-readme-content">${renderMarkdown(markdown)}</div>
          </article>`;
        button.remove();
        return;
      } catch {
        // Try the next common branch name.
      }
    }

    target.innerHTML = `
      <div class="readme-empty">
        Impossible de charger le README automatiquement. Ouvre le dépôt pour le consulter.
      </div>`;
    button.remove();
  }

  async function loadExternalArchitecture(url) {
    const apiBase = getGitLabProjectApi(url);
    const target = bodyEl.querySelector('.external-architecture-target');
    if (!apiBase || !target) return;

    try {
      const [branchesResponse, treeResponse] = await Promise.all([
        fetch(`${apiBase}/repository/branches?per_page=20`),
        fetch(`${apiBase}/repository/tree?recursive=true&per_page=100`)
      ]);

      if (!branchesResponse.ok || !treeResponse.ok) throw new Error('GitLab API unavailable');

      const branches = await branchesResponse.json();
      const gitlabTree = await treeResponse.json();
      const tree = {
        tree: Array.isArray(gitlabTree)
          ? gitlabTree.map(item => ({ path: item.path, type: item.type === 'tree' ? 'tree' : 'blob' }))
          : []
      };

      target.innerHTML = `
        <section class="repo-meta-grid">
          <article class="repo-info-panel">
            <div class="repo-panel-title">Branches</div>
            <div class="repo-branches">${renderBranchChips(branches, branches.find(branch => branch.default)?.name)}</div>
          </article>
          <article class="repo-info-panel">
            <div class="repo-panel-title">Architecture</div>
            <div class="repo-tree">${renderTree(tree)}</div>
          </article>
        </section>`;
    } catch {
      target.innerHTML = `
        <div class="readme-empty">
          Branches et architecture non accessibles automatiquement pour ce dépôt.
        </div>`;
    }
  }

  // ── Boutons d'ouverture ──────────────────────────────────
  // CV
  const cvBtn = document.getElementById('open-cv-btn');
  if (cvBtn) {
    cvBtn.addEventListener('click', () => open({
      title: 'CV — Pierre Handy Charles',
      pill: 'PDF',
      url: 'documments/Charles_cv.pdf',
      type: 'pdf'
    }));
  }

  // Certifications
  const certBtn = document.getElementById('open-cert-btn');
  if (certBtn) {
    certBtn.addEventListener('click', () => open({
      title: 'Certifications Udemy',
      pill: 'PDF',
      url: 'documments/udemy_certificats.pdf',
      type: 'pdf'
    }));
  }

  // GitHub (hero button + icône contact)
  function openGitHub() {
    open({
      title: 'GitHub',
      pill: 'Profil',
      url: getPortfolioConfigValue('githubProfile'),
      type: 'github'
    });
  }
  document.getElementById('open-gh-btn') && document.getElementById('open-gh-btn').addEventListener('click', openGitHub);

  // Liens de dépôt sur les projets
  document.querySelectorAll('[data-preview-url], [data-preview-key]').forEach(btn => {
    btn.addEventListener('click', () => {
      const url  = btn.dataset.previewUrl || getPortfolioConfigValue(btn.dataset.previewKey);
      const name = btn.dataset.previewTitle || btn.textContent.trim();
      const isGH = url.includes('github.com');
      const isSocial = /linkedin\.com|instagram\.com|tiktok\.com/.test(url);
      open({
        title: name || url,
        pill: isGH ? 'GitHub' : (isSocial ? 'Réseau' : 'Dépôt'),
        url,
        type: isGH ? 'github' : 'external'
      });
    });
  });
})();

/* ── Contact form — EmailJS ───────────────────────────────── */
(function initContact() {

  /* ─── ⚙️  Lecture de config.js (équivalent .env côté browser) ── */
  const cfg = window.EMAILJS_CONFIG || {};
  const EMAILJS_SERVICE_ID  = cfg.serviceId  || '';
  const EMAILJS_TEMPLATE_ID = cfg.templateId || '';
  const EMAILJS_PUBLIC_KEY  = cfg.publicKey  || '';

  function showAlert(type, title, message) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title,
        text: message,
        icon: type,
        confirmButtonText: type === 'success' ? 'Parfait' : 'Compris',
        customClass: {
          popup: 'swal-site-popup',
          title: 'swal-site-title',
          htmlContainer: 'swal-site-text',
          confirmButton: 'swal-site-confirm'
        },
        buttonsStyling: false,
        background: '#111827',
        color: '#f1f5f9'
      });
      return;
    }

    alert(`${title}\n${message}`);
  }

  /* Init EmailJS */
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    /* Validation rapide */
    const nom     = form.querySelector('#nom').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!nom || !email || !message) {
      showAlert('error', 'Champs manquants', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAlert('error', 'Email invalide', 'Veuillez entrer une adresse email valide.');
      return;
    }

    /* État chargement */
    const btn = form.querySelector('.btn-submit');
    btn.disabled = true;
    btn.classList.add('sending');
    btn.textContent = 'Envoi en cours…';

    try {
      if (typeof emailjs === 'undefined') throw new Error('EmailJS non chargé');

      const timeInput = form.querySelector('#contact-time');
      if (timeInput) {
        timeInput.value = new Date().toLocaleString('fr-CA', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });
      }

      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);

      showAlert('success', 'Message envoyé', 'Merci pour ton message. Je te réponds dans les 24h.');
      form.reset();
    } catch (err) {
      console.error('[EmailJS]', err);
      showAlert('error', 'Envoi impossible', 'Réessaie dans un instant ou contacte-moi directement par email.');
    } finally {
      btn.disabled = false;
      btn.classList.remove('sending');
      btn.textContent = translations[window.getCurrentLang?.() || 'fr']['contact.submit'];
    }
  });
})();
