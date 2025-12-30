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
        
        const text = await res.text();
        
        // Success
        p.innerText = text.trim();
        p.style.opacity = "1";
        p.style.transform = "scale(1)";
        d.classList.remove('loading');
        s.innerText = "Live: " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
    } catch (e) {
        p.innerText = "Error";
        d.style.background = "#ea4335"; // Red for error
        s.innerText = "API unreachable";
    }
}

// Initial check
check();
