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
import { getRecruiterProfile, saveRecruiterProfile } from "@/lib/mockData";
import { RecruiterProfile } from "@/types";
import { Save } from "lucide-react";

const RecruiterProfilePage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Partial<RecruiterProfile>>({});

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user && user.role !== 'recruiter') {
      navigate("/dashboard");
      return;
    }
    if (user) {
      const existing = getRecruiterProfile(user.id);
      if (existing) {
        setProfile(existing);
      } else {
        setProfile({ userId: user.id, contactEmail: user.email });
      }
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!profile.organizationName || !profile.organizationUrl || !profile.about || !profile.contactEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const fullProfile: RecruiterProfile = {
      userId: user.id,
      organizationName: profile.organizationName!,
      organizationUrl: profile.organizationUrl!,
      about: profile.about!,
      contactEmail: profile.contactEmail!,
    };

    saveRecruiterProfile(fullProfile);
    toast({
      title: "Success!",
      description: "Profile saved successfully",
    });
    navigate("/dashboard");
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl">Recruiter Profile</CardTitle>
            <CardDescription>Set up your organization profile</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name *</Label>
                <Input
                  id="orgName"
                  value={profile.organizationName || ""}
                  onChange={(e) => setProfile({ ...profile, organizationName: e.target.value })}
                  placeholder="Acme Inc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgUrl">Organization Website *</Label>
                <Input
                  id="orgUrl"
                  type="url"
                  value={profile.organizationUrl || ""}
                  onChange={(e) => setProfile({ ...profile, organizationUrl: e.target.value })}
                  placeholder="https://acme.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Contact Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.contactEmail || ""}
                  onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
                  placeholder="hr@acme.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About Organization *</Label>
                <Textarea
                  id="about"
                  value={profile.about || ""}
                  onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                  placeholder="Tell us about your company..."
                  rows={6}
                  required
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

export default RecruiterProfilePage;
