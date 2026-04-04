import React from 'react';

export const RepoCardSkeleton = () => (
  <div className="card skeleton-card">
    <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '10px', marginBottom: '1.5rem' }}></div>
    <div className="skeleton-line skeleton" style={{ width: '60%', height: '24px' }}></div>
    <div className="skeleton-line skeleton" style={{ width: '90%', height: '14px', marginTop: '1rem' }}></div>
    <div className="skeleton-line skeleton" style={{ width: '40%', height: '14px', marginTop: '0.5rem' }}></div>
    <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
      <div className="skeleton" style={{ width: '60px', height: '24px', borderRadius: '6px' }}></div>
      <div className="skeleton" style={{ width: '60px', height: '24px', borderRadius: '6px' }}></div>
    </div>
  </div>
);

export const FileItemSkeleton = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div className="skeleton" style={{ width: '20px', height: '20px', borderRadius: '4px' }}></div>
      <div className="skeleton" style={{ width: '150px', height: '16px' }}></div>
    </div>
    <div className="skeleton" style={{ width: '60px', height: '14px' }}></div>
  </div>
);

export const GridItemSkeleton = () => (
  <div className="glass" style={{ aspectRatio: '1/1', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
    <div className="skeleton" style={{ width: '100%', height: '60%', borderRadius: '10px' }}></div>
    <div className="skeleton" style={{ width: '80%', height: '14px' }}></div>
  </div>
);
