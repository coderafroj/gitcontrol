import React from 'react';
import { useGitHub } from '../context/GitHubContext';
import { Home, Folder, User, Mail, Settings } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  const { currentRepo, fetchContents, user } = useGitHub();

  const handleDashboard = () => {
    fetchContents(null);
  };

  return (
    <nav className="bottom-nav glass">
      <button 
        className={`nav-btn ${!currentRepo ? 'active' : ''}`} 
        onClick={handleDashboard}
      >
        <Home size={22} />
        <span>Home</span>
      </button>
      
      <button 
        className={`nav-btn ${currentRepo ? 'active' : ''}`}
        disabled={!currentRepo}
        title={!currentRepo ? 'Open a repo first' : ''}
      >
        <Folder size={22} />
        <span>Files</span>
      </button>

      <button className="nav-btn">
        <Mail size={22} />
        <span>Inbox</span>
      </button>

      <button className="nav-btn user-btn">
        {user ? (
          <img src={user.avatar_url} alt="" className="nav-avatar" />
        ) : (
          <User size={22} />
        )}
        <span>Me</span>
      </button>
    </nav>
  );
};

export default BottomNav;
