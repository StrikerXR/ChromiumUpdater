import React from 'react';

const DownloadLink = ({ href, opacity, isNewBuild }) => (
  <a
    className={`download-link ${isNewBuild ? 'new-build' : ''}`}
    href={href}
    target="_blank"
    style={{ opacity }}
  >
    Download now
  </a>
);

export default DownloadLink;
