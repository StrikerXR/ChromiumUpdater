import { useState, useEffect } from 'react';
import { useChromiumBuild } from './hooks/useChromiumBuild';
import ThemeSwitcher from './components/ThemeSwitcher';
import Logo from './components/Logo';
import BuildInfo from './components/BuildInfo';
import ActionButton from './components/ActionButton';
import DownloadLink from './components/DownloadLink';
import HistoryPopover from './components/HistoryPopover';
import ShareButton from './components/ShareButton';
import Settings from './components/Settings';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [platform, setPlatform] = useState('Android_Arm64');
  const { pos, status, dotClass, downloadLink, downloadLinkOpacity, isNewBuild, check, buildHistory } = useChromiumBuild(platform);

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
        <div className="top-bar">
          <ThemeSwitcher isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <button popovertarget="settings-popover" className="settings-button">⚙️</button>
        </div>
        <Logo />
        <BuildInfo pos={pos} status={status} dotClass={dotClass} />
        <div className="button-group">
          <ActionButton onClick={check} />
          <ShareButton pos={pos} downloadLink={downloadLink} />
        </div>
        <DownloadLink href={downloadLink} opacity={downloadLinkOpacity} isNewBuild={isNewBuild} />
        <button className="history-button" popovertarget="history-popover">History</button>
      </div>
      <HistoryPopover history={buildHistory} />
      <Settings platform={platform} setPlatform={setPlatform} />
    </>
  );
};

export default App;
