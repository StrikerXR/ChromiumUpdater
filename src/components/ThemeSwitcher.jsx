import React from 'react';
import { triggerHapticFeedback } from '../utils/haptics';

const ThemeSwitcher = ({ isDarkMode, setIsDarkMode }) => {
  const handleThemeChange = () => {
    triggerHapticFeedback('medium');
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div id="theme-switcher" onClick={handleThemeChange}>
      <img
        src={isDarkMode ? 'https://img.icons8.com/ios-glyphs/30/ffffff/moon-symbol.png' : 'https://img.icons8.com/ios-glyphs/30/000000/sun.png'}
        alt="theme icon"
      />
    </div>
  );
};

export default ThemeSwitcher;
