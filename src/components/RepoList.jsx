import React, { useState, useEffect } from 'react';
import { useGitHub } from '../context/GitHubContext';
import { 
  Search, 
  GitBranch, 
  Star, 
  Lock, 
  Globe, 
  FolderGit2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RepoCardSkeleton } from './Skeleton';

const RepoList = () => {
  const { user, repos, loading, fetchContents } = useGitHub();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    repo.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="repo-list-container">
      <header className="repo-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div className="header-text">
          <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '0.5rem' }}>Your Repositories</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome back, {user?.name || user?.login}. Managing {repos.length} repos.</p>
        </div>
        <div className="search-wrapper" style={{ position: 'relative', width: 'clamp(200px, 100%, 320px)' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search repositories..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px', height: '48px', width: '100%' }}
          />
        </div>
      </header>

      {loading && repos.length === 0 ? (
        <div className="repos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[...Array(6)].map((_, i) => <RepoCardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="repos-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {filteredRepos.map(repo => (
            <motion.div 
              key={repo.id} 
              variants={item}
              className="card repo-card"
              onClick={() => fetchContents(repo.owner.login, repo.name)}
              style={{ 
                cursor: 'pointer', 
                position: 'relative', 
                overflow: 'hidden',
                padding: '1.5rem' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FolderGit2 size={24} style={{ color: 'var(--accent-primary)' }} />
                  <h3 style={{ fontSize: '1.1rem' }}>{repo.name}</h3>
                </div>
                {repo.private ? <Lock size={16} /> : <Globe size={16} />}
              </div>

              <p style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.875rem', 
                marginBottom: '1.5rem',
                height: '40px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {repo.description || 'No description provided.'}
              </p>

              <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={14} /> {repo.stargazers_count}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <GitBranch size={14} /> {repo.default_branch}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} /> {new Date(repo.updated_at).toLocaleDateString()}
                </div>
              </div>

              <a 
                href={repo.html_url} 
                target="_blank" 
                onClick={(e) => e.stopPropagation()}
                style={{ position: 'absolute', top: '15px', right: '15px', opacity: 0.5 }}
              >
                <ExternalLink size={14} />
              </a>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RepoList;
