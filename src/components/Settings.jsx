import React from 'react';

const Settings = ({ platform, setPlatform, clearHistory }) => {
  const platforms = [
    "AndroidDesktop_arm64", "AndroidDesktop_x64", "Android_Arm64", "Arm", "Linux",
    "Linux_ChromiumOS", "Linux_ChromiumOS_Full", "Linux_x64", "Mac", "Mac_M-Series",
    "Win", "Win_Arm64", "Win_x64", "android_rel", "chromium-full-linux-chromeos",
    "experimental", "gs-test", "lacros64", "lacros_arm", "lacros_arm64",
    "linux_lacros", "linux_rel", "mac_rel", "win32_rel", "win_rel"
  ];

  return (
    <div id="settings-popover" popover="auto">
      <h3>Settings</h3>
      <label htmlFor="platform-select">Platform:</label>
      <select id="platform-select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
        {platforms.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <button onClick={clearHistory} className="clear-history-button">Clear History</button>
      <button onClick={() => document.getElementById('settings-popover').hidePopover()}>Close</button>
    </div>
  );
};

export default Settings;
