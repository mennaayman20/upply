import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getJobById, getApplicationsByJob } from "@/lib/mockData";
import { Application } from "@/types";
import { FileText, Mail, TrendingUp } from "lucide-react";

const Applicants = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(getJobById(jobId!));
  const [applicants, setApplicants] = useState<Application[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user && user.role !== 'recruiter') {
      navigate("/dashboard");
      return;
    }
    if (!job || (user && job.recruiterId !== user.id)) {
      navigate("/dashboard");
      return;
    }

    const apps = getApplicationsByJob(jobId!);
    const sorted = apps.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    setApplicants(sorted);
  }, [job, jobId, user, isLoading, navigate]);

  if (isLoading || !user || !job) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/dashboard">
            <Button variant="outline" className="mb-4">← Back to Dashboard</Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Applicants for {job.title}</h1>
          <p className="text-muted-foreground">{applicants.length} total applications</p>
        </div>

        <div className="grid gap-4">
          {applicants.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">No applications yet</p>
              </CardContent>
            </Card>
          ) : (
            applicants.map((applicant) => (
              <Card key={applicant.id} className="hover-scale animate-fade-in">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{applicant.seekerName}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" />
                        {applicant.seekerEmail}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          Match Score
                        </div>
                        <p className="text-2xl font-bold text-primary">{applicant.matchScore}%</p>
                      </div>
                      <Badge variant={
                        applicant.status === 'accepted' ? 'default' :
                        applicant.status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {applicant.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Resume</p>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Resume (Mock)
                      </Button>
                    </div>
                    
                    {applicant.answers && Object.keys(applicant.answers).length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Custom Answers</p>
                        <div className="space-y-2">
                          {Object.entries(applicant.answers).map(([question, answer]) => (
                            <div key={question} className="p-3 bg-muted rounded">
                              <p className="text-sm font-medium mb-1">{question}</p>
                              <p className="text-sm text-muted-foreground">{answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Applied {new Date(applicant.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Applicants;
