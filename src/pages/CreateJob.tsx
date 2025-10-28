import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { getJobById, saveJob, getRecruiterProfile } from "@/lib/mockData";
import { Job } from "@/types";
import { Plus, Save, X } from "lucide-react";

const CreateJob = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Partial<Job>>({
    requiredSkills: [],
    customQuestions: [],
    status: 'active',
  });
  const [skillInput, setSkillInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user && user.role !== 'recruiter') {
      navigate("/dashboard");
      return;
    }
    if (jobId) {
      const existing = getJobById(jobId);
      if (existing && user && existing.recruiterId === user.id) {
        setJob(existing);
      }
    } else if (user) {
      const profile = getRecruiterProfile(user.id);
      setJob({
        recruiterId: user.id,
        organizationName: profile?.organizationName || "",
        requiredSkills: [],
        customQuestions: [],
        status: 'active',
      });
    }
  }, [user, isLoading, navigate, jobId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!job.title || !job.description || !job.location || !job.organizationName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const fullJob: Job = {
      id: jobId || `job_${Date.now()}`,
      recruiterId: user.id,
      title: job.title!,
      description: job.description!,
      requiredSkills: job.requiredSkills || [],
      location: job.location!,
      organizationName: job.organizationName!,
      customQuestions: job.customQuestions,
      createdAt: job.createdAt || new Date().toISOString(),
      status: job.status || 'active',
    };

    saveJob(fullJob);
    toast({
      title: "Success!",
      description: jobId ? "Job updated successfully" : "Job posted successfully",
    });
    navigate("/dashboard");
  };

  const addSkill = () => {
    if (skillInput.trim() && !job.requiredSkills?.includes(skillInput.trim())) {
      setJob({ ...job, requiredSkills: [...(job.requiredSkills || []), skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setJob({ ...job, requiredSkills: job.requiredSkills?.filter(s => s !== skill) });
  };

  const addQuestion = () => {
    if (questionInput.trim()) {
      setJob({ ...job, customQuestions: [...(job.customQuestions || []), questionInput.trim()] });
      setQuestionInput("");
    }
  };

  const removeQuestion = (index: number) => {
    setJob({ ...job, customQuestions: job.customQuestions?.filter((_, i) => i !== index) });
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl">{jobId ? 'Edit Job' : 'Create Job Posting'}</CardTitle>
            <CardDescription>Fill in the details to post a new job</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={job.title || ""}
                  onChange={(e) => setJob({ ...job, title: e.target.value })}
                  placeholder="Senior Software Engineer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={job.location || ""}
                  onChange={(e) => setJob({ ...job, location: e.target.value })}
                  placeholder="Remote / San Francisco, CA"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={job.description || ""}
                  onChange={(e) => setJob({ ...job, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills</Label>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="e.g., React, Python, AWS"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.requiredSkills?.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-primary/70">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="questions">Custom Application Questions</Label>
                <div className="flex gap-2">
                  <Input
                    id="questions"
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    placeholder="e.g., Why do you want to work here?"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQuestion())}
                  />
                  <Button type="button" onClick={addQuestion}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {job.customQuestions?.map((question, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="flex-1 text-sm">{question}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Save className="w-4 h-4 mr-2" />
                {jobId ? 'Update Job' : 'Post Job'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateJob;
