import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { getJobById, getSeekerProfile, saveApplication, getApplicationsBySeeker } from "@/lib/mockData";
import { Application } from "@/types";
import { Briefcase, MapPin, Upload } from "lucide-react";

const JobDetails = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(getJobById(jobId!));
  const [isApplying, setIsApplying] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (!job) {
      navigate("/jobs");
      return;
    }
    if (user && user.role === 'job_seeker') {
      const applications = getApplicationsBySeeker(user.id);
      setHasApplied(applications.some(app => app.jobId === jobId));
    }
  }, [job, jobId, navigate, user]);

  const handleApply = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login as a job seeker to apply",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (user.role !== 'job_seeker') {
      toast({
        title: "Error",
        description: "Only job seekers can apply for jobs",
        variant: "destructive",
      });
      return;
    }

    const profile = getSeekerProfile(user.id);
    if (!profile) {
      toast({
        title: "Profile Required",
        description: "Please complete your profile before applying",
        variant: "destructive",
      });
      navigate("/profile");
      return;
    }

    if (!resumeFile) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume",
        variant: "destructive",
      });
      return;
    }

    const application: Application = {
      id: `app_${Date.now()}`,
      jobId: jobId!,
      seekerId: user.id,
      seekerName: profile.name,
      seekerEmail: profile.email,
      resumeUrl: `mock_resume_${resumeFile.name}`,
      answers: job?.customQuestions?.length ? answers : undefined,
      matchScore: Math.floor(Math.random() * 30) + 70,
      appliedAt: new Date().toISOString(),
      status: 'pending',
    };

    saveApplication(application);
    setIsApplying(false);
    setHasApplied(true);
    toast({
      title: "Application Submitted!",
      description: "Your application has been sent to the recruiter",
    });
  };

  if (!job) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl mb-2">{job.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 text-base">
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {job.organizationName}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                </CardDescription>
              </div>
              {hasApplied ? (
                <Button disabled>Already Applied</Button>
              ) : (
                <Dialog open={isApplying} onOpenChange={setIsApplying}>
                  <DialogTrigger asChild>
                    <Button size="lg">Apply Now</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Apply for {job.title}</DialogTitle>
                      <DialogDescription>Upload your resume and answer any additional questions</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="resume">Upload Resume *</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <Input
                            id="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                          <label htmlFor="resume" className="cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {resumeFile ? resumeFile.name : "Click to upload PDF or DOC"}
                            </p>
                          </label>
                        </div>
                      </div>

                      {job.customQuestions?.map((question, index) => (
                        <div key={index} className="space-y-2">
                          <Label>{question}</Label>
                          <Textarea
                            value={answers[question] || ""}
                            onChange={(e) => setAnswers({ ...answers, [question]: e.target.value })}
                            rows={3}
                          />
                        </div>
                      ))}

                      <Button onClick={handleApply} className="w-full" size="lg">
                        Submit Application
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Job Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-primary/10 text-primary rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Link to="/jobs">
                <Button variant="outline">← Back to Jobs</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobDetails;
