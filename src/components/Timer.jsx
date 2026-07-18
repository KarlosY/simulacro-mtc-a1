import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const Timer = ({ timeRemaining, onTimeUp }) => {
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  
  const isWarning = timeRemaining < 300; // Less than 5 minutes

  return (
    <div className={`timer-container glass-panel ${isWarning ? 'timer-warning' : ''}`} style={styles.container}>
      <Clock size={20} className={isWarning ? 'pulse' : ''} />
      <span style={styles.text}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    fontWeight: '600',
    fontSize: '1.25rem',
    transition: 'all 0.3s ease'
  },
  text: {
    fontVariantNumeric: 'tabular-nums'
  }
};

export default Timer;
