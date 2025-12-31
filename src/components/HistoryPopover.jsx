import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HistoryPopover = ({ history }) => {
  const data = history.map((build, index) => {
    const prevBuild = history[index + 1];
    const timeDiff = prevBuild ? (new Date(build.date) - new Date(prevBuild.date)) / (1000 * 60) : 0;
    return {
      name: build.pos,
      'Time Between Updates (minutes)': timeDiff,
      'Build Position': build.pos,
    };
  }).reverse();

  return (
    <motion.div
      id="history-popover"
      popover="auto"
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="history-modal"
    >
      <div className="history-header">
        <h2>Build History</h2>
        <button onClick={() => document.getElementById('history-popover').hidePopover()} className="close-button"><X /></button>
      </div>
      <div className="history-content">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Time Between Updates (minutes)" stroke="#8884d8" />
            <Line type="monotone" dataKey="Build Position" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
        <div className="history-list">
          {history.length > 0 ? (
            history.map((build, index) => (
              <div key={index} className="history-item">
                <span>{build.pos}</span>
                <span>{new Date(build.date).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p>No history yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryPopover;
