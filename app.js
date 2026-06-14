// ── CONSTANTS ──
const TOTAL = 150;
const API = 'https://pokeapi.co/api/v2/pokemon/';
const SPECIES_API = 'https://pokeapi.co/api/v2/pokemon-species/';
const TYPE_API = 'https://pokeapi.co/api/v2/type/';

// ── DOM REFERENCES ──
const grid         = document.getElementById('pokemonGrid');
const spinner      = document.getElementById('spinner');
const searchInput  = document.getElementById('searchInput');
const typeFilter   = document.getElementById('typeFilter');
const modal        = document.getElementById('modal');
const closeModal   = document.getElementById('closeModal');
const modalContent = document.getElementById('modalContent');

// ── STATE ──
let allPokemon = [];

// ── FETCH ALL POKEMON ──
async function fetchAll() {
  const promises = [];
  for (let i = 1; i <= TOTAL; i++) {
    promises.push(fetch(API + i).then(r => r.json()));
  }
  allPokemon = await Promise.all(promises);
  spinner.classList.add('hidden');
  populateTypeFilter();
  renderCards(allPokemon);
}

// ── POPULATE TYPE FILTER ──
function populateTypeFilter() {
  const types = new Set();
  allPokemon.forEach(p => p.types.forEach(t => types.add(t.type.name)));
  [...types].sort().forEach(type => {
    const opt = document.createElement('option');
    opt.value = type;
    opt.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    typeFilter.appendChild(opt);
  });
}

// ── RENDER CARDS ──
function renderCards(list) {
  grid.innerHTML = '';
  if (list.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);text-align:center;grid-column:1/-1">No Pokémon found.</p>';
    return;
  }
  list.forEach(p => {
    const types = p.types.map(t =>
      `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`
    ).join('');

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.sprites.other['official-artwork'].front_default || p.sprites.front_default}" alt="${p.name}" />
      <p class="pokedex-num">#${String(p.id).padStart(3,'0')}</p>
      <h3>${p.name}</h3>
      <div>${types}</div>
    `;
    card.addEventListener('click', () => openModal(p));
    grid.appendChild(card);
  });
}

// ── FILTER ──
function applyFilters() {
  const query = searchInput.value.toLowerCase().trim();
  const type  = typeFilter.value;
  const filtered = allPokemon.filter(p => {
    const matchName = p.name.includes(query);
    const matchType = type === 'all' || p.types.some(t => t.type.name === type);
    return matchName && matchType;
  });
  renderCards(filtered);
}

// ── IMAGE TO BASE64 ──
async function toBase64(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// ── FETCH DESCRIPTION ──
async function fetchDescription(id) {
  const res  = await fetch(SPECIES_API + id);
  const data = await res.json();
  const entry = data.flavor_text_entries.find(e => e.language.name === 'en');
  return entry ? entry.flavor_text.replace(/\f/g, ' ') : 'No description available.';
}

// ── FETCH WEAKNESSES ──
async function fetchWeaknesses(types) {
  const weakSet = new Set();
  for (const t of types) {
    const res  = await fetch(TYPE_API + t);
    const data = await res.json();
    data.damage_relations.double_damage_from.forEach(w => weakSet.add(w.name));
  }
  return [...weakSet];
}

// ── OPEN MODAL ──
async function openModal(p) {
  modal.classList.remove('hidden');
  modalContent.innerHTML = `<p style="text-align:center;color:var(--muted);padding:2rem">Loading...</p>`;

  const typeNames = p.types.map(t => t.type.name);
  const imgUrl = p.sprites.other['official-artwork'].front_default || p.sprites.front_default;
  const [description, weaknesses, imgBase64] = await Promise.all([
    fetchDescription(p.id),
    fetchWeaknesses(typeNames),
    toBase64(imgUrl)
  ]);

  const types = p.types.map(t =>
    `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`
  ).join('');

  const weakBadges = weaknesses.map(w =>
    `<span class="type-badge type-${w}">${w}</span>`
  ).join('');

  const stats = p.stats.map(s => {
    const pct = Math.min((s.base_stat / 255) * 100, 100).toFixed(1);
    return `
      <div class="stat-row">
        <span class="stat-label">${s.stat.name.replace('-',' ')}</span>
        <div class="stat-bar-bg">
          <div class="stat-bar" style="width:${pct}%"></div>
        </div>
        <span class="stat-value">${s.base_stat}</span>
      </div>`;
  }).join('');

  modalContent.innerHTML = `
    <div id="exportCard">
      <img src="${imgBase64}" alt="${p.name}" />
      <h2>#${String(p.id).padStart(3,'0')} — ${p.name}</h2>
      <div style="text-align:center;margin-bottom:0.75rem">${types}</div>
      <p class="pokedex-description">${description}</p>
      <div class="section-label">Weaknesses</div>
      <div style="text-align:center;margin-bottom:1rem">${weakBadges}</div>
      <div class="section-label">Stats</div>
      <div class="stats">${stats}</div>
    </div>
    <button id="downloadBtn" class="download-btn">Download Card</button>
  `;

  document.getElementById('downloadBtn').addEventListener('click', () => downloadCard(p.name));
}

// ── DOWNLOAD CARD ──
async function downloadCard(name) {
  const card = document.getElementById('exportCard');
  const canvas = await html2canvas(card, { backgroundColor: '#16213e', scale: 2 });
  const link = document.createElement('a');
  link.download = `${name}-pokedex.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ── CLOSE MODAL ──
function closeModalFn() {
  modal.classList.add('hidden');
}

// ── EVENTS ──
searchInput.addEventListener('input', applyFilters);
typeFilter.addEventListener('change', applyFilters);
closeModal.addEventListener('click', closeModalFn);
modal.addEventListener('click', e => {
  if (e.target === modal) closeModalFn();
});

// ── INIT ──
fetchAll();