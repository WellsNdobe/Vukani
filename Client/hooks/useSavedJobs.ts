import { useState, useCallback } from 'react';
import axios from 'axios';

type SavedJob = {
  _id: string;
  userId: string;
  jobId: string;
};

export function useSavedJobs(userId: string) {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch saved jobs
  const fetchSavedJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/saved/${userId}`);
      setSavedJobs(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Save job
  const saveJob = useCallback(async (jobId: string) => {
    try {
      await axios.post(`/api/saved`, { userId, jobId });
      setSavedJobs((prev) => [...prev, { _id: jobId, userId, jobId } as SavedJob]);
    } catch (err: any) {
      setError(err.message);
    }
  }, [userId]);

  // Remove saved job
  const removeJob = useCallback(async (jobId: string) => {
    try {
      await axios.delete(`/api/saved`, { data: { userId, jobId } });
      setSavedJobs((prev) => prev.filter((job) => job.jobId !== jobId));
    } catch (err: any) {
      setError(err.message);
    }
  }, [userId]);

  // Toggle save
  const toggleJob = useCallback(async (jobId: string, isSaved: boolean) => {
    if (isSaved) {
      await removeJob(jobId);
    } else {
      await saveJob(jobId);
    }
  }, [saveJob, removeJob]);

  return {
    savedJobs,
    loading,
    error,
    fetchSavedJobs,
    saveJob,
    removeJob,
    toggleJob,
  };
}
