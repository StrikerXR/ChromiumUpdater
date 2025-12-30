// --- 1. Service Worker Registration ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker failed', err));
    });
}

// --- 2. Theme Toggle Logic ---
const themeBtn = document.getElementById('theme-toggle');
const sunIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>`;
const moonIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>`;

// Function to update icon
const updateThemeIcon = () => {
    themeBtn.innerHTML = document.body.classList.contains('dark-mode') ? sunIcon : moonIcon;
};

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}
updateThemeIcon();

// --- 3. Main Check Function ---
async function check() {
    const p = document.getElementById('pos');
    const s = document.getElementById('status');
    const d = document.getElementById('dot');
    
    s.innerText = "Syncing...";
    d.classList.add('loading');
    p.style.opacity = "0.5";
    p.style.transform = "scale(0.95)";

    try {
        const url = 'https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Android_Arm64%2FLAST_CHANGE?alt=media';
        const res = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(url));
        
        if (!res.ok) throw new Error();
        
        const responseText = await res.text();
        const newPos = responseText.trim();

        const lastPos = localStorage.getItem('lastKnownPos');
        if (lastPos && newPos > lastPos) {
            console.log(`BuildBot pushed ${newPos - lastPos} new builds.`);
        }
        localStorage.setItem('lastKnownPos', newPos);

        p.innerText = newPos;
        p.style.opacity = "1";
        p.style.transform = "scale(1)";
        d.classList.remove('loading');
        d.style.background = "#34a853"; 
        s.innerText = "Live: " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
    } catch (e) {
        p.innerText = "Error";
        d.classList.remove('loading');
        d.style.background = "#ea4335"; 
        s.innerText = "API unreachable";
    }
}

// --- 4. Handle PWA "Install" Prompt ---
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

check();
                
