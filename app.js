const API_KEY = '531776a08669e9a5a01eb71e783c7d3e';

/* ── State ── */
let unit        = 'metric';       // 'metric' (°C) | 'imperial' (°F)
let lastData    = null;           // last fetched weather payload
let searchHistory = JSON.parse(localStorage.getItem('wv_history') || '[]');
let manageMode  = false;          // true when manage/edit mode is active
let pendingDeleteCity = null;     // city queued for single-delete modal

/* ════════════════════════════════════
   DARK / LIGHT MODE TOGGLE
   ════════════════════════════════════ */
let isLightMode = localStorage.getItem('wv_theme') === 'light';

function applyThemeMode() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');

  if (isLightMode) {
    document.body.classList.add('light-mode');
    icon.textContent      = '☀️';               // Sun = currently light, click for dark
    icon.style.transform  = 'rotate(0deg) scale(1)';
    btn.setAttribute('data-tooltip', 'Dark Mode');
    btn.setAttribute('title', 'Switch to Dark Mode');
  } else {
    document.body.classList.remove('light-mode');
    icon.textContent      = '🌙';               // Moon = currently dark, click for light
    icon.style.transform  = 'rotate(-20deg) scale(1)';
    btn.setAttribute('data-tooltip', 'Light Mode');
    btn.setAttribute('title', 'Switch to Light Mode');
  }
}

function toggleThemeMode() {
  const icon = document.getElementById('themeIcon');

  // Animate icon out → change → animate in
  icon.style.transform = 'rotate(180deg) scale(0)';
  icon.style.opacity   = '0';

  setTimeout(() => {
    isLightMode = !isLightMode;
    localStorage.setItem('wv_theme', isLightMode ? 'light' : 'dark');
    applyThemeMode();
    icon.style.opacity   = '1';
  }, 220);
}


