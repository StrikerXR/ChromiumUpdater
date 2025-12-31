import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Odometer = ({ value }) => {
  const digits = String(value).split('');
  return (
    <div style={{ display: 'flex', overflow: 'hidden' }}>
      {digits.map((digit, i) => (
        <div key={i} style={{ height: '1em', lineHeight: '1em' }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={digit}
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              {digit}
            </motion.div>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

const BuildInfo = ({ pos, status, dotClass, error }) => (
  <>
    <div className="label">Latest Position</div>
    <div className="pos" style={{ opacity: status === 'Syncing...' ? 0.5 : 1, transform: status === 'Syncing...' ? 'scale(0.95)' : 'scale(1)' }}>
      <Odometer value={pos} />
    </div>
    <div className="status-container">
      {error ? (
        <div className="error-container">
          <div className="status error">{error}</div>
        </div>
      ) : (
        <>
          <div
            className={dotClass}
            style={{
              background: status.startsWith('Published') ? '#34a853' : (status === 'API unreachable' ? '#ea4335' : '#fbbc04')
            }}
          ></div>
          <div className="status">{status}</div>
        </>
      )}
    </div>
  </>
);

export default BuildInfo;
