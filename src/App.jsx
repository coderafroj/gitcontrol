import React from 'react';
import { GitHubProvider, useGitHub } from './context/GitHubContext';
import Sidebar from './components/Sidebar';
import AuthScreen from './components/AuthScreen';
import RepoList from './components/RepoList';
import FileExplorer from './components/FileExplorer';
import BottomNav from './components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';

const MainApp = () => {
  const { token, currentRepo, loading } = useGitHub();

  if (!token) {
    return <AuthScreen />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          {!currentRepo ? (
            <motion.div
              key="repo-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RepoList />
            </motion.div>
          ) : (
            <motion.div
              key="file-explorer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FileExplorer />
            </motion.div>
          )}
        </AnimatePresence>
        
        {loading && (
          <div className="processing-indicator" style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            background: '#fff',
            color: '#000',
            padding: '10px 20px',
            borderRadius: '24px',
            fontSize: '0.9rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 1100,
            fontWeight: '600'
          }}>
            <div className="loader" style={{
              width: '14px',
              height: '14px',
              border: '2px solid rgba(0,0,0,0.1)',
              borderTopColor: '#000',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}></div>
            Syncing...
          </div>
        )}
      </main>
      <BottomNav />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <GitHubProvider>
      <MainApp />
    </GitHubProvider>
  );
}

export default App;