(function spawnParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 8 + 4;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      background: rgba(100,255,218,0.3);
      animation-duration: ${Math.random() * 20 + 15}s;
      animation-delay: ${Math.random() * 15}s;
    `;
    container.appendChild(p);
  }
})();

/* ════════════════════════════════════
   WEATHER ICON MAP
   ════════════════════════════════════ */
const iconMap = {
  '01': '☀️', '02': '⛅', '03': '☁️', '04': '☁️',
  '09': '🌧️', '10': '🌦️', '11': '⛈️', '13': '❄️', '50': '🌫️'
};
function getIcon(code) {
  return iconMap[code.slice(0, 2)] || '🌡️';
}

/* ════════════════════════════════════
   BACKGROUND THEME
   ════════════════════════════════════ */
function setTheme(mainCondition) {
  const cls = 'weather-' + mainCondition.toLowerCase();
  document.body.className = cls;
  const particleColorMap = {
    'weather-rain':         'rgba(100,149,237,0.4)',
    'weather-drizzle':      'rgba(100,149,237,0.4)',
    'weather-snow':         'rgba(200,220,255,0.6)',
    'weather-thunderstorm': 'rgba(180,50,255,0.4)',
    'weather-clear':        'rgba(255,200,50,0.3)',
    'weather-mist':         'rgba(150,180,200,0.3)',
  };
  const color = particleColorMap[cls] || 'rgba(100,255,218,0.3)';
  document.querySelectorAll('.particle').forEach(p => p.style.background = color);
}

/* ════════════════════════════════════
   UTILITY HELPERS
   ════════════════════════════════════ */
function showError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => (el.style.display = 'none'), 4500);
}

function showLoader(v) {
  document.getElementById('loader').style.display = v ? 'block' : 'none';
}

function showWeather(v) {
  document.getElementById('weatherMain').style.display = v ? 'block' : 'none';
}

function formatTime(unixUTC, tzOffset) {
  const d = new Date((unixUTC + tzOffset) * 1000);
  const h = d.getUTCHours().toString().padStart(2, '0');
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

/* ════════════════════════════════════
   RENDER — CURRENT WEATHER
   ════════════════════════════════════ */
function renderCurrent(d) {
  const isCelsius = unit === 'metric';
  const unitLabel = isCelsius ? '°C' : '°F';

  document.getElementById('cityName').textContent    = d.name;
  document.getElementById('cityCountry').textContent = d.sys.country;
  document.getElementById('weatherDate').innerHTML   =
    new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
    + '<br>' + new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });

  document.getElementById('weatherIcon').textContent = getIcon(d.weather[0].icon);
  document.getElementById('tempMain').textContent    = Math.round(d.main.temp) + unitLabel;
  document.getElementById('weatherDesc').textContent = d.weather[0].description;
  document.getElementById('tempFeel').textContent    = 'Feels like ' + Math.round(d.main.feels_like) + unitLabel;

  document.getElementById('humidity').textContent    = d.main.humidity + '%';
  const windVal = isCelsius
    ? Math.round(d.wind.speed * 3.6) + ' km/h'
    : Math.round(d.wind.speed) + ' mph';
  document.getElementById('windSpeed').textContent   = windVal;
  document.getElementById('pressure').textContent    = d.main.pressure + ' hPa';
  document.getElementById('visibility').textContent  = d.visibility
    ? (d.visibility / 1000).toFixed(1) + ' km' : 'N/A';
  document.getElementById('sunrise').textContent     = formatTime(d.sys.sunrise, d.timezone);
  document.getElementById('sunset').textContent      = formatTime(d.sys.sunset,  d.timezone);

  setTheme(d.weather[0].main);
}

/* ════════════════════════════════════
   RENDER — 5-DAY FORECAST
   ════════════════════════════════════ */
function renderForecast(list) {
  const grid      = document.getElementById('forecastGrid');
  const isCelsius = unit === 'metric';
  const unitLabel = isCelsius ? '°C' : '°F';
  grid.innerHTML  = '';

  // Group entries by calendar day
  const dayMap = {};
  list.forEach(item => {
    const key = new Date(item.dt * 1000).toDateString();
    if (!dayMap[key]) dayMap[key] = [];
    dayMap[key].push(item);
  });

  Object.keys(dayMap).slice(0, 5).forEach(key => {
    const items = dayMap[key];
    const noon  = items.find(i => new Date(i.dt * 1000).getHours() >= 12) || items[0];
    const high  = Math.max(...items.map(i => i.main.temp_max));
    const low   = Math.min(...items.map(i => i.main.temp_min));
    const card  = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <div class="forecast-day">
        ${new Date(noon.dt * 1000).toLocaleDateString('en-IN', { weekday:'short' })}
      </div>
      <div class="forecast-date-sub">
        ${new Date(noon.dt * 1000).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
      </div>
      <div class="forecast-icon">${getIcon(noon.weather[0].icon)}</div>
      <div class="forecast-desc">${noon.weather[0].description}</div>
      <div class="forecast-temps">
        <span class="forecast-high">${Math.round(high)}${unitLabel}</span>
        <span class="forecast-divider">/</span>
        <span class="forecast-low">${Math.round(low)}${unitLabel}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ════════════════════════════════════
   FETCH — BY CITY NAME
   ════════════════════════════════════ */
async function fetchWeather(city) {
  showLoader(true);
  showWeather(false);
  document.getElementById('errorMsg').style.display = 'none';

  try {
    const [curRes, foreRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`)
    ]);
    const [cur, fore] = await Promise.all([curRes.json(), foreRes.json()]);

    if (cur.cod !== 200) throw new Error(cur.message || 'City not found.');

    lastData = { city: cur.name, cur, fore };
    renderCurrent(cur);
    renderForecast(fore.list);
    addToHistory(cur.name);
    showWeather(true);
  } catch (err) {
    showError('⚠️ ' + (err.message || 'Could not fetch weather. Please try again.'));
  } finally {
    showLoader(false);
  }
}

/* ════════════════════════════════════
   FETCH — BY GPS COORDINATES
   ════════════════════════════════════ */
