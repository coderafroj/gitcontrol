import React, { useState } from 'react';
import { useGitHub } from '../context/GitHubContext';
import { Key, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundEffect from './BackgroundEffect';

const AuthScreen = () => {
  const { setToken, loading, error, setError } = useGitHub();
  const [inputToken, setInputToken] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!inputToken.trim()) {
      setError('Please enter a valid Personal Access Token');
      return;
    }
    setToken(inputToken.trim());
  };

  return (
    <div className="auth-container" style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <BackgroundEffect />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="auth-card glass"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '3rem 2.5rem',
          borderRadius: '32px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Logo Section */}
        <motion.div
          animate={{ 
            y: [0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ 
            width: '85px', 
            height: '85px', 
            margin: '0 auto 2rem',
            background: 'linear-gradient(135deg, #fff 0%, #a1a1aa 100%)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px',
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.1)'
          }}
        >
          <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '22px', objectFit: 'cover' }} />
        </motion.div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>GitControl</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>Professional GitHub management.</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Key size={18} style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'rgba(255, 255, 255, 0.4)' 
            }} />
            <input 
              type="password" 
              placeholder="Personal Access Token" 
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="glass-input"
              style={{
                width: '100%',
                height: '56px',
                padding: '0 16px 0 48px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: error ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0, textAlign: 'left', paddingLeft: '4px' }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              height: '56px',
              background: '#fff',
              color: '#000',
              borderRadius: '16px',
              fontWeight: '700',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 20px -5px rgba(255, 255, 255, 0.2)',
              transition: 'all 0.2s ease',
              border: 'none'
            }}
          >
            {loading ? (
              <div className="loader" style={{ borderTopColor: '#000', width: '20px', height: '20px' }}></div>
            ) : (
              <>Connect <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <a 
            href="https://github.com/settings/tokens" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: 'rgba(255, 255, 255, 0.4)', 
              fontSize: '0.85rem', 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.color = '#fff'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.4)'}
          >
            Don't have a token? Get one here <ExternalLink size={14} />
          </a>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.75rem' }}>
            <ShieldCheck size={14} />
            Your token is stored locally and never shared.
          </div>
        </div>
      </motion.div>

      <style>{`
        .glass-input:focus {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
        }
        .auth-card::before {
          content: "";
          position: absolute;
          top: -150px;
          right: -150px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
          z-index: -1;
        }
      `}</style>
    </div>
  );
};

export default AuthScreen;
