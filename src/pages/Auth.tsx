import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Heart, Shield, Sparkles, Zap } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp(email, password, firstName, lastName);
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-gradient-bg floating-elements relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/3 blur-3xl"></div>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Header with logo and tagline */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="health-gradient text-4xl font-bold mb-2">
              NIROGI-AI
            </h1>
            <p className="text-white/80 text-lg">
              Your wellness journey starts here
            </p>
          </div>

          {/* Main auth card */}
          <Card className="auth-card border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-white text-2xl font-bold">
                Welcome
              </CardTitle>
              <CardDescription className="text-white/70">
                Access your personalized health dashboard
              </CardDescription>
            </CardHeader>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <CardContent className="p-6">
                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/90">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white/90">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="premium"
                      className="w-full mt-6"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white/90">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white/90">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/90">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white/90">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="premium"
                      className="w-full mt-6"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </CardContent>
            </Tabs>

            <CardFooter className="flex flex-col pb-6">
              <div className="flex items-center justify-center space-x-4 text-white/60 text-xs">
                <span>•</span>
                <span>Secure</span>
                <span>•</span>
                <span>Private</span>
                <span>•</span>
                <span>HIPAA Compliant</span>
                <span>•</span>
              </div>
              <p className="text-xs text-center text-white/50 mt-3">
                By continuing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </CardFooter>
          </Card>

          {/* Bottom features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="text-white/80">
              <Shield className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs">Secure</p>
            </div>
            <div className="text-white/80">
              <Heart className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs">Wellness</p>
            </div>
            <div className="text-white/80">
              <Sparkles className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs">AI-Powered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
