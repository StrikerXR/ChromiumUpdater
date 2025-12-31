import React from 'react';
import { motion } from 'framer-motion';

const Logo = () => (
  <motion.div
    className="logo-area"
    animate={{ rotate: 360 }}
    transition={{
      duration: 30,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    <div className="glow"></div>
    <div className="inner-logo"></div>
  </motion.div>
);

export default Logo;
