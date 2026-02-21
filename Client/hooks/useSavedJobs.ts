import { useState, useCallback } from 'react';
import { apiClient } from '@/constants/apiClient';

export type SavedJob = {
  _id: string;
  userId: string;
  jobId: string | { _id: string; [key: string]: any };
};

export function useSavedJobs(userId?: string) {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedJobs = useCallback(async () => {
    if (!userId) {
      setSavedJobs([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.get(`/saved/${userId}`);
      setSavedJobs(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const saveJob = useCallback(
    async (jobId: string) => {
      if (!userId) return;

      try {
        await apiClient.post('/saved/save', { userId, jobId });
        await fetchSavedJobs();
      } catch (err: any) {
        setError(err.message);
      }
    },
    [userId, fetchSavedJobs]
  );

  const removeJob = useCallback(
    async (jobId: string) => {
      if (!userId) return;

      try {
        await apiClient.delete('/saved/remove', { data: { userId, jobId } });
        setSavedJobs((prev) => prev.filter((job) => (typeof job.jobId === 'string' ? job.jobId : job.jobId?._id) !== jobId));
      } catch (err: any) {
        setError(err.message);
      }
    },
    [userId]
  );

  const toggleJob = useCallback(
    async (jobId: string, isSaved: boolean) => {
      if (isSaved) {
        await removeJob(jobId);
      } else {
        await saveJob(jobId);
      }
    },
    [saveJob, removeJob]
  );

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
