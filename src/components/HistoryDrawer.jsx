import React from 'react';

const HistoryDrawer = ({ history, isVisible, onClose }) => {
  return (
    <div className={`history-drawer ${isVisible ? 'visible' : ''}`}>
      <div className="history-header">
        <h3>Build History</h3>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="history-list">
        {history.length > 0 ? (
          history.slice().reverse().map((build, index) => (
            <div key={index} className="history-item">
              <span>{build.pos}</span>
              <span>{new Date(build.date).toLocaleDateString()}</span>
            </div>
          ))
        ) : (
          <p>No history yet.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryDrawer;
