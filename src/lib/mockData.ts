import { Job, JobSeekerProfile, RecruiterProfile, Application } from '@/types';

const STORAGE_KEYS = {
  JOBS: 'upply_jobs',
  SEEKER_PROFILES: 'upply_seeker_profiles',
  RECRUITER_PROFILES: 'upply_recruiter_profiles',
  APPLICATIONS: 'upply_applications',
};

// Jobs
export const getJobs = (): Job[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.JOBS);
  return stored ? JSON.parse(stored) : [];
};

export const saveJob = (job: Job) => {
  const jobs = getJobs();
  const index = jobs.findIndex(j => j.id === job.id);
  if (index >= 0) {
    jobs[index] = job;
  } else {
    jobs.push(job);
  }
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
};

export const deleteJob = (jobId: string) => {
  const jobs = getJobs().filter(j => j.id !== jobId);
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
};

export const getJobById = (jobId: string): Job | undefined => {
  return getJobs().find(j => j.id === jobId);
};

// Job Seeker Profiles
export const getSeekerProfile = (userId: string): JobSeekerProfile | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.SEEKER_PROFILES);
  const profiles: JobSeekerProfile[] = stored ? JSON.parse(stored) : [];
  return profiles.find(p => p.userId === userId) || null;
};

export const saveSeekerProfile = (profile: JobSeekerProfile) => {
  const stored = localStorage.getItem(STORAGE_KEYS.SEEKER_PROFILES);
  const profiles: JobSeekerProfile[] = stored ? JSON.parse(stored) : [];
  const index = profiles.findIndex(p => p.userId === profile.userId);
  
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  localStorage.setItem(STORAGE_KEYS.SEEKER_PROFILES, JSON.stringify(profiles));
};

// Recruiter Profiles
export const getRecruiterProfile = (userId: string): RecruiterProfile | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.RECRUITER_PROFILES);
  const profiles: RecruiterProfile[] = stored ? JSON.parse(stored) : [];
  return profiles.find(p => p.userId === userId) || null;
};

export const saveRecruiterProfile = (profile: RecruiterProfile) => {
  const stored = localStorage.getItem(STORAGE_KEYS.RECRUITER_PROFILES);
  const profiles: RecruiterProfile[] = stored ? JSON.parse(stored) : [];
  const index = profiles.findIndex(p => p.userId === profile.userId);
  
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  localStorage.setItem(STORAGE_KEYS.RECRUITER_PROFILES, JSON.stringify(profiles));
};

// Applications
export const getApplications = (): Application[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
  return stored ? JSON.parse(stored) : [];
};

export const saveApplication = (application: Application) => {
  const applications = getApplications();
  applications.push(application);
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
};

export const getApplicationsByJob = (jobId: string): Application[] => {
  return getApplications().filter(app => app.jobId === jobId);
};

export const getApplicationsBySeeker = (seekerId: string): Application[] => {
  return getApplications().filter(app => app.seekerId === seekerId);
};
