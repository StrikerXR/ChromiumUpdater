// --- 1. Service Worker Registration (for PWA/Manifest support) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker failed', err));
    });
}

// --- 2. Main Check Function ---
async function check() {
    const p = document.getElementById('pos');
    const s = document.getElementById('status');
    const d = document.getElementById('dot');
    
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
        }
        localStorage.setItem('lastKnownPos', newPos);

        // Success UI
        p.innerText = newPos;
        p.style.opacity = "1";
        p.style.transform = "scale(1)";
        d.classList.remove('loading');
        d.style.background = "#34a853"; // Reset to green if it was red
        s.innerText = "Live: " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
    } catch (e) {
        p.innerText = "Error";
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

// Initial check on load
check();
