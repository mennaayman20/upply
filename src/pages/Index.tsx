import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Shield, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8 animate-scale-in">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Secure Authentication Platform</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Welcome to Your App
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience seamless authentication with our modern, secure, and beautiful login system
          </p>

          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover:shadow-lg text-lg px-8 py-6 group"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="mt-24 grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all animate-fade-in">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure</h3>
              <p className="text-muted-foreground">
                Industry-standard security with encrypted authentication
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast</h3>
              <p className="text-muted-foreground">
                Lightning-fast authentication and seamless user experience
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reliable</h3>
              <p className="text-muted-foreground">
                Built with modern technologies for maximum reliability
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
