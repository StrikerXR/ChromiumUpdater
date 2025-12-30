import { useState, useEffect } from 'react';
import { useChromiumBuild } from './hooks/useChromiumBuild';
import ThemeSwitcher from './components/ThemeSwitcher';
import Logo from './components/Logo';
import BuildInfo from './components/BuildInfo';
import ActionButton from './components/ActionButton';
import DownloadLink from './components/DownloadLink';
import HistoryDrawer from './components/HistoryDrawer';
import ShareButton from './components/ShareButton';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { pos, status, dotClass, downloadLink, downloadLinkOpacity, isNewBuild, cooldown, check, buildHistory } = useChromiumBuild();
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === null || savedTheme === 'dark');
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <>
      <title>Chromium Pulse</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <div className="blob"></div>
      <div className="card">
        <ThemeSwitcher isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <Logo />
        <BuildInfo pos={pos} status={status} dotClass={dotClass} />
        <div className="button-group">
          <ActionButton onClick={check} disabled={cooldown > 0} cooldown={cooldown} />
          <ShareButton pos={pos} downloadLink={downloadLink} />
        </div>
        <DownloadLink href={downloadLink} opacity={downloadLinkOpacity} isNewBuild={isNewBuild} />
        <button className="history-button" onClick={() => setIsHistoryVisible(true)}>History</button>
      </div>
      <HistoryDrawer history={buildHistory} isVisible={isHistoryVisible} onClose={() => setIsHistoryVisible(false)} />
    </>
  );
};

export default App;
