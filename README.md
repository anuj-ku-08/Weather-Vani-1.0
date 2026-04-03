<div align="center">

<!-- BANNER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=200&section=header&text=🌀%20Weather%20Vani&fontSize=60&fontColor=ffffff&fontAlignY=38&desc=Your%20Atmospheric%20Companion&descAlignY=62&descSize=20&descColor=rgba(255,255,255,0.75)" width="100%"/>

<!-- BADGES -->
<p>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/OpenWeatherMap-API-orange?style=for-the-badge&logo=cloud&logoColor=white" alt="OpenWeatherMap"/>
</p>

<p>
  <img src="https://img.shields.io/badge/Responsive-Mobile%20Friendly-64ffda?style=flat-square" alt="Responsive"/>
  <img src="https://img.shields.io/badge/Theme-Dark%20%2F%20Light%20Mode-f7c59f?style=flat-square" alt="Dark Light Mode"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License"/>
  <img src="https://img.shields.io/badge/Version-2.0-blueviolet?style=flat-square" alt="Version"/>
</p>

<br/>

> **Weather Vani** is a beautifully crafted, fully responsive weather forecast web app built with pure HTML, CSS, and JavaScript — powered by the free OpenWeatherMap API. Featuring dynamic weather-themed backgrounds, dark/light mode, 5-day forecasts, GPS location detection, and smart search history management.

<br/>

</div>

---


## ✨ Features

<div align="center">

| Feature | Description |
|:---|:---|
| 🔍 **City Search** | Search any city worldwide and get instant weather data |
| 📍 **Auto Location Detection** | One-click GPS detection to show your local weather |
| 🌡️ **Current Weather Display** | Temperature, condition, humidity, wind, pressure, visibility, sunrise & sunset |
| 📆 **5-Day Forecast** | Daily high/low forecast so you can plan ahead |
| 🕒 **Search History** | Last 8 cities saved as quick-click chips in browser memory |
| ✏️ **Manage History** | Select and delete individual or all recent cities |
| 🔄 **°C / °F Toggle** | Switch temperature units with a single click |
| 🌙 **Dark / Light Mode** | Persistent theme preference saved across sessions |
| 🎨 **Dynamic Backgrounds** | Gradient backgrounds that change with weather conditions |
| 📱 **Fully Responsive** | Optimised for mobile, tablet, and desktop screens |

</div>

---

## 🎨 Dynamic Weather Themes

Weather Vani automatically changes its background gradient to match current weather conditions:

```
☀️  Clear       →  Deep Blue → Sky Blue → Warm Amber
☁️  Cloudy      →  Charcoal → Slate → Steel Blue
🌧️  Rain        →  Midnight Blue → Royal Blue → Cobalt
⛈️  Thunderstorm →  Near-Black → Dark Purple → Deep Indigo
❄️  Snow        →  Ice Blue → Powder White → Pale Sky
🌫️  Mist / Fog  →  Slate → Blue-Grey → Pewter
```

Paired with **Light Mode**, each theme switches to a soft, bright daytime palette.

---

## 🗂️ Project Structure

```
weather-vani/
│
├── 📄 index.html      →  App structure & markup
├── 🎨 style.css       →  All styles, themes, animations & responsive layout
└── ⚙️  app.js         →  API calls, state management, history, theme toggle
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/weather-vani.git
cd weather-vani
```

### 2. Get a Free API Key

