import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { triggerHapticFeedback } from '../utils/haptics';

const fetchLatestBuild = async (platform) => {
  const mediaUrl = `https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/${platform}%2FLAST_CHANGE?alt=media`;
  const metaUrl = `https://www.googleapis.com/storage/v1/b/chromium-browser-snapshots/o/${platform}%2FLAST_CHANGE`;
  const proxy = 'https://corsproxy.io/?';

  const [mediaRes, metaRes] = await Promise.all([
    fetch(`${proxy}${encodeURIComponent(mediaUrl)}`),
    fetch(`${proxy}${encodeURIComponent(metaUrl)}`)
  ]);

  if (!mediaRes.ok) {
    throw new Error('Network response for build number was not ok');
  }

  const pos = (await mediaRes.text()).trim();
  let lastModified = new Date().toISOString();

  if (metaRes.ok) {
    try {
      const meta = await metaRes.json();
      lastModified = meta.updated;
    } catch (e) {
      console.error("Failed to parse metadata:", e);
    }
  }

  return { pos, lastModified };
};

export const useChromiumBuild = (platform, buildType) => {
  const [isNewBuild, setIsNewBuild] = useState(false);
  const [buildHistory, setBuildHistory] = useState(() => JSON.parse(localStorage.getItem('buildHistory')) || []);

  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['buildData', platform],
    queryFn: () => fetchLatestBuild(platform),
    refetchInterval: 120000,
    staleTime: 60000,
  });

  useEffect(() => {
    if (isLoading) {
      triggerHapticFeedback('light');
    }
  }, [isLoading]);

  useEffect(() => {
    if (isError) {
      triggerHapticFeedback('error');
    }
  }, [isError]);

  useEffect(() => {
    if (data?.pos) {
      const lastPos = localStorage.getItem('lastKnownPos');
      const newPos = data.pos;
      if (!lastPos || newPos > lastPos) {
        if (lastPos && newPos > lastPos) {
          setIsNewBuild(true);
          triggerHapticFeedback('success');
        } else {
          setIsNewBuild(false);
        }
        setBuildHistory(prevHistory => {
          const newHistoryItem = { pos: newPos, date: data.lastModified || new Date().toISOString() };
          const newHistory = [newHistoryItem, ...prevHistory].slice(0, 10);
          localStorage.setItem('buildHistory', JSON.stringify(newHistory));
          return newHistory;
        });
        localStorage.setItem('lastKnownPos', newPos);
      } else {
        setIsNewBuild(false);
      }
    }
  }, [data]);

  const clearHistory = () => {
    localStorage.removeItem('buildHistory');
    localStorage.removeItem('lastKnownPos');
    setBuildHistory([]);
    triggerHapticFeedback('light');
  };

  const status = isLoading
    ? 'Syncing...'
    : error
    ? 'API unreachable'
    : `Published: ${new Date(data.lastModified).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const pos = data?.pos || '------';
  const downloadLink = data?.pos ? `https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=${platform}/${data.pos}/` : '#';
  const downloadLinkOpacity = data?.pos ? 1 : 0;
  const dotClass = isLoading ? 'dot loading' : 'dot';

  return {
    pos,
    status,
    dotClass,
    downloadLink,
    downloadLinkOpacity,
    isNewBuild,
    check: refetch,
    buildHistory,
    error: error ? 'Failed to fetch the latest build. Please check your network connection and try again.' : null,
    retry: refetch,
    clearHistory
  };
};
