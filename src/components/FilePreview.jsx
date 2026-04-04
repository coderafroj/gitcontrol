import React, { useState, useEffect } from 'react';
import { useGitHub } from '../context/GitHubContext';
import { X, Download, Maximize2, FileText, ImageIcon, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilePreview = ({ file, onClose }) => {
  const { currentRepo, token } = useGitHub();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileType, setFileType] = useState('text');

  useEffect(() => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      setFileType('image');
      setLoading(false);
    } else if (ext === 'pdf') {
      setFileType('pdf');
      setLoading(false);
    } else {
      setFileType('code');
      fetchFileContent();
    }
  }, [file]);

  const fetchFileContent = async () => {
    try {
      const response = await fetch(file.url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      const decoded = atob(data.content.replace(/\n/g, ''));
      setContent(decoded);
    } catch (err) {
      console.error('Error fetching file:', err);
      setContent('Error loading file content.');
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading preview...</div>;

    switch (fileType) {
      case 'image':
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', background: '#000' }}>
            <img 
              src={file.download_url} 
              alt={file.name} 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
            />
          </div>
        );
      case 'pdf':
        return (
          <iframe 
            src={`${file.download_url}#toolbar=0`} 
            style={{ width: '100%', height: '100%', border: 'none' }}
            title={file.name}
          />
        );
      case 'code':
        return (
          <div style={{ padding: '20px', background: '#0f172a', height: '100%', overflow: 'auto' }}>
            <pre style={{ 
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', 
              fontSize: '0.9rem', 
              color: '#cbd5e1',
              lineHeight: '1.6'
            }}>
              <code>{content}</code>
            </pre>
          </div>
        );
      default:
        return <div>Unsupported file type</div>;
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <header style={{
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.9)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {fileType === 'image' && <ImageIcon size={20} />}
            {fileType === 'pdf' && <FileText size={20} />}
            {fileType === 'code' && <FileCode size={20} />}
            <span style={{ fontWeight: '500' }}>{file.name}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a 
              href={file.download_url} 
              download 
              className="secondary"
              style={{ padding: '8px', borderRadius: '8px', color: 'inherit' }}
            >
              <Download size={20} />
            </a>
            <button 
              onClick={onClose}
              className="secondary"
              style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: '#ef4444' }}
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="glass"
            style={{ 
              width: '90%', 
              height: '90%', 
              margin: 'auto',
              overflow: 'hidden',
              background: 'var(--bg-primary)',
              borderRadius: '24px'
            }}
          >
            {renderPreview()}
          </motion.div>
        </main>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilePreview;
