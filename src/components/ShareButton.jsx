import React from 'react';
import { triggerHapticFeedback } from '../utils/haptics';

const ShareButton = ({ pos, downloadLink }) => {
  const handleShare = async () => {
    triggerHapticFeedback('medium');
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Latest Chromium Build',
          text: `Check out the latest Chromium build for Android (ARM64): ${pos}`,
          url: downloadLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      navigator.clipboard.writeText(`${downloadLink}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <button className="share-button" onClick={handleShare}>
      Share
    </button>
  );
};

export default ShareButton;
