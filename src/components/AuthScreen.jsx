import React, { useState } from 'react';
import { useGitHub } from '../context/GitHubContext';
import { Key, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const GithubIcon = ({ size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const AuthScreen = () => {
  const [tempToken, setTempToken] = useState('');
  const { setToken, loading, error } = useGitHub();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tempToken.trim()) {
      setToken(tempToken.trim());
    }
  };

  return (
    <div className="auth-screen" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      padding: '20px'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass auth-card"
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '3rem',
          textAlign: 'center'
        }}
      >
        <div className="auth-icon-wrapper" style={{
          background: 'rgba(139, 92, 246, 0.1)',
          width: '80px',
          height: '80px',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: 'var(--accent-primary)'
        }}>
          <GithubIcon size={40} />
        </div>

        <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>GitControl</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          Manage your GitHub repositories with a premium experience. 
          Enter your Personal Access Token (PAT) to get started.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <Key size={18} style={{ 
              position: 'absolute', 
              left: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxx"
              value={tempToken}
              onChange={(e) => setTempToken(e.target.value)}
              style={{ paddingLeft: '44px' }}
              required
            />
          </div>

          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '-0.5rem' }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Authenticating...' : (
              <>
                Connect Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ 
          marginTop: '2.5rem', 
          padding: '1rem', 
          background: 'rgba(255, 255, 255, 0.03)', 
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textAlign: 'left'
        }}>
          <ShieldCheck size={20} style={{ color: '#10b981', flexShrink: 0 }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Your token is stored locally on your device and never sent to our servers.
            Ensure your PAT has <strong>repo</strong> permissions.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;
