import React, { createContext, useContext, useState, useEffect } from 'react';
import { Octokit } from 'octokit';

const GitHubContext = createContext();

export const useGitHub = () => useContext(GitHubContext);

export const GitHubProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('gh_token') || '');
  const [octokit, setOctokit] = useState(null);
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [currentRepo, setCurrentRepo] = useState(null);
  const [currentPath, setCurrentPath] = useState('');
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});

  useEffect(() => {
    if (token) {
      const octo = new Octokit({ auth: token });
      setOctokit(octo);
      localStorage.setItem('gh_token', token);
      fetchUser(octo);
    } else {
      setOctokit(null);
      setUser(null);
      localStorage.removeItem('gh_token');
    }
  }, [token]);

  const fetchUser = async (octo) => {
    try {
      setLoading(true);
      const { data } = await octo.rest.users.getAuthenticated();
      setUser(data);
      fetchRepos(octo);
    } catch (err) {
      setError('Invalid token or network error');
      setToken('');
    } finally {
      setLoading(false);
    }
  };

  const fetchRepos = async (octo) => {
    try {
      setLoading(true);
      const { data } = await octo.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100,
      });
      setRepos(data);
    } catch (err) {
      setError('Failed to fetch repositories');
    } finally {
      setLoading(false);
    }
  };

  const fetchContents = async (owner, repo, path = '', refresh = false) => {
    if (!octokit || !owner || !repo) {
      if (!owner || !repo) {
        setCurrentRepo(null);
        setCurrentPath('');
        setContents([]);
      }
      return;
    }

    const cacheKey = `${owner}/${repo}/${path}`;
    if (!refresh && cache[cacheKey]) {
      setContents(cache[cacheKey]);
      setCurrentPath(path);
      setCurrentRepo({ owner, repo });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: path.replace(/^\//, ''),
      });
      const contentData = Array.isArray(data) ? data : [data];
      setContents(contentData);
      setCache(prev => ({ ...prev, [cacheKey]: contentData }));
      setCurrentPath(path);
      setCurrentRepo({ owner, repo });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch folder contents: ' + (err.status === 404 ? 'Path not found' : err.message));
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (owner, repo, path, folderName) => {
    if (!octokit) return;
    try {
      setLoading(true);
      const fullPath = `${path}/${folderName}/.gitkeep`.replace(/^\/+/g, '');
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: fullPath,
        message: `Create folder: ${folderName}`,
        content: btoa(''), // Empty file
      });
      await fetchContents(owner, repo, path, true); // Force refresh
    } catch (err) {
      setError('Failed to create folder: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (owner, repo, path, file, message = 'Uploaded via GitControl') => {
    if (!octokit) return;
    try {
      setLoading(true);
      setError(null);
      
      const fileName = file.name;
      const cleanPath = `${path}/${fileName}`.replace(/^\/+/g, '');

      // Convert file to base64
      const reader = new FileReader();
      const content = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Check for existing file SHA
      let sha = undefined;
      try {
        const { data } = await octokit.rest.repos.getContent({ owner, repo, path: cleanPath });
        sha = data.sha;
      } catch (e) {}

      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: cleanPath,
        message,
        content,
        sha,
      });

      await fetchContents(owner, repo, path, true); // Force refresh
    } catch (err) {
      console.error(err);
      setError('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setOctokit(null);
    setUser(null);
    setRepos([]);
    setCurrentRepo(null);
    setCurrentPath('');
    setContents([]);
  };

  const value = {
    token,
    setToken,
    user,
    repos,
    currentRepo,
    setCurrentRepo,
    currentPath,
    contents,
    loading,
    error,
    setError,
    fetchContents,
    createFolder,
    uploadFile,
    logout,
  };

  return <GitHubContext.Provider value={value}>{children}</GitHubContext.Provider>;
};
