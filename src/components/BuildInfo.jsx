import React from 'react';

const BuildInfo = ({ pos, status, dotClass, error, retry }) => (
  <>
    <div className="label">Latest Position</div>
    <div className="pos" style={{ opacity: status === 'Syncing...' ? 0.5 : 1, transform: status === 'Syncing...' ? 'scale(0.95)' : 'scale(1)' }}>
      {pos}
    </div>
    <div className="status-container">
      {error ? (
        <div className="error-container">
          <div className="status error">{error}</div>
          <button onClick={retry} className="retry-button">Retry</button>
        </div>
      ) : (
        <>
          <div
            className={dotClass}
            style={{
              background: status.startsWith('Live') ? '#34a853' : (status === 'API unreachable' ? '#ea4335' : '#fbbc04')
            }}
          ></div>
          <div className="status">{status}</div>
        </>
      )}
    </div>
  </>
);

export default BuildInfo;
