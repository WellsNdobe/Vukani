import JobPost from '@/components/JobPost';
import { useAuth } from '@/context/authContext';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import React, { useEffect } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';

export default function Saved() {
  const { user } = useAuth();
  const { savedJobs, loading, error, fetchSavedJobs } = useSavedJobs(user?._id);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  if (!user?._id) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 }}>
        <Text style={{ fontSize: 16, color: '#444', textAlign: 'center' }}>Log in to view your saved jobs.</Text>
      </View>
    );
  }

  if (loading && savedJobs.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {error ? <Text style={{ color: '#b00020', padding: 16 }}>{error}</Text> : null}
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchSavedJobs} />}
      >
        {savedJobs.length === 0 ? (
          <Text style={{ color: '#666' }}>No saved jobs yet.</Text>
        ) : (
          savedJobs.map((savedJob) => {
            const job = typeof savedJob.jobId === 'string' ? null : savedJob.jobId;
            if (!job?._id) return null;

            return (
              <JobPost
                key={savedJob._id}
                _id={job._id}
                companyLogo={job.companyLogo}
                jobTitle={job.jobTitle}
                companyName={job.companyName ?? 'Company'}
                location={job.location}
                timestamp={job.timestamp}
                salary={job.salary}
                jobType={job.jobType}
                description={job.description}
                userId={user._id}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
