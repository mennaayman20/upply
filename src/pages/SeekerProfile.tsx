import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { getSeekerProfile, saveSeekerProfile } from "@/lib/mockData";
import { JobSeekerProfile } from "@/types";
import { Save } from "lucide-react";

const SeekerProfile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Partial<JobSeekerProfile>>({
    skills: [],
  });
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user && user.role !== 'job_seeker') {
      navigate("/dashboard");
      return;
    }
    if (user) {
      const existing = getSeekerProfile(user.id);
      if (existing) {
        setProfile(existing);
      } else {
        setProfile({ userId: user.id, email: user.email, skills: [] });
      }
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!profile.name || !profile.university || !profile.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const fullProfile: JobSeekerProfile = {
      userId: user.id,
      name: profile.name!,
      university: profile.university!,
      email: profile.email!,
      phone: profile.phone || "",
      linkedIn: profile.linkedIn,
      github: profile.github,
      portfolio: profile.portfolio,
      skills: profile.skills || [],
      experience: profile.experience || "",
      projects: profile.projects || "",
      resumeUrl: profile.resumeUrl,
    };

    saveSeekerProfile(fullProfile);
    toast({
      title: "Success!",
      description: "Profile saved successfully",
    });
    navigate("/dashboard");
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills?.includes(skillInput.trim())) {
      setProfile({ ...profile, skills: [...(profile.skills || []), skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills?.filter(s => s !== skill) });
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl">Job Seeker Profile</CardTitle>
            <CardDescription>Complete your profile to apply for jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={profile.name || ""}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">University *</Label>
                <Input
                  id="university"
                  value={profile.university || ""}
                  onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                  placeholder="MIT"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email || ""}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={profile.linkedIn || ""}
                    onChange={(e) => setProfile({ ...profile, linkedIn: e.target.value })}
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={profile.github || ""}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    placeholder="github.com/johndoe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio</Label>
                  <Input
                    id="portfolio"
                    value={profile.portfolio || ""}
                    onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                    placeholder="johndoe.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="e.g., React, Python, SQL"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills?.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} <span className="text-xs">×</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  value={profile.experience || ""}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  placeholder="Describe your work experience..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projects">Projects</Label>
                <Textarea
                  id="projects"
                  value={profile.projects || ""}
                  onChange={(e) => setProfile({ ...profile, projects: e.target.value })}
                  placeholder="Describe your projects..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekerProfile;
