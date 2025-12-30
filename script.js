// --- 1. DOM Element Constants ---
const posElement = document.getElementById('pos');
const statusElement = document.getElementById('status');
const dotElement = document.getElementById('dot');
const downloadLink = document.getElementById('download-link');
const themeSwitcher = document.getElementById('theme-switcher');
const themeIcon = themeSwitcher.querySelector('img');
const body = document.body;
const refreshButton = document.getElementById('refresh-button');

// --- 2. Service Worker Registration ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker failed', err));
    });
}

// --- 3. Haptic Feedback ---
function triggerHapticFeedback(type = 'medium') {
    if (navigator.vibrate) {
        const pattern = {
            light: [20],
            medium: [50],
            heavy: [100]
        };
        navigator.vibrate(pattern[type] || pattern.medium);
    }
}

// --- 4. UI Update Functions ---
function setUILoading() {
    statusElement.innerText = "Syncing...";
    dotElement.classList.add('loading');
    posElement.style.opacity = "0.5";
    posElement.style.transform = "scale(0.95)";
}

function setUISuccess(newPos) {
    posElement.innerText = newPos;
    posElement.style.opacity = "1";
    posElement.style.transform = "scale(1)";
    dotElement.classList.remove('loading');
    dotElement.style.background = "#34a853";
    statusElement.innerText = "Live: " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    downloadLink.href = `https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Android_Arm64/`;
    downloadLink.style.opacity = "1";
}

function setUIError() {
    posElement.innerText = "Error";
    downloadLink.style.opacity = "0";
    dotElement.classList.remove('loading');
    dotElement.style.background = "#ea4335";
    statusElement.innerText = "API unreachable";
}

// --- 5. Core Logic ---
async function fetchLatestBuild() {
    const url = 'https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Android_Arm64%2FLAST_CHANGE?alt=media';
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}&_=${new Date().getTime()}`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.text();
}

function checkForNewBuild(newPos) {
    const lastPos = localStorage.getItem('lastKnownPos');
    if (lastPos && newPos > lastPos) {
        const diff = newPos - lastPos;
        console.log(`BuildBot pushed ${diff} new builds since last check.`);
        downloadLink.classList.add('new-build');
    } else {
        downloadLink.classList.remove('new-build');
    }
    localStorage.setItem('lastKnownPos', newPos);
}

async function check() {
    triggerHapticFeedback('light');
    setUILoading();
    try {
        const responseText = await fetchLatestBuild();
        const newPos = responseText.trim();
        checkForNewBuild(newPos);
        setUISuccess(newPos);
    } catch (e) {
        console.error("Failed to fetch latest build:", e);
        setUIError();
    }
}

// --- 6. PWA Install Prompt ---
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('App is ready to be installed on home screen');
});

// --- 7. Theme Switcher ---
function setTheme(isDark) {
    body.classList.toggle('dark-mode', isDark);
    themeIcon.src = isDark
        ? 'https://img.icons8.com/ios-glyphs/30/ffffff/moon-symbol.png'
        : 'https://img.icons8.com/ios-glyphs/30/000000/sun.png';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

themeSwitcher.addEventListener('click', () => {
    triggerHapticFeedback('medium');
    setTheme(!body.classList.contains('dark-mode'));
});

// --- 8. Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme === null || savedTheme === 'dark');

    // Add event listener for the refresh button
    refreshButton.addEventListener('click', check);

    // Initial check on load
    check();

    // Automatically check for updates every 2 minutes
    setInterval(check, 120000);
});
