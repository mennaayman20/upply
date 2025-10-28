import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, Plus, Users } from "lucide-react";
import { getJobs, getApplicationsBySeeker, getSeekerProfile, getRecruiterProfile } from "@/lib/mockData";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) return null;

  const isSeeker = user.role === 'job_seeker';
  const seekerProfile = isSeeker ? getSeekerProfile(user.id) : null;
  const recruiterProfile = !isSeeker ? getRecruiterProfile(user.id) : null;
  const myApplications = isSeeker ? getApplicationsBySeeker(user.id) : [];
  const myJobs = !isSeeker ? getJobs().filter(j => j.recruiterId === user.id) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {isSeeker ? seekerProfile?.name : recruiterProfile?.organizationName || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            {isSeeker ? 'Find your dream job' : 'Manage your job postings'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isSeeker ? (
            <>
              <Card className="hover-scale cursor-pointer" onClick={() => navigate('/profile')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    My Profile
                  </CardTitle>
                  <CardDescription>
                    {seekerProfile ? 'Update your profile' : 'Complete your profile to apply'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    {seekerProfile ? 'Edit Profile' : 'Create Profile'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover-scale cursor-pointer" onClick={() => navigate('/jobs')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Browse Jobs
                  </CardTitle>
                  <CardDescription>
                    Explore {getJobs().length} available positions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Find Jobs</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    My Applications
                  </CardTitle>
                  <CardDescription>Track your job applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{myApplications.length}</p>
                  <p className="text-sm text-muted-foreground">Total applications</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="hover-scale cursor-pointer" onClick={() => navigate('/recruiter-profile')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Company Profile
                  </CardTitle>
                  <CardDescription>
                    {recruiterProfile ? 'Manage your organization' : 'Create your profile'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    {recruiterProfile ? 'Edit Profile' : 'Create Profile'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover-scale cursor-pointer" onClick={() => navigate('/create-job')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Post a Job
                  </CardTitle>
                  <CardDescription>Create a new job listing</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Create Job</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    My Job Postings
                  </CardTitle>
                  <CardDescription>Manage active listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{myJobs.length}</p>
                  <p className="text-sm text-muted-foreground">Active jobs</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {!isSeeker && myJobs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Recent Job Postings</h2>
            <div className="grid gap-4">
              {myJobs.slice(0, 3).map(job => (
                <Card key={job.id} className="hover-scale">
                  <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>{job.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {job.requiredSkills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <Link to={`/applicants/${job.id}`}>
                      <Button variant="outline" size="sm">
                        <Users className="w-4 h-4 mr-2" />
                        View Applicants
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
