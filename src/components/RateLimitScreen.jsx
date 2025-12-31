import React from 'react';

const RateLimitScreen = ({ cooldown }) => {
  return (
    <div className="rate-limit-screen">
      <h2>Rate Limited</h2>
      <p>Please wait {cooldown} seconds before trying again.</p>
    </div>
  );
};

export default RateLimitScreen;
