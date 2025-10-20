// Mobile nav toggle, year injector, dynamic resume + timeline rendering
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('siteNav');
  const btn = document.getElementById('navToggle');

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    if (nav) {
      const isHidden = nav.style.display === 'none' || nav.getAttribute('aria-hidden') === 'true';
      nav.style.display = isHidden ? '' : 'none';
      nav.setAttribute('aria-hidden', String(!isHidden));
    }
  });

  // Insert current year
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if (el) el.textContent = String(y);

  // Load resume data
  fetch('resume.json')
    .then(resp => {
      if (!resp.ok) throw new Error('resume.json not found');
      return resp.json();
    })
    .then(data => renderAll(data))
    .catch(err => {
      console.warn('Could not load resume.json:', err);
    });

  function renderAll(data) {
    renderHeader(data);
    renderSkills(data.skills || []);
    renderProjects(data.projects || []);
    renderTimeline(data);
  }

  function renderHeader(data) {
    if (data.name) {
      document.querySelectorAll('.logo, #heroName, #footerName').forEach(el => el && (el.textContent = data.name));
    }
    if (data.title) {
      const el = document.getElementById('heroTitle');
      if (el) el.textContent = data.title;
    }
    if (data.summary) {
      document.getElementById('heroSummary').textContent = data.summary;
      document.getElementById('aboutText').textContent = data.summary;
    }
    if (data.contact) {
      if (data.contact.email) {
        document.querySelectorAll('#emailLink, #emailLink2').forEach(a => {
          a.href = 'mailto:' + data.contact.email;
          a.textContent = data.contact.email;
        });
      }
      if (data.contact.github) {
        document.querySelectorAll('#githubLink, #footerGithub').forEach(a => { a.href = data.contact.github; });
      }
      if (data.contact.location) {
        // optionally append location into hero contact inline
      }
    }
    if (data.download && data.download.pdf) {
      const dl = document.getElementById('downloadResume');
      if (dl) dl.href = data.download.pdf;
      const dl2 = document.getElementById('downloadResume');
      if (dl2) dl2.href = data.download.pdf;
    }
  }

  function renderSkills(skills) {
    const skillsList = document.getElementById('skillsList');
    if (!skillsList) return;
    skillsList.innerHTML = '';
    skills.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      skillsList.appendChild(li);
    });
  }

  function renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    projects.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card';
      const title = document.createElement('h3'); title.textContent = p.name || 'Project';
      const desc = document.createElement('p'); desc.textContent = p.description || '';
      const links = document.createElement('p'); links.className = 'card-links';
      if (p.live) {
        const a = document.createElement('a'); a.href = p.live; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Live'; links.appendChild(a);
      }
      if (p.code) {
        const a = document.createElement('a'); a.href = p.code; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Code'; links.appendChild(a);
      }
      card.appendChild(title); card.appendChild(desc); card.appendChild(links);
      grid.appendChild(card);
    });
  }

  // Combine education and experience into a chronological timeline from earliest to latest
  function renderTimeline(data) {
    const container = document.getElementById('timelineList');
    if (!container) return;
    const items = [];

    // education entries
    if (Array.isArray(data.education)) {
      data.education.forEach(ed => {
        items.push({
          type: 'education',
          title: ed.institution,
          role: ed.degree || '',
          start_iso: ed.start_iso || ed.start || '',
          end_iso: ed.end_iso || ed.end || '',
          location: ed.location || '',
          description: ed.notes || ''
        });
      });
    }

    // experience entries
    if (Array.isArray(data.experience)) {
      data.experience.forEach(ex => {
        items.push({
          type: 'experience',
          title: ex.company || '',
          role: ex.role || '',
          start_iso: ex.start_iso || isoFromText(ex.start),
          end_iso: ex.end_iso || (ex.end && ex.end.toLowerCase() === 'present' ? '9999-12' : isoFromText(ex.end)),
          location: ex.location || '',
          bullets: ex.bullets || [],
          description: ex.description || ''
        });
      });
    }

    // sort by start_iso ascending
    items.sort((a,b) => {
      if (!a.start_iso) return 1;
      if (!b.start_iso) return -1;
      return a.start_iso.localeCompare(b.start_iso);
    });

    container.innerHTML = '';
    items.forEach(it => {
      const row = document.createElement('div');
      row.className = 'timeline-item';

      const left = document.createElement('div');
      left.style.display = 'flex';
      left.style.alignItems = 'start';
      left.style.gap = '0.75rem';
      left.innerHTML = `<div class="timeline-dot" aria-hidden="true"></div>
                        <div class="timeline-meta">${formatRange(it.start_iso, it.end_iso)}</div>`;

      const right = document.createElement('div');
      const card = document.createElement('div');
      card.className = 'timeline-card';
      const h = document.createElement('h3');
      h.textContent = it.role ? `${it.role} — ${it.title}` : it.title;
      const meta = document.createElement('div');
      meta.className = 'timeline-meta';
      meta.textContent = it.location || '';

      card.appendChild(h);
      if (it.description) {
        const p = document.createElement('p'); p.textContent = it.description; card.appendChild(p);
      }
      if (Array.isArray(it.bullets) && it.bullets.length) {
        const ul = document.createElement('ul');
        it.bullets.forEach(b => {
          const li = document.createElement('li'); li.textContent = b; ul.appendChild(li);
        });
        card.appendChild(ul);
      }

      card.appendChild(meta);
      right.appendChild(card);

      row.appendChild(left);
      row.appendChild(right);

      container.appendChild(row);
    });
  }

  // Helper to format ISO-like YYYY-MM or fallback "YYYY"
  function formatRange(start_iso, end_iso) {
    if (!start_iso) return '';
    const s = humanDate(start_iso);
    const e = (end_iso === '9999-12' || !end_iso) ? 'Present' : humanDate(end_iso);
    return `${s} — ${e}`;
  }

  function humanDate(iso) {
    if (!iso) return '';
    const parts = iso.split('-');
    if (parts.length >= 2) {
      const month = Number(parts[1]);
      const year = parts[0];
      const mnames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return `${mnames[(month-1)]} ${year}`;
    }
    return iso;
  }

  // Try to extract a YYYY or YYYY-MM from loose text like "06/2014" or "June 2014" or "2014"
  function isoFromText(text) {
    if (!text) return '';
    // common patterns: MM/YYYY, M/YYYY, YYYY, Month YYYY
    const mmYYYY = text.match(/(\d{1,2})[\/\-](\d{4})/);
    if (mmYYYY) {
      const mm = mmYYYY[1].padStart(2,'0'), yy = mmYYYY[2];
      return `${yy}-${mm}`;
    }
    const monthYear = text.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i);
    if (monthYear) {
      const months = {jan:'01',feb:'02',mar:'03',apr:'04',may:'05',jun:'06',jul:'07',aug:'08',sep:'09',oct:'10',nov:'11',dec:'12'};
      const m = months[monthYear[1].slice(0,3).toLowerCase()] || '01';
      return `${monthYear[2]}-${m}`;
    }
    const yearOnly = text.match(/(19|20)\d{2}/);
    if (yearOnly) return `${yearOnly[0]}-01`;
    return '';
  }
});
