import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import authHero from "@/assets/auth-hero.jpg";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("job_seeker");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signup, resetPassword, checkEmailExists } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
          navigate("/dashboard");
        } else {
          toast({
            title: "Error",
            description: "Invalid email or password",
            variant: "destructive",
          });
        }
      } else {
        await signup(email, password, role);
        toast({
          title: "Account Created",
          description: "Your account has been created successfully",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (forgotPasswordStep === 'email') {
      if (!resetEmail.trim() || !resetEmail.includes('@')) {
        toast({
          title: 'Error',
          description: 'Please enter a valid email address',
          variant: 'destructive',
        });
        return;
      }

      if (!checkEmailExists(resetEmail)) {
        toast({
          title: 'Error',
          description: 'No account found with this email address',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Verification code sent! (Mock: automatically verified)',
      });
      setForgotPasswordStep('verify');
      
      // In a real app, this would send an email with a reset link/code
      // For mock purposes, we auto-advance after a brief delay
      setTimeout(() => {
        setForgotPasswordStep('reset');
      }, 1500);
    } else if (forgotPasswordStep === 'reset') {
      if (newPassword.length < 6) {
        toast({
          title: 'Error',
          description: 'Password must be at least 6 characters',
          variant: 'destructive',
        });
        return;
      }

      if (newPassword !== confirmNewPassword) {
        toast({
          title: 'Error',
          description: 'Passwords do not match',
          variant: 'destructive',
        });
        return;
      }

      const success = await resetPassword(resetEmail, newPassword);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Password reset successfully! Please log in with your new password.',
        });
        setShowForgotPassword(false);
        setResetEmail('');
        setNewPassword('');
        setConfirmNewPassword('');
        setForgotPasswordStep('email');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to reset password. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Fill in your details to get started"}
            </p>
          </div>

          <Card className="p-8 shadow-lg border-border/50 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2 animate-scale-in">
                  <Label className="text-sm font-medium">I am a</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="job_seeker"
                        checked={role === "job_seeker"}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm">Job Seeker</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="recruiter"
                        checked={role === "recruiter"}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm">Recruiter</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-all focus:shadow-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-all focus:shadow-md"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2 animate-scale-in">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="transition-all focus:shadow-md"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover:shadow-lg"
                disabled={loading}
              >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
              </Button>

              {isLogin && (
                <Button
                  type="button"
                  variant="link"
                  className="w-full mt-2"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </Button>
              )}
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setRole("job_seeker");
                }}
                className="text-primary hover:text-accent transition-colors text-sm font-medium"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 mix-blend-multiply" />
        <img
          src={authHero}
          alt="Authentication"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-12 backdrop-blur-sm bg-black/20 rounded-2xl mx-12 animate-fade-in">
            <h2 className="text-5xl font-bold mb-4">
              Welcome to Our Platform
            </h2>
            <p className="text-xl text-white/90">
              Experience the power of modern authentication
            </p>
          </div>
        </div>
      </div>

      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              {forgotPasswordStep === 'email' && 'Enter your email address to receive a password reset link'}
              {forgotPasswordStep === 'verify' && 'Verifying your email...'}
              {forgotPasswordStep === 'reset' && 'Enter your new password'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {forgotPasswordStep === 'email' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="your@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
                <Button onClick={handleForgotPassword} className="w-full">
                  Send Reset Link
                </Button>
              </>
            )}

            {forgotPasswordStep === 'verify' && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Verifying your email address...</p>
              </div>
            )}

            {forgotPasswordStep === 'reset' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                  <Input
                    id="confirm-new-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleForgotPassword} className="w-full">
                  Reset Password
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
