export type UserRole = 'job_seeker' | 'recruiter';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface JobSeekerProfile {
  userId: string;
  name: string;
  university: string;
  email: string;
  phone: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  skills: string[];
  experience: string;
  projects: string;
  resumeUrl?: string;
}

export interface RecruiterProfile {
  userId: string;
  organizationName: string;
  organizationUrl: string;
  about: string;
  contactEmail: string;
}

export interface Job {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  requiredSkills: string[];
  location: string;
  organizationName: string;
  customQuestions?: string[];
  createdAt: string;
  status: 'active' | 'closed';
}

export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  seekerName: string;
  seekerEmail: string;
  resumeUrl?: string;
  answers?: Record<string, string>;
  matchScore?: number;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
}
