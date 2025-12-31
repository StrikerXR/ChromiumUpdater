import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const LazyChromeVersionFetcher = lazy(() => import('./ChromeVersionFetcher'));

const Settings = ({ platform, setPlatform, clearHistory, buildType, setBuildType }) => {
  const platforms = [
    "AndroidDesktop_arm64", "AndroidDesktop_x64", "Android_Arm64", "Arm", "Linux",
    "Linux_ChromiumOS", "Linux_ChromiumOS_Full", "Linux_x64", "Mac", "Mac_M-Series",
    "Win", "Win_Arm64", "Win_x64", "android_rel", "chromium-full-linux-chromeos",
    "experimental", "gs-test", "lacros64", "lacros_arm", "lacros_arm64",
    "linux_lacros", "linux_rel", "mac_rel", "win32_rel", "win_rel"
  ];

  return (
    <motion.div
      id="settings-popover"
      popover="auto"
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="settings-modal"
    >
      <div className="settings-header">
        <h2>Settings</h2>
        <button onClick={() => document.getElementById('settings-popover').hidePopover()} className="close-button"><X /></button>
      </div>
      <div className="settings-content">
        <div className="toggle-switch">
          <button className={buildType === 'chromium' ? 'active' : ''} onClick={() => setBuildType('chromium')}>Chromium</button>
          <button className={buildType === 'chrome' ? 'active' : ''} onClick={() => setBuildType('chrome')}>Chrome</button>
        </div>

        {buildType === 'chromium' && (
          <>
            <label htmlFor="platform-select">Platform:</label>
            <select id="platform-select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </>
        )}

        {buildType === 'chrome' && (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyChromeVersionFetcher />
          </Suspense>
        )}

        <div className="changelog">
          <h3>Changelog</h3>
          <p><strong>1.0.0</strong> - First Release: Track the latest Chromium builds, view build history, and switch between light and dark themes.</p>
        </div>

        <button onClick={clearHistory} className="clear-history-button">Clear History</button>
      </div>
    </motion.div>
  );
};

export default Settings;
