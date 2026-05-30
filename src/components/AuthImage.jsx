import React, { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Image as ImageIcon } from 'lucide-react';

// In-memory cache to prevent refetching images on navigation
const imageCache = new Map();

const AuthImage = ({ file, token, className, style, alt }) => {
  const [objectUrl, setObjectUrl] = useState(imageCache.get(file.sha) || null);
  const [loading, setLoading] = useState(!imageCache.has(file.sha));
  const [error, setError] = useState(false);

  useEffect(() => {
    if (imageCache.has(file.sha)) {
      setObjectUrl(imageCache.get(file.sha));
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchImage = async () => {
      try {
        setLoading(true);
        // Using file.url with correct Accept header to get raw content
        const response = await fetch(file.url, {
          headers: token ? {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3.raw'
          } : {
            Accept: 'application/vnd.github.v3.raw'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        if (isMounted) {
          const url = URL.createObjectURL(blob);
          imageCache.set(file.sha, url);
          setObjectUrl(url);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching authenticated image:', err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [file.url, file.sha, token]);

  if (error) {
    return (
      <div 
        className={className} 
        style={{ 
          ...style, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'rgba(255,255,255,0.02)', 
          color: 'var(--text-muted)' 
        }}
      >
        <ImageIcon size={24} style={{ opacity: 0.5 }} />
      </div>
    );
  }

  if (loading || !objectUrl) {
    return (
      <div 
        className={`auth-image-skeleton ${className || ''}`}
        style={{ 
          ...style, 
          background: 'rgba(255,255,255,0.05)', 
          animation: 'pulse 1.5s infinite',
        }}
      />
    );
  }

  return (
    <LazyLoadImage
      alt={alt || file.name}
      src={objectUrl}
      effect="blur"
      className={className}
      style={{ ...style }}
      wrapperProps={{
        style: { display: 'block', width: '100%', height: '100%' }
      }}
    />
  );
};

export default AuthImage;
