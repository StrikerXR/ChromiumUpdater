import React, { useState, useEffect } from 'react';

const ChromeVersionFetcher = () => {
  const [versions, setVersions] = useState({
    stable: 'Loading...',
    beta: 'Loading...',
    dev: 'Loading...',
    canary: 'Loading...',
  });

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const [stableRes, betaRes, devRes, canaryRes] = await Promise.all([
          fetch('https://versionhistory.googleapis.com/v1/chrome/platforms/win/channels/stable/versions'),
          fetch('https://versionhistory.googleapis.com/v1/chrome/platforms/win/channels/beta/versions'),
          fetch('https://versionhistory.googleapis.com/v1/chrome/platforms/win/channels/dev/versions'),
          fetch('https://versionhistory.googleapis.com/v1/chrome/platforms/win/channels/canary/versions'),
        ]);

        const [stableData, betaData, devData, canaryData] = await Promise.all([
          stableRes.json(),
          betaRes.json(),
          devRes.json(),
          canaryRes.json(),
        ]);

        setVersions({
          stable: stableData.versions[0].version,
          beta: betaData.versions[0].version,
          dev: devData.versions[0].version,
          // Canary often doesn't have a public version, so we provide a fallback.
          canary: canaryData.versions[0]?.version || 'N/A',
        });
      } catch (error) {
        console.error('Error fetching Chrome versions:', error);
        setVersions({
          stable: 'Error',
          beta: 'Error',
          dev: 'Error',
          canary: 'Error',
        });
      }
    };
    fetchVersions();
  }, []);

  return (
    <div className="channel-selector">
      <h4>Chrome Channels</h4>
      <ul>
        <li>Stable: {versions.stable}</li>
        <li>Beta: {versions.beta}</li>
        <li>Dev: {versions.dev}</li>
        <li>Canary: {versions.canary}</li>
      </ul>
    </div>
  );
};

export default ChromeVersionFetcher;
