import React from 'react';
import { useGitHub } from '../context/GitHubContext';
import { 
  Home, 
  Folder, 
  Settings, 
  LogOut, 
  Search,
  Plus
} from 'lucide-react';
import './Sidebar.css';

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

const Sidebar = () => {
  const { user, logout, setCurrentRepo, setContents, setCurrentPath } = useGitHub();

  const handleHomeClick = () => {
    setCurrentRepo(null);
    setContents([]);
    setCurrentPath('');
  };

  return (
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <GithubIcon size={24} />
          </div>
          <span className="logo-text gradient-text">GitControl</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <p className="nav-label">Main</p>
          <button className="nav-item active" onClick={handleHomeClick}>
            <Home size={18} />
            <span>Dashboard</span>
          </button>
          <button className="nav-item">
            <Folder size={18} />
            <span>Repositories</span>
          </button>
        </div>

        <div className="nav-group">
          <p className="nav-label">System</p>
          <button className="nav-item">
            <Search size={18} />
            <span>Global Search</span>
          </button>
          <button className="nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="user-profile">
            <img src={user.avatar_url} alt={user.login} className="avatar" />
            <div className="user-info">
              <p className="username">{user.login}</p>
              <p className="user-status">{user.bio || 'Developer'}</p>
            </div>
            <button className="logout-btn" onClick={logout} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
