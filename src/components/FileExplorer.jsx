import React, { useState, useEffect } from 'react';
import { useGitHub } from '../context/GitHubContext';
import { 
  Folder, 
  File, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  FileCode, 
  FileText, 
  Plus, 
  Upload,
  Download,
  MoreVertical,
  Search,
  LayoutGrid,
  List as ListIcon,
  RefreshCw,
  FolderPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Uploader from './Uploader';
import FilePreview from './FilePreview';
import { FileItemSkeleton, GridItemSkeleton } from './Skeleton';

const FileExplorer = () => {
  const { currentRepo, currentPath, contents, fetchContents, createFolder, uploadFile, loading, error } = useGitHub();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(handler);
  }, [search]);

  // Protective redirect if somehow currentRepo is null while explorer is open
  if (!currentRepo) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>No repository selected. Returning to dashboard...</p>
        <button onClick={() => fetchContents(null)} style={{ marginTop: '1rem' }}>Go Home</button>
      </div>
    );
  }

  const handleFolderClick = (path) => {
    fetchContents(currentRepo.owner, currentRepo.repo, path);
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  const handleBack = () => {
    if (!currentPath || currentPath === '' || currentPath === '/') {
      fetchContents(null);
      return;
    }
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    const parentPath = parts.join('/');
    fetchContents(currentRepo.owner, currentRepo.repo, parentPath);
  };

  const handleCreateFolder = () => {
    const name = prompt('Enter new folder name:');
    if (name && name.trim()) {
      createFolder(currentRepo.owner, currentRepo.repo, currentPath, name.trim());
    }
  };

  const handleRefresh = () => {
    fetchContents(currentRepo.owner, currentRepo.repo, currentPath, true);
  };

  const getFileIcon = (type, name) => {
    if (type === 'dir') return <Folder size={20} style={{ color: '#fbbf24' }} />;
    const ext = name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      return <ImageIcon size={20} style={{ color: '#6366f1' }} />;
    }
    if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'py', 'go', 'json', 'md', 'txt'].includes(ext)) {
      return <FileCode size={20} style={{ color: '#10b981' }} />;
    }
    return <FileText size={20} style={{ color: '#94a3b8' }} />;
  };

  const isImage = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext);
  };

  const filteredContents = contents?.filter(item => 
    item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="explorer-container" style={{ width: '100%', height: '100%' }}>
      <header className="explorer-header" style={{ 
        marginBottom: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1.5rem 0',
        borderBottom: '1px solid var(--border-color)',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: 'max-content' }}>
          <button 
            onClick={handleBack}
            className="secondary"
            style={{ 
              width: '45px', 
              height: '45px', 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: 0,
              flexShrink: 0
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <div style={{ overflow: 'hidden' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentRepo?.repo}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{currentRepo?.owner}</span>
              <ChevronRight size={12} style={{ color: 'var(--border-color)', flexShrink: 0 }} />
              <span style={{ 
                color: 'var(--accent-primary)', 
                fontSize: '0.85rem', 
                fontWeight: '600',
                background: 'rgba(255,255,255,0.05)',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {currentPath || 'root'}
              </span>
            </div>
          </div>
        </div>

        <div className="explorer-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ position: 'relative', flex: '1', minWidth: '150px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Find files..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                width: '100%', 
                paddingLeft: '38px', 
                height: '45px', 
                fontSize: '0.9rem', 
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px' 
              }}
            />
          </div>

          <div className="view-toggle glass" style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setViewMode('list')}
              style={{ 
                padding: '8px', 
                borderRadius: '8px', 
                border: 'none', 
                background: viewMode === 'list' ? '#fff' : 'transparent', 
                color: viewMode === 'list' ? '#000' : '#fff' 
              }}
            >
              <ListIcon size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              style={{ 
                padding: '8px', 
                borderRadius: '8px', 
                border: 'none', 
                background: viewMode === 'grid' ? '#fff' : 'transparent', 
                color: viewMode === 'grid' ? '#000' : '#fff' 
              }}
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button 
              onClick={() => setIsUploading(!isUploading)} 
              style={{ 
                flex: 1,
                height: '45px', 
                background: '#fff', 
                color: '#000', 
                fontWeight: '700',
                padding: '0 1rem',
                fontSize: '0.9rem'
              }}
            >
              <Upload size={18} /> Upload
            </button>
            
            <button 
              className="secondary" 
              onClick={handleCreateFolder} 
              style={{ flex: 1, height: '45px', padding: '0 1rem', fontSize: '0.9rem' }}
            >
              <FolderPlus size={18} /> Folder
            </button>

            <button 
              onClick={handleRefresh}
              className="secondary"
              style={{ width: '45px', height: '45px', padding: 0, borderRadius: '12px', flexShrink: 0 }}
            >
              <RefreshCw size={18} className={loading ? 'spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          color: '#ef4444', 
          padding: '1rem', 
          borderRadius: '12px', 
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <span>{error}</span>
          <button onClick={handleRefresh} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Retry</button>
        </div>
      )}

      {isUploading && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <Uploader onComplete={() => setIsUploading(false)} />
        </motion.div>
      )}

      {loading && contents.length === 0 ? (
        <div className={viewMode === 'grid' ? 'explorer-grid' : 'explorer-list'}>
          {[...Array(viewMode === 'grid' ? 8 : 10)].map((_, i) => (
            viewMode === 'grid' ? <GridItemSkeleton key={i} /> : <FileItemSkeleton key={i} />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode + (contents?.length || 0)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={viewMode === 'grid' ? 'explorer-grid' : 'explorer-list'}
          >
            {filteredContents?.map((item, idx) => (
              <motion.div
                key={item.sha}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => item.type === 'dir' ? handleFolderClick(item.path) : handleFileClick(item)}
                className={`item-card glass ${viewMode}`}
              >
                {viewMode === 'list' ? (
                  <div className="list-content">
                    <div className="item-main">
                      {getFileIcon(item.type, item.name)}
                      <span className="item-name">{item.name}</span>
                    </div>
                    <div className="item-meta">
                      {item.type === 'file' && <span className="item-size">{(item.size / 1024).toFixed(1)} KB</span>}
                      <button className="item-action"><MoreVertical size={16} /></button>
                    </div>
                  </div>
                ) : (
                  <div className="grid-content">
                    {item.type === 'file' && isImage(item.name) ? (
                      <div className="image-thumb">
                        <img src={item.download_url} alt="" loading="lazy" />
                      </div>
                    ) : (
                      <div className="icon-wrapper">
                        {getFileIcon(item.type, item.name)}
                      </div>
                    )}
                    <span className="grid-name">{item.name}</span>
                    {item.type === 'dir' && <div className="dir-tag">DIR</div>}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {selectedFile && (
        <FilePreview file={selectedFile} onClose={() => setSelectedFile(null)} />
      )}

      <style>{`
        .explorer-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .explorer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1.5rem;
        }
        .item-card {
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--border-color);
          overflow: hidden;
        }
        .item-card:hover {
          border-color: #fff;
          background: rgba(255,255,255,0.05);
          transform: translateY(-2px);
        }
        .list-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
        }
        .item-main {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .item-name {
          font-weight: 500;
          font-size: 1rem;
        }
        .item-meta {
          display: flex;
          align-items: center;
          gap: 2rem;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .grid-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          height: 100%;
          position: relative;
        }
        .image-thumb {
          width: 100%;
          aspect-ratio: 16/10;
          background: #080808;
          border-radius: 10px;
          overflow: hidden;
        }
        .image-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.85;
          transition: opacity 0.3s;
        }
        .item-card:hover .image-thumb img {
          opacity: 1;
        }
        .icon-wrapper {
          padding: 1.25rem;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
        }
        .grid-name {
          font-size: 0.9rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          text-align: center;
        }
        .dir-tag {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 0.7rem;
          background: rgba(255,255,255,0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 800;
        }
        .main-loader {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255,255,255,0.05);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 1s infinite cubic-bezier(0.5, 0, 0.5, 1);
        }
        .spin {
          animation: spin 1s infinite linear;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FileExplorer;
