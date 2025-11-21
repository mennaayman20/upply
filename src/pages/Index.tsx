import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Zap, Target } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Find Your Perfect Match
          </h1> */}

          <div className="card">
  <div className="loader">
    <p>APPLY</p>
    <div className="words">
      <span className="word">Now</span>
      <span className="word">quickly</span>
      <span className="word">smartly</span>
      <span className="word">Better</span>
      <span className="word">easily</span>
    </div>
  </div>
</div>

          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
           Upply — Where applying goes next-level.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link to="/auth">
              {/* <Button size="lg" className="text-lg px-8 py-6 animate-scale-in">
                Get Started
              </Button> */}
  <div className="flex items-center justify-center">
  <div className="relative group">
    <button
      className="relative inline-block p-px font-semibold leading-6 text-white shadow-l cursor-pointer rounded-2xl shadow-emerald-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-emerald-600"
    >
      <span
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-600 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      ></span>
      <span className="relative z-10 block px-6 py-3 rounded-2xl bg-neutral-600">
        <div className="relative z-10 flex items-center space-x-3">
          <span
            className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-black"
            >Begin Journey</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-black"
          >
            <path
              d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
            ></path>
          </svg>
        </div>
      </span>
    </button>
  </div>
</div>

            </Link>
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 animate-scale-in">
                Browse Jobs
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-16">
            <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover-scale">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Easy Apply</h3>
              <p className="text-muted-foreground text-sm">
                Apply with your profile or upload resume
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover-scale">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Top Companies</h3>
              <p className="text-muted-foreground text-sm">
                Connect with leading organizations
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover-scale">
              <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Smart Match</h3>
              <p className="text-muted-foreground text-sm">
                AI-powered candidate ranking
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover-scale">
              <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Quick Process</h3>
              <p className="text-muted-foreground text-sm">
                Fast and efficient hiring
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
