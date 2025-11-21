import { useState ,useRef} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import authHero from "@/assets/In progress-pana.png";


const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("job_seeker");
  const [loading, setLoading] = useState(false);

  // 🔹 Forgot Password Steps
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [step, setStep] = useState(1); // 1=Email, 2=OTP, 3=New Password
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

 //m
 const inputsRef = useRef<HTMLInputElement[]>([]);
const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));

  const navigate = useNavigate();
  const { toast } = useToast();
  
  //with backend auth functions
  const { login, signup, sendOtp, verifyOtp, resetPassword, checkEmailExists } = useAuth();

  // 🔹 Validate Email Format
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 🔹 Login / Signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast({ title: "Error", description: "Invalid email address", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          toast({ title: "Welcome Back", description: "Login successful!" , className: "animate-fade-in bg-green-500 text-white border-green-800"});
          navigate("/dashboard");
        } else {
          toast({ title: "Error", description: "Invalid email or password", variant: "destructive", className: "animate-fade-in bg-red-500 text-white border-red-800" });
        }
      } else {
        await signup(email, password, role);
        toast({ title: "Success", description: "Account created successfully!" , className: "animate-fade-in bg-green-500 text-white border-green-800" });
        navigate("/dashboard");
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" , className: "animate-fade-in bg-red-500 text-white border-red-800"});
    }

    setLoading(false);
  };

  // 🔹 Forgot Password Flow
  const handleSendOtp = async () => {
      console.log("🔹 handleSendOtp called for:", email);
    if (!validateEmail(email)) {
      toast({ title: "Error", description: "Enter a valid email", variant: "destructive" });
      
      console.log("❌ Invalid email format");
      return;
    }

    if (!checkEmailExists(email)) {
      toast({ title: "Error", description: "Email not registered", variant: "destructive" });
      
       console.log("❌ Email not found in users list");
      return;
    }
console.log("✅ Email looks valid and registered, sending OTP...");
    setLoading(true);
    const success = await sendOtp(email);
    setLoading(false);

    if (success) {
      toast({ title: "OTP Sent", description: "Check your email for the verification code" });
      console.log("✅ OTP sent successfully, moving to step 2");
      setStep(2);
    } else {
      toast({ title: "Error", description: "Failed to send OTP", variant: "destructive" });
       console.log("❌ Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast({ title: "Error", description: "Please enter the OTP", variant: "destructive" });
      return;
    }

    setLoading(true);
    const success = await verifyOtp(email, otp);
    setLoading(false);

    if (success) {
      toast({ title: "Verified", description: "OTP verified successfully" });
      setStep(3);
    } else {
      toast({ title: "Error", description: "Invalid OTP", variant: "destructive" });
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6 ) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    const success = await resetPassword(email, newPassword);
    setLoading(false);

    if (success) {
      toast({ title: "Success", description: "Password changed successfully" });
      setShowForgotPassword(false);
      setStep(1);
      setEmail("");
      setNewPassword("");
      setOtp("");
    } else {
      toast({ title: "Error", description: "Failed to reset password", variant: "destructive" });
    }
  };


  //m
  const focusInput = (index: number) => {
  const el = inputsRef.current[index];
  if (el) el.focus();
};

const handleOtpChange = (value: string, index: number) => {
  // فقط رقم واحد
  const digit = value.replace(/\D/g, "").slice(-1);
  setOtpDigits(prev => {
    const next = [...prev];
    next[index] = digit;
    return next;
  });

  // لو فيه رقم انتقلي للي بعده
  if (digit && index < 5) {
    focusInput(index + 1);
  }
};

const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
  const key = e.key;
  if (key === "Backspace") {
    if (otpDigits[index]) {
      // لو الخانة فيها رقم، مسحه بس (default behavior) -> ولأننا نسيب onChange يتكفل، نسمح بالحدث
      setOtpDigits(prev => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
    } else if (index > 0) {
      // لو الخانة فاضية، انقل الفوكس للقبلي
      e.preventDefault(); // عشان ما يحصل سلوك غير مرغوب
      focusInput(index - 1);
      setOtpDigits(prev => {
        const next = [...prev];
        next[index - 1] = ""; // تمسح السابق عشان يسهل الكتابة
        return next;
      });
    }
  } else if (key === "ArrowLeft" && index > 0) {
    e.preventDefault();
    focusInput(index - 1);
  } else if (key === "ArrowRight" && index < 5) {
    e.preventDefault();
    focusInput(index + 1);
  }
};

const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  e.preventDefault();
  const pasted = e.clipboardData.getData("Text").replace(/\D/g, "").slice(0, 6);
  if (!pasted) return;
  const digits = pasted.split("");
  setOtpDigits(prev => {
    const next = [...prev];
    for (let i = 0; i < 6; i++) {
      next[i] = digits[i] ?? "";
    }
    return next;
  });
  // فوكس لآخر خانة المملوءة أو الخانة الأخيرة
  const lastFilled = Math.min(pasted.length, 6) - 1;
  focusInput(Math.max(0, lastFilled));
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
                <div className="space-y-2">
                  <Label>I am a</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="job_seeker"
                        checked={role === "job_seeker"}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span>Job Seeker</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="recruiter"
                        checked={role === "recruiter"}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span>Recruiter</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="user@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
              </Button>

              {isLogin && (
                <Button
                  type="button"
                  variant="link"
                  className="w-full mt-2"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setStep(1);
                  }}
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
                }}
                className="text-primary hover:text-accent transition-colors text-sm font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img src={authHero} alt="Authentication" className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-gray-800 px-12">
          <div>
            <h2 className="text-5xl font-bold mb-4">Welcome to Upply</h2>
            <p className="text-lg text-gray-900/90">
            Your smart career companion is ready — just <span className="text-white text-3xl" >log in</span>
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
         

          {step === 1 && (
            <div className="space-y-4">

 <DialogHeader className=" mb-7">
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your registered email..
            </DialogDescription>
          </DialogHeader>



              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button className="w-full" onClick={handleSendOtp} disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          )}
{/* الاصل */}
          {/* {step === 2 && (
            <div className="space-y-4">
              <Label>Enter OTP</Label>
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button className="w-full" onClick={handleVerifyOtp} disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          )} */}

