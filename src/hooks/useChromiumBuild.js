import { useState, useEffect, useCallback } from 'react';
import { triggerHapticFeedback } from '../utils/haptics';

const fetchLatestBuild = async (platform) => {
  const url = `https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/${platform}%2FLAST_CHANGE?alt=media`;
  const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}&_=${new Date().getTime()}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.text();
};

export const useChromiumBuild = (platform) => {
  const [pos, setPos] = useState('------');
  const [status, setStatus] = useState('Connecting...');
  const [error, setError] = useState(null);
  const [dotClass, setDotClass] = useState('dot');
  const [downloadLink, setDownloadLink] = useState('#');
  const [downloadLinkOpacity, setDownloadLinkOpacity] = useState(0);
  const [isNewBuild, setIsNewBuild] = useState(false);
  const [buildHistory, setBuildHistory] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('buildHistory')) || [];
    setBuildHistory(history);
  }, []);

  const checkForNewBuild = (newPos) => {
    const lastPos = localStorage.getItem('lastKnownPos');
    if (!lastPos || newPos > lastPos) {
      if (lastPos && newPos > lastPos) {
        const diff = newPos - lastPos;
        console.log(`BuildBot pushed ${diff} new builds since last check.`);
        setIsNewBuild(true);
      } else {
        setIsNewBuild(false);
      }
      setBuildHistory(prevHistory => {
        const newHistory = [...prevHistory, { pos: newPos, date: new
Date().toISOString() }];
        if (newHistory.length > 10) newHistory.shift();
        localStorage.setItem('buildHistory', JSON.stringify(newHistory));
        return newHistory;
      });
    } else {
      setIsNewBuild(false);
    }
    localStorage.setItem('lastKnownPos', newPos);
  };

  const check = useCallback(async () => {
    triggerHapticFeedback('light');
    setStatus('Syncing...');
    setDotClass('dot loading');
    setPos(prevPos => prevPos);
    setError(null);

    try {
      const responseText = await fetchLatestBuild(platform);
      const newPos = responseText.trim();
      checkForNewBuild(newPos);
      setPos(newPos);
      setStatus(`Live: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      setDotClass('dot');
      setDownloadLink(`https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=${platform}/${newPos}/`);
      setDownloadLinkOpacity(1);
      triggerHapticFeedback('success');
    } catch (e) {
      console.error("Failed to fetch latest build:", e);
      setPos('Error');
      setDownloadLinkOpacity(0);
      setDotClass('dot');
      setStatus('API unreachable');
      setError('Failed to fetch the latest build. Please check your network connection and try again.');
      triggerHapticFeedback('error');
    }
  }, [platform]);

  const retry = () => {
    check();
  };

  const clearHistory = () => {
    localStorage.removeItem('buildHistory');
    localStorage.removeItem('lastKnownPos');
    setBuildHistory([]);
    triggerHapticFeedback('light');
  };

  useEffect(() => {
    check();
    const interval = setInterval(check, 120000);
    return () => clearInterval(interval);
  }, [platform]);

  return { pos, status, dotClass, downloadLink, downloadLinkOpacity, isNewBuild, check, buildHistory, error, retry, clearHistory };
};
