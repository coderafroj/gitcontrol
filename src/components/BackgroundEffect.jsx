import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const BackgroundEffect = () => {
  // Generate static positions for stars to avoid re-renders
  const stars = useMemo(() => {
    return [...Array(80)].map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)',
      overflow: 'hidden',
      zIndex: -1,
    }}>
      {/* Nebula elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
        filter: 'blur(100px)',
        zIndex: 0
      }} />
      
      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0.2 }}
          animate={{ 
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
            zIndex: 1
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundEffect;
