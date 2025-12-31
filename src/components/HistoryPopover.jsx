import React from 'react';

const HistoryPopover = ({ history }) => {
  return (
    <div id="history-popover" popover="auto">
      <div className="history-header">
        <h3>Build History</h3>
        <button onClick={() => document.getElementById('history-popover').hidePopover()}>Close</button>
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

export default HistoryPopover;
