import { useState, useEffect, useCallback } from 'react';
import { triggerHapticFeedback } from '../utils/haptics';

const fetchLatestBuild = async () => {
  const url = 'https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Android_Arm64%2FLAST_CHANGE?alt=media';
  const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}&_=${new Date().getTime()}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.text();
};

export const useChromiumBuild = () => {
  const [pos, setPos] = useState('------');
  const [status, setStatus] = useState('Connecting...');
  const [dotClass, setDotClass] = useState('dot');
  const [downloadLink, setDownloadLink] = useState('#');
  const [downloadLinkOpacity, setDownloadLinkOpacity] = useState(0);
  const [isNewBuild, setIsNewBuild] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [buildHistory, setBuildHistory] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('buildHistory')) || [];
    setBuildHistory(history);
  }, []);

  const checkForNewBuild = (newPos) => {
    const lastPos = localStorage.getItem('lastKnownPos');
    if (lastPos && newPos > lastPos) {
      const diff = newPos - lastPos;
      console.log(`BuildBot pushed ${diff} new builds since last check.`);
      setIsNewBuild(true);
      setBuildHistory(prevHistory => {
        const newHistory = [...prevHistory, { pos: newPos, date: new Date().toISOString() }];
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
    if (cooldown > 0) return;

    triggerHapticFeedback('light');
    setStatus('Syncing...');
    setDotClass('dot loading');
    setPos(prevPos => prevPos);

    try {
      const responseText = await fetchLatestBuild();
      const newPos = responseText.trim();
      checkForNewBuild(newPos);
      setPos(newPos);
      setStatus(`Live: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      setDotClass('dot');
      setDownloadLink(`https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Android_Arm64/${newPos}/`);
      setDownloadLinkOpacity(1);
      triggerHapticFeedback('success');
    } catch (e) {
      console.error("Failed to fetch latest build:", e);
      setPos('Error');
      setDownloadLinkOpacity(0);
      setDotClass('dot');
      setStatus('API unreachable');
      triggerHapticFeedback('error');
    } finally {
      setCooldown(5);
    }
  }, [cooldown]);

  useEffect(() => {
    check();
    const interval = setInterval(check, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  return { pos, status, dotClass, downloadLink, downloadLinkOpacity, isNewBuild, cooldown, check, buildHistory };
};
