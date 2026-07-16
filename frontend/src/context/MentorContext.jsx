import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSearch } from './SearchContext';

const MentorContext = createContext();

export const useMentor = () => useContext(MentorContext);

export const MentorProvider = ({ children }) => {
  const { activeInnovation } = useSearch();

  // Active Project Profile
  const [project, setProject] = useState({
    name: 'Obsolete Project Revival',
    description: 'Applying modern AI models and waveguide display panels to reconstruct defunct technical concepts.',
    sector: 'General Tech'
  });

  // Automatically sync project profile when active search result changes
  useEffect(() => {
    if (activeInnovation) {
      setProject({
        name: activeInnovation.name || 'Custom Concept',
        description: activeInnovation.description || 'Revival roadmap vectors compiled under Invenza AI.',
        sector: activeInnovation.sector || 'General Tech'
      });
      // Reset completed milestones to initial state for a new search
      setCompletedMilestones(new Set(['Idea', 'Research']));
    }
  }, [activeInnovation]);

  // The 15 stages of technical innovation progress tracking
  const milestoneStages = [
    'Idea', 'Research', 'Problem Validation', 'Market Research', 'Patent Research',
    'Technology Selection', 'Architecture', 'Design', 'Development', 'Testing',
    'Prototype', 'Documentation', 'Presentation', 'Submission', 'Deployment'
  ];

  const [completedMilestones, setCompletedMilestones] = useState(new Set(['Idea', 'Research']));
  const [progressPercent, setProgressPercent] = useState(13);

  // Re-calculate completion percent whenever milestone checklist shifts
  useEffect(() => {
    const total = milestoneStages.length;
    const completed = completedMilestones.size;
    setProgressPercent(Math.round((completed / total) * 100));
  }, [completedMilestones]);

  const toggleMilestone = (stage) => {
    setCompletedMilestones(prev => {
      const next = new Set(prev);
      if (next.has(stage)) {
        next.delete(stage);
      } else {
        next.add(stage);
      }
      return next;
    });
  };

  // Code Reviewer State & Calls
  const [codeReview, setCodeReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const runCodeReview = async (codeString) => {
    setReviewLoading(true);
    setCodeReview(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/code-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeString })
      });
      const data = await res.json();
      if (data.success) {
        setCodeReview(data.reviews || []);
      }
    } catch (err) {
      console.error("Code review execution failed:", err);
      setCodeReview([{
        type: "quality",
        severity: "medium",
        title: "Audit Connection Offline",
        desc: "Unable to contact code scanner nodes. Standardizing syntax review templates locally."
      }]);
    } finally {
      setReviewLoading(false);
    }
  };

  // Documentation Compiler State & Calls
  const [docs, setDocs] = useState({});
  const [docsLoading, setDocsLoading] = useState(false);

  const fetchDocument = async (docType) => {
    setDocsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/generate-docs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: project.name, docType })
      });
      const data = await res.json();
      if (data.success) {
        setDocs(prev => ({ ...prev, [docType]: data.docContent }));
      }
    } catch (err) {
      console.error("Documentation generation failed:", err);
    } finally {
      setDocsLoading(false);
    }
  };

  return (
    <MentorContext.Provider value={{
      project,
      setProject,
      milestoneStages,
      completedMilestones,
      progressPercent,
      toggleMilestone,
      codeReview,
      reviewLoading,
      runCodeReview,
      docs,
      docsLoading,
      fetchDocument
    }}>
      {children}
    </MentorContext.Provider>
  );
};
