import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import useApiRequest from "@/hooks/useApiRequest";

const Admin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@enyard.cloud");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setToken, setUser } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { post } = useApiRequest();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await post("/admin/login", {
        email,
        password,
      });

      // Extract data from response
      const loginData = response && response.data ? response.data : response;
      if (loginData && loginData.token) {
        const { token, user } = loginData;
        // Store token and user in localStorage for persistence
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(user));
        // Set all auth state at once
        setToken(token);
        setUser(user);
        // Explicitly set authenticated state
        useAuthStore.setState({ 
          isAuthenticated: true,
          token: token,
          user: user,
          isLoading: false
        });
        toast({
          title: "Login Successful",
          description: "Welcome to Admin Dashboard",
        });
        // Navigate immediately - state is set
        navigate("/admin");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TabsContent value="admin">
      <Card className="glass border-0 shadow-enyard">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Secure access for ENYARD administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@enyard.cloud"
                className="glass"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="glass pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button className="w-full" variant="secondary" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Access Admin Panel"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Admin;
