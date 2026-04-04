import React, { useCallback, useState } from 'react';
import { useGitHub } from '../context/GitHubContext';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Uploader = ({ onComplete }) => {
  const { currentRepo, currentPath, uploadFile, loading } = useGitHub();
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [message, setMessage] = useState('Added multiple files');
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(acceptedFiles => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    setStatus('idle');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxSize: 100 * 1024 * 1024 // 100MB
  });

  const removeFile = (name) => {
    setFiles(files.filter(f => f.name !== name));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setStatus('uploading');
    setProgress(10);
    
    try {
      let completed = 0;
      for (const file of files) {
        await uploadFile(currentRepo.owner, currentRepo.repo, currentPath, file, message);
        completed++;
        setProgress(Math.round((completed / files.length) * 100));
      }
      setStatus('success');
      setTimeout(() => {
        setFiles([]);
        setStatus('idle');
        setProgress(0);
        if (onComplete) onComplete();
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="uploader-card card glass" style={{ 
      padding: '2.5rem', 
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid var(--border-color)',
      borderRadius: '24px'
    }}>
      <div 
        {...getRootProps()} 
        style={{
          border: '2px dashed rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragActive ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.2)',
          borderColor: isDragActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <input {...getInputProps()} />
        <div style={{ 
          width: '64px', 
          height: '64px', 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: 'var(--accent-primary)'
        }}>
          <Upload size={32} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          {isDragActive ? 'Drop to upload' : 'Upload to GitHub'}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          File limit: 100MB • Target: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{currentPath || 'root'}</code>
        </p>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginTop: '2.5rem', overflow: 'hidden' }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>Queue ({files.length})</span>
                <button onClick={() => setFiles([])} className="secondary" style={{ fontSize: '0.8rem', border: 'none', background: 'transparent' }}>Clear all</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '150px', overflowY: 'auto', paddingRight: '10px' }}>
                {files.map(file => (
                  <div 
                    key={file.name}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <File size={16} />
                      <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button 
                      onClick={() => removeFile(file.name)}
                      className="secondary" 
                      style={{ padding: '6px', border: 'none', background: 'transparent' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '500', display: 'block', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Commit Message</label>
              <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Briefly describe your changes..."
                style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            {status === 'uploading' && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                  <span>Uploading files...</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    style={{ height: '100%', background: 'var(--accent-primary)' }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleUpload} 
                disabled={status === 'uploading'}
                style={{ 
                  flex: 1, 
                  justifyContent: 'center', 
                  height: '48px',
                  background: status === 'success' ? '#10b981' : '#fff',
                  color: '#000',
                  fontWeight: '700'
                }}
              >
                {status === 'uploading' ? (
                  <div className="loader" style={{ width: '18px', height: '18px', borderTopColor: '#000' }}></div>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 size={18} /> Success
                  </>
                ) : status === 'error' ? (
                  <>
                    <AlertCircle size={18} /> Try Again
                  </>
                ) : (
                  <>Push {files.length} {files.length === 1 ? 'File' : 'Files'}</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Uploader;