async function fetchWeatherByCoords(lat, lon) {
  showLoader(true);
  showWeather(false);

  try {
    const [curRes, foreRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`)
    ]);
    const [cur, fore] = await Promise.all([curRes.json(), foreRes.json()]);

    if (cur.cod !== 200) throw new Error(cur.message);

    // Use reverse geocoding to get proper city name from coordinates
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    const geoData = await geoRes.json();
    
    // Prioritize city name from geocoding, fallback to weather API name
    const cityName = (geoData && geoData[0] && geoData[0].name) || cur.name || 'Unknown Location';

    lastData = { city: cityName, cur, fore };
    cur.name = cityName; // Override the name for display
    renderCurrent(cur);
    renderForecast(fore.list);
    addToHistory(cityName);
    showWeather(true);
  } catch (err) {
    showError('⚠️ ' + (err.message || 'Could not get local weather.'));
  } finally {
    showLoader(false);
  }
}

/* ════════════════════════════════════
   USER ACTIONS
   ════════════════════════════════════ */
function searchCity() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) { showError('Please enter a city name.'); return; }
  fetchWeather(city);
}

function detectLocation() {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
    ()  => showError('Location access denied. Please search manually.')
  );
}

function toggleUnit() {
  unit = unit === 'metric' ? 'imperial' : 'metric';
  document.getElementById('unitBtn').textContent = unit === 'metric' ? '°F' : '°C';
  if (lastData) fetchWeather(lastData.city);
}

/* ════════════════════════════════════
   HISTORY — ADD
   ════════════════════════════════════ */
function addToHistory(city) {
  searchHistory = [
    city,
    ...searchHistory.filter(c => c.toLowerCase() !== city.toLowerCase())
  ].slice(0, 8);
  localStorage.setItem('wv_history', JSON.stringify(searchHistory));
  renderHistory();
}

/* ════════════════════════════════════
   HISTORY — RENDER
   ════════════════════════════════════ */
function renderHistory() {
  const row   = document.getElementById('historyRow');
  const chips = document.getElementById('historyChips');

  if (!searchHistory.length) {
    row.style.display = 'none';
    manageMode = false;
    return;
  }

  row.style.display = 'flex';
  chips.innerHTML   = '';

  // Apply manage-active class to parent if in manage mode
  chips.className = 'history-chips-wrap' + (manageMode ? ' manage-active' : '');

  searchHistory.forEach(city => {
    const chip = document.createElement('div');
    chip.className = 'history-chip' + (manageMode ? ' manage-mode' : '');
    chip.dataset.city = city;

    // City label / click-to-search button
    const cityBtn = document.createElement('button');
    cityBtn.className = 'chip-city-btn';
    cityBtn.innerHTML = `<span>🕒</span>${city}`;
    cityBtn.title     = `Search ${city}`;
    cityBtn.onclick   = () => {
      if (!manageMode) {
        document.getElementById('cityInput').value = city;
        fetchWeather(city);
      }
    };

    // Delete (×) button shown only in manage mode
    const delBtn = document.createElement('button');
    delBtn.className   = 'chip-delete-btn';
    delBtn.innerHTML   = '✕';
    delBtn.title       = `Remove ${city}`;
    delBtn.onclick     = (e) => { e.stopPropagation(); openDeleteModal(city); };

    chip.appendChild(cityBtn);
    chip.appendChild(delBtn);
    chips.appendChild(chip);
  });

  // Show/hide manage buttons
  document.getElementById('manageBtn').style.display   = manageMode ? 'none' : 'inline-flex';
  document.getElementById('clearAllBtn').style.display = manageMode ? 'inline-flex' : 'none';
  document.getElementById('doneBtn').style.display     = manageMode ? 'inline-flex' : 'none';
}

/* ════════════════════════════════════
   MANAGE MODE — TOGGLE
   ════════════════════════════════════ */
function toggleManageMode() {
  manageMode = !manageMode;
  renderHistory();
}

/* ════════════════════════════════════
   DELETE — SINGLE CITY (Modal)
   ════════════════════════════════════ */
function openDeleteModal(city) {
  pendingDeleteCity = city;
  document.getElementById('modalCityName').textContent = city;
  document.getElementById('deleteModal').style.display = 'flex';

  document.getElementById('confirmDeleteBtn').onclick = () => {
    deleteSingleCity(pendingDeleteCity);
    closeModal();
  };
}

function closeModal() {
  document.getElementById('deleteModal').style.display = 'none';
  pendingDeleteCity = null;
}

function deleteSingleCity(city) {
  searchHistory = searchHistory.filter(c => c.toLowerCase() !== city.toLowerCase());
  localStorage.setItem('wv_history', JSON.stringify(searchHistory));
  if (!searchHistory.length) manageMode = false;
  renderHistory();
}

/* ════════════════════════════════════
   DELETE — ALL HISTORY
   ════════════════════════════════════ */
function clearAllHistory() {
  searchHistory = [];
  localStorage.removeItem('wv_history');
  manageMode = false;
  renderHistory();
}

/* ════════════════════════════════════
   CLOSE MODAL ON BACKDROP CLICK
   ════════════════════════════════════ */
document.getElementById('deleteModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

/* ════════════════════════════════════
   KEYBOARD SUPPORT
   ════════════════════════════════════ */
document.getElementById('cityInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') searchCity();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ════════════════════════════════════
   INIT
   ════════════════════════════════════ */
applyThemeMode();
renderHistory();
if (searchHistory.length > 0) {
  fetchWeather(searchHistory[0]);
} else {
  detectLocation();
}