1. Visit [openweathermap.org](https://openweathermap.org/api) and create a free account
2. Copy your API key from the dashboard

### 3. Add Your API Key

Open `app.js` and replace the placeholder:

```js
// Line 10 in app.js
const API_KEY = 'YOUR_API_KEY_HERE'; // 🔑 Paste your key here
```

### 4. Open in Browser

```bash
# Simply open index.html in any modern browser — no build step needed!
open index.html
```

> ✅ That's it — no npm, no dependencies, no build tools required.

---

## 🌐 API Reference

This project uses the **OpenWeatherMap API** (free tier):

| Endpoint | Purpose |
|:---|:---|
| `/data/2.5/weather` | Current weather by city name or coordinates |
| `/data/2.5/forecast` | 5-day / 3-hour forecast data |

Free tier allows **60 calls/minute** and **1,000,000 calls/month** — more than enough for personal use.

---

## 🧩 Feature Deep-Dive

### 🕒 Search History Management

```
1. Search any city → it's automatically saved as a chip
2. Click ✏️ Manage  → chips enter edit mode (red highlight)
3. Click ✕ on chip → confirmation modal appears before deleting
4. Click 🗑 Clear All → removes all history at once
5. Click ✅ Done    → exits manage mode
```

History is stored in `localStorage` — it persists between browser sessions.

---

### 🌙 Dark / Light Mode Toggle

The circular button to the left of the title controls the theme:

```
🌙  Crescent Moon  →  You are in Dark Mode  → Click to switch to Light
☀️  Sun Icon       →  You are in Light Mode → Click to switch to Dark
```

- Hover reveals a glowing ring and tooltip
- Click triggers a smooth spin + scale animation on the icon
- Your preference is saved in `localStorage` and restored on next visit

---

### 📱 Responsive Breakpoints

| Screen Size | Layout Behaviour |
|:---|:---|
| **Desktop** `> 700px` | Full grid layout, all stats visible side-by-side |
| **Tablet** `≤ 700px` | 2-column stats grid, stacked search bar |
| **Mobile** `≤ 380px` | Single column forecast cards, compact layout |

---

## 🛠️ Tech Stack

```
Frontend   →  Vanilla HTML5, CSS3, JavaScript (ES6+)
Fonts      →  Google Fonts — Playfair Display, Rajdhani, Space Mono
API        →  OpenWeatherMap REST API
Storage    →  Browser localStorage (history + theme preference)
Hosting    →  Any static host — GitHub Pages, Netlify, Vercel
```

---

## 🚢 Deployment

### GitHub Pages

```bash
# 1. Push your code to a GitHub repo
git add . && git commit -m "Initial release" && git push

# 2. Go to Settings → Pages → Source: main branch / root
# 3. Your site will be live at:
#    https://your-username.github.io/weather-vani
```

### Netlify (Drag & Drop)

1. Go to [netlify.com](https://netlify.com) → **New Site → Drag & Drop**
2. Drop your `weather-vani/` folder
3. Done — live URL generated instantly ⚡

---

## 📁 File Reference

<details>
<summary><b>🧱 index.html — Key Sections</b></summary>

```html
<header>             <!-- Logo + Dark/Light toggle button       -->
<div.search-section> <!-- Search input + location + unit toggle -->
<div#historyRow>     <!-- Recent cities + manage/delete UI      -->
<div#deleteModal>    <!-- Confirmation modal for city removal    -->
<div#weatherMain>    <!-- Current weather card + forecast grid  -->
```

</details>

<details>
<summary><b>🎨 style.css — Key Sections</b></summary>

```css
:root {}                    /* CSS variables — colours, radius, shadow  */
body.light-mode {}          /* Complete light theme overrides            */
body.weather-* #bg-layer {} /* Per-weather gradient backgrounds (dark)   */
body.light-mode.weather-* {} /* Per-weather gradients (light)            */
.theme-toggle {}            /* Dark/Light toggle button + hover effects  */
.history-chip {}            /* Recent city chips + manage mode states    */
.modal-overlay {}           /* Delete confirmation modal                 */
```

</details>

<details>
<summary><b>⚙️ app.js — Key Functions</b></summary>

```js
toggleThemeMode()       // Switches dark ↔ light, saves to localStorage
applyThemeMode()        // Reads saved theme and applies on load
fetchWeather(city)      // Calls OWM API by city name
fetchWeatherByCoords()  // Calls OWM API by GPS coordinates
renderCurrent(d)        // Populates current weather card
renderForecast(list)    // Builds 5-day forecast grid
addToHistory(city)      // Adds city, deduplicates, saves to localStorage
toggleManageMode()      // Activates ✕ delete buttons on chips
openDeleteModal(city)   // Shows confirmation modal for single delete
clearAllHistory()       // Wipes all stored search history
```

</details>

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

```bash
# Fork the repo → create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m "Add some AmazingFeature"

# Push to the branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) — for the free weather API
- [Google Fonts](https://fonts.google.com/) — Playfair Display, Rajdhani, Space Mono
- [Shields.io](https://shields.io/) — for the README badges
- [Capsule Render](https://github.com/kyechan99/capsule-render) — for the header banner

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=100&section=footer" width="100%"/>

**Made with ❤️ and ☁️ by Anuj Kumar (https://github.com/anuj-ku-08)**

⭐ **Star this repo if you found it useful!** ⭐

</div>