{/* {step === 2 && (
  <div className="space-y-4">
    <Label>Enter OTP</Label>

    <div className="flex justify-between">
      {Array.from({ length: 6 }, (_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          className="w-10 h-10 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={otp[index] || ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/, ""); // يقبل أرقام فقط
            if (value) {
              const newOtp = otp.split("");
              newOtp[index] = value;
              setOtp(newOtp.join(""));

              // يتحرك تلقائيًا للخانة اللي بعدها
              const nextInput = document.querySelectorAll<HTMLInputElement>("input")[index + 1];
              if (nextInput) nextInput.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !otp[index]) {
              const prevInput = document.querySelectorAll<HTMLInputElement>("input")[index - 1];
              if (prevInput) prevInput.focus();
            }
          }}
        />
      ))}
    </div>

    <Button className="w-full" onClick={handleVerifyOtp} disabled={loading}>
      {loading ? "Verifying..." : "Verify OTP"}
    </Button>
  </div>
)} */}


{step === 2 && (
  <div className="space-y-4">
<DialogHeader className=" mb-7">
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter the 6-digit OTP sent to your email.
            </DialogDescription>
          </DialogHeader>



    <Label>Enter OTP</Label>

    <div className="flex justify-center gap-2">
      {otpDigits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el!)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete={index === 0 ? "one-time-code" : undefined}
          className="w-12 h-12 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-lg"
          value={digit}
          onChange={(e) => handleOtpChange(e.target.value, index)}
          onKeyDown={(e) => handleOtpKeyDown(e, index)}
          onPaste={handleOtpPaste}
        />
      ))}
    </div>

    <Button
      className="w-full"
      onClick={async () => {
        const code = otpDigits.join("");
        // بسيط لو حابة تتأكدي في الكونسول
        console.log("Attempting verify OTP:", code);
        if (code.length < 6) {
          toast({ title: "Error", description: "Please enter the 6-digit OTP", variant: "destructive" });
          return;
        }

        setLoading(true);
        const success = await verifyOtp(email, code);
        setLoading(false);

        if (success) {
          toast({ title: "Verified", description: "OTP verified successfully" });
          setStep(3);
        } else {
          toast({ title: "Error", description: "Invalid OTP", variant: "destructive" });
        }
      }}
      disabled={loading}
    >
      {loading ? "Verifying..." : "Verify OTP"}
    </Button>
  </div>
)}







          {step === 3 && (
            <div className="space-y-4">




<DialogHeader className=" mb-7">
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your new password below.
            </DialogDescription>
          </DialogHeader>



              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="must be at least 6 characters "
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button className="w-full" onClick={handleResetPassword} disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
