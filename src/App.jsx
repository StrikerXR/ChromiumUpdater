import { useState, useEffect } from 'react';
import { useChromiumBuild } from './hooks/useChromiumBuild';
import { triggerHapticFeedback } from './utils/haptics';
import ThemeSwitcher from './components/ThemeSwitcher';
import Logo from './components/Logo';
import BuildInfo from './components/BuildInfo';
import DownloadLink from './components/DownloadLink';
import HistoryPopover from './components/HistoryPopover';
import Settings from './components/Settings';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, History, Share2, Rocket } from 'lucide-react';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [platform, setPlatform] = useState('Android_Arm64');
  const [buildType, setBuildType] = useState('chromium');
  const { pos, status, dotClass, downloadLink, downloadLinkOpacity, isNewBuild, check, buildHistory, error, clearHistory } = useChromiumBuild(platform, buildType);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === null || savedTheme === 'dark');
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleShare = async () => {
    triggerHapticFeedback('medium');
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Latest Chromium Build',
          text: `Check out the latest Chromium build for ${platform}: ${pos}`,
          url: downloadLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(downloadLink);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
      <title>Chromium Pulse</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
      <div className="blob"></div>
      <div className="app-container">
        <div className="top-bar">
          <ThemeSwitcher isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <button popoverTarget="settings-popover" className="icon-button haptic-feedback" onClick={() => triggerHapticFeedback('light')}><SettingsIcon /></button>
        </div>
        <div className="main-content">
          <Logo />
          <div className="build-info">
            <BuildInfo pos={pos} status={status} dotClass={dotClass} error={error} />
          </div>
          <DownloadLink href={downloadLink} opacity={downloadLinkOpacity} isNewBuild={isNewBuild} />
        </div>
        <div className="bottom-bar">
          <button popoverTarget="history-popover" className="icon-button haptic-feedback" onClick={() => triggerHapticFeedback('light')}><History /></button>
          <motion.button
            className="action-button haptic-feedback"
            onClick={() => { check(); triggerHapticFeedback('heavy'); }}
            whileTap={{ scale: 0.9 }}
          >
            <Rocket />
          </motion.button>
          <button className="icon-button haptic-feedback" onClick={handleShare}><Share2 /></button>
        </div>
      </div>
      <HistoryPopover history={buildHistory} />
      <Settings platform={platform} setPlatform={setPlatform} clearHistory={clearHistory} buildType={buildType} setBuildType={setBuildType} />
    </>
  );
};

export default App;
