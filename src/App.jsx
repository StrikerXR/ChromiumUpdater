import { useState, useEffect, useCallback } from 'react';

const App = () => {
  const [pos, setPos] = useState('------');
  const [status, setStatus] = useState('Connecting...');
  const [dotClass, setDotClass] = useState('dot');
  const [downloadLink, setDownloadLink] = useState('#');
  const [downloadLinkOpacity, setDownloadLinkOpacity] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isNewBuild, setIsNewBuild] = useState(false);

  const triggerHapticFeedback = (type = 'medium') => {
    if (navigator.vibrate) {
      const pattern = {
        light: [20],
        medium: [50],
        heavy: [100],
        success: [20, 80, 20],
        error: [100, 50, 100],
      };
      navigator.vibrate(pattern[type] || pattern.medium);
    }
  };

  const fetchLatestBuild = async () => {
    const url = 'https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Android_Arm64%2FLAST_CHANGE?alt=media';
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}&_=${new Date().getTime()}`);
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.text();
  };

  const checkForNewBuild = (newPos) => {
    const lastPos = localStorage.getItem('lastKnownPos');
    if (lastPos && newPos > lastPos) {
      const diff = newPos - lastPos;
      console.log(`BuildBot pushed ${diff} new builds since last check.`);
      setIsNewBuild(true);
    } else {
      setIsNewBuild(false);
    }
    localStorage.setItem('lastKnownPos', newPos);
  };

  const check = useCallback(async () => {
    triggerHapticFeedback('light');
    setStatus('Syncing...');
    setDotClass('dot loading');
    setPos(prevPos => prevPos); // Keep the old position while loading

    try {
      const responseText = await fetchLatestBuild();
      const newPos = responseText.trim();
      checkForNewBuild(newPos);
      setPos(newPos);
      setStatus(`Live: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      setDotClass('dot');
      setDownloadLink(`https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Android_Arm64/`);
      setDownloadLinkOpacity(1);
      triggerHapticFeedback('success');
    } catch (e) {
      console.error("Failed to fetch latest build:", e);
      setPos('Error');
      setDownloadLinkOpacity(0);
      setDotClass('dot'); // Reset dot class, color will be handled by CSS
      setStatus('API unreachable');
      triggerHapticFeedback('error');
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === null || savedTheme === 'dark');
    check();
    const interval = setInterval(check, 120000);
    return () => clearInterval(interval);
  }, [check]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleThemeChange = () => {
    triggerHapticFeedback('medium');
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <>
      <title>Chromium Pulse</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <div className="blob"></div>
      <div className="card">
        <div id="theme-switcher" onClick={handleThemeChange}>
          <img
            src={isDarkMode ? 'https://img.icons8.com/ios-glyphs/30/ffffff/moon-symbol.png' : 'https://img.icons8.com/ios-glyphs/30/000000/sun.png'}
            alt="theme icon"
          />
        </div>
        <div className="logo-area">
          <div className="glow"></div>
          <div className="inner-logo"></div>
        </div>
        <div className="label">Latest Position</div>
        <div className="pos" style={{ opacity: status === 'Syncing...' ? 0.5 : 1, transform: status === 'Syncing...' ? 'scale(0.95)' : 'scale(1)' }}>
          {pos}
        </div>
        <div className="status-container">
          <div
            className={dotClass}
            style={{
              background: status.startsWith('Live') ? '#34a853' : (status === 'API unreachable' ? '#ea4335' : '#fbbc04')
            }}
          ></div>
          <div className="status">{status}</div>
        </div>
        <button onClick={check}>Refresh Build</button>
        <a
          className={`download-link ${isNewBuild ? 'new-build' : ''}`}
          href={downloadLink}
          target="_blank"
          style={{ opacity: downloadLinkOpacity }}
        >
          Download now
        </a>
        <div className="build-time">
          Build: {__BUILD_TIME__}
        </div>
      </div>
    </>
  );
};

export default App;
