import React, { createContext, useState, useContext, useEffect } from 'react';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeInnovation, setActiveInnovation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Autocomplete Suggestions Fetching with Cache/Debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/suggestions?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data.success) {
          setSuggestions(data.suggestions || []);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.warn("Error fetching suggestions:", err);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Execute unified validation and search flow
  const executeSearch = async (searchTerm) => {
    const term = (searchTerm || query).trim();
    if (!term || term.length < 2) return;

    // Immediately update input values everywhere
    setQuery(term);
    setLoading(true);
    setError(null);
    setActiveInnovation(null);

    // 1. Client-Side Spam and Personal Name validations
    const personalNames = [
      'arjun', 'sharma', 'amit', 'vijay', 'john', 'smith', 'brown', 'davis',
      'kumar', 'singh', 'patel', 'sharma', 'gupta', 'mehta', 'shroff', 'praveen', 'sandeep',
      'rahul', 'deepak', 'rohit', 'sanjay', 'anil', 'sunil', 'neha', 'pooja', 'sneha'
    ];
    const isSpam = /^[^\w\s]+$/.test(term) || /^\d+$/.test(term) || /(.)\1\1\1/.test(term) || /[bcdfghjklmnpqrstvwxz]{5,}/.test(term);
    const words = term.toLowerCase().split(/\s+/);
    const isName = words.length > 0 && words.every(w => personalNames.includes(w));

    if (isSpam || isName) {
      setLoading(false);
      setError("No verified innovation found.");
      return;
    }

    try {
      // 2. Validate and load Core SWOT and Revival analysis from server
      const analyzeRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: term, description: `RAG search verification for ${term}` })
      });

      if (!analyzeRes.ok) {
        setLoading(false);
        setError("No verified innovation found.");
        return;
      }

      const analyzeData = await analyzeRes.json();
      if (!analyzeData.success || !analyzeData.report) {
        setLoading(false);
        setError("No verified innovation found.");
        return;
      }

      const report = analyzeData.report;

      // 3. Parallel fetch to Patent registry, research publications, and GitHub code repos
      const [patentsRes, papersRes, githubRes] = await Promise.allSettled([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/patents?query=${encodeURIComponent(term)}`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/search-papers?query=${encodeURIComponent(term)}`),
        fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(term)}`)
      ]);

      let patentsList = [];
      if (patentsRes.status === 'fulfilled' && patentsRes.value.ok) {
        const patentsData = await patentsRes.value.json();
        if (patentsData.success) patentsList = patentsData.data || [];
      }

      let papersList = [];
      if (papersRes.status === 'fulfilled' && papersRes.value.ok) {
        const papersData = await papersRes.value.json();
        if (papersData.success) papersList = papersData.data || [];
      }

      let githubList = [];
      if (githubRes.status === 'fulfilled' && githubRes.value.ok) {
        const githubData = await githubRes.value.json();
        githubList = (githubData.items || []).slice(0, 5).map(item => ({
          name: item.name,
          fullName: item.full_name,
          description: item.description,
          stars: item.stargazers_count,
          url: item.html_url
        }));
      }

      // 4. Merge API responses into one cohesive innovation payload
      const unifiedInnovation = {
        ...report,
        patents: patentsList,
        papers: papersList,
        githubRepos: githubList
      };

      setActiveInnovation(unifiedInnovation);
    } catch (err) {
      console.error("Search execution error:", err);
      setError("Unable to retrieve verified innovation data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContext.Provider value={{
      query,
      setQuery,
      suggestions,
      setSuggestions,
      activeInnovation,
      setActiveInnovation,
      loading,
      error,
      executeSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
};
