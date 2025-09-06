
(function(){
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  if(navToggle && primaryNav){
    navToggle.addEventListener('click', ()=>{
      const open = primaryNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if(saved === 'dark'){ root.classList.add('dark'); }
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      root.classList.toggle('dark');
      localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
    });
  }
  const y = document.getElementById('year');
  if(y){ y.textContent = new Date().getFullYear(); }

  // People
  const peopleGrid = document.getElementById('peopleGrid');
  if(peopleGrid){
    fetch('assets/people.json').then(r=>r.json()).then(people=>{
      peopleGrid.innerHTML = people.map(p => `
        <article class="person-card">
          <img src="${p.photo || 'assets/placeholder-portrait.jpg'}" alt="${p.name} portrait">
          <h3>${p.name}</h3>
          <p class="muted">${p.role || ''}</p>
          ${p.email ? `<p><a href="mailto:${p.email}">${p.email}</a></p>`: ''}
        </article>
      `).join('');
    }).catch(()=>{
      peopleGrid.innerHTML = '<p class="muted">Could not load people.json</p>';
    });
  }

  // Publications
  const pubList = document.getElementById('pubList');
  const pubSearch = document.getElementById('pubSearch');
  const pubYearFilter = document.getElementById('pubYearFilter');
  let pubs = [];
  function renderPubs(){
    const q = (pubSearch && pubSearch.value || '').toLowerCase();
    const year = (pubYearFilter && pubYearFilter.value) || 'all';
    const filtered = pubs.filter(p => {
      const inQ = `${p.title} ${p.authors} ${p.journal} ${p.year}`.toLowerCase().includes(q);
      const inYear = (year === 'all' || String(p.year) === year);
      return inQ && inYear;
    }).sort((a,b)=> (b.year||0) - (a.year||0));
    if(pubList){
      pubList.innerHTML = filtered.map(p => {
        const doiLink = p.doi ? `<a href="https://doi.org/${p.doi}" target="_blank" rel="noopener">DOI</a>` : '';
        const urlLink = p.url ? `<a href="${p.url}" target="_blank" rel="noopener">Link</a>` : '';
        const links = [doiLink, urlLink].filter(Boolean).join(' • ');
        return `<li>
          <div><strong>${p.title}</strong></div>
          <div class="pub-meta">${p.authors || ''} — <em>${p.journal || ''}</em> ${p.year ? `(${p.year})` : ''}</div>
          ${links ? `<div>${links}</div>` : ''}
        </li>`;
      }).join('');
    }
  }
  if(pubList){
    fetch('assets/publications.json').then(r=>r.json()).then(data=>{
      pubs = Array.isArray(data) ? data : [];
      const years = Array.from(new Set(pubs.map(p=>p.year).filter(Boolean))).sort((a,b)=>b-a);
      if(pubYearFilter){
        pubYearFilter.innerHTML = '<option value="all">All years</option>' + years.map(y=>`<option>${y}</option>`).join('');
      }
      renderPubs();
    });
    if(pubSearch){ pubSearch.addEventListener('input', renderPubs); }
    if(pubYearFilter){ pubYearFilter.addEventListener('change', renderPubs); }
  }

  // News
  const newsFeed = document.getElementById('newsFeed');
  if(newsFeed){
    fetch('assets/news.json').then(r=>r.json()).then(items=>{
      newsFeed.innerHTML = items.map(n => `
        <article class="news-item">
          <h3>${n.title}</h3>
          <p class="muted">${n.date || ''}</p>
          <p>${n.body || ''}</p>
          ${n.link ? `<p><a href="${n.link}" target="_blank" rel="noopener">Read more</a></p>` : ''}
        </article>
      `).join('');
    }).catch(()=>{
      newsFeed.innerHTML = '<p class="muted">Could not load news.json</p>';
    });
  }
})();
