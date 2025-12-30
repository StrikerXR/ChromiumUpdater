// --- 1. Service Worker Registration (for PWA/Manifest support) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker failed', err));
    });
}

// --- Haptic Feedback ---
function triggerHapticFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate(50); // 50ms vibration
    }
}

// --- 2. Main Check Function ---
async function check() {
    triggerHapticFeedback(); // Haptic feedback on refresh
    const p = document.getElementById('pos');
    const s = document.getElementById('status');
    const d = document.getElementById('dot');
    const dl = document.getElementById('download-link');
    
    // UI State: Loading
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

        // --- Logic: Check for build jumps ---
        const lastPos = localStorage.getItem('lastKnownPos');
        if (lastPos && newPos > lastPos) {
            const diff = newPos - lastPos;
            console.log(`BuildBot pushed ${diff} new builds since last check.`);
            dl.classList.add('new-build');
        } else {
            dl.classList.remove('new-build');
        }
        localStorage.setItem('lastKnownPos', newPos);

        // Success UI
        p.innerText = newPos;
        p.style.opacity = "1";
        p.style.transform = "scale(1)";
        d.classList.remove('loading');
        d.style.background = "#34a853"; // Reset to green if it was red
        s.innerText = "Live: " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Update and reveal download link
        dl.href = `https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Android_Arm64/`;
        dl.style.opacity = "1";
        
    } catch (e) {
        p.innerText = "Error";
        dl.style.opacity = "0"; // Hide on error
        d.classList.remove('loading');
        d.style.background = "#ea4335"; // Red for error
        s.innerText = "API unreachable";
    }
}

// --- 3. Handle PWA "Install" Prompt ---
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome from showing the tiny default bar
    e.preventDefault();
    deferredPrompt = e;
    console.log('App is ready to be installed on home screen');
});

// --- 4. Theme Switcher ---
const themeSwitcher = document.getElementById('theme-switcher');
const themeIcon = themeSwitcher.querySelector('img');
const body = document.body;

// Function to set the theme
function setTheme(isDark) {
    body.classList.toggle('dark-mode', isDark);
    themeIcon.src = isDark
        ? 'https://img.icons8.com/ios-glyphs/30/ffffff/moon-symbol.png'
        : 'https://img.icons8.com/ios-glyphs/30/000000/sun.png';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Event listener for the switcher
themeSwitcher.addEventListener('click', () => {
    triggerHapticFeedback(); // Haptic feedback on theme change
    setTheme(!body.classList.contains('dark-mode'));
});

// Check for saved theme on initial load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark mode if no theme is saved
    if (savedTheme === null) {
        setTheme(true);
    } else {
        setTheme(savedTheme === 'dark');
    }
    // Initial check on load
    check();

    // Automatically check for updates every 2 minutes
    setInterval(check, 120000);
});
