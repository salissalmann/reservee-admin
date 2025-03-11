'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBranding() {
  return (
    <div className='flex items-center gap-1'>
      <motion.div
        className='text-2xl dark:text-white text-tertiary font-bold'
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        get
      </motion.div>
      <div className='text-2xl text-primary font-bold'>&gt;</div>
      <motion.div
        className='text-2xl dark:text-white text-tertiary font-bold'
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        in
      </motion.div>
    </div>
  )
}

