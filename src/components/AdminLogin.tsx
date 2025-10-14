import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/contexts/AdminContext';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAdmin, logout } = useAdmin();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    
    if (success) {
      toast({
        title: "Admin Access Granted",
        description: "Welcome, Administrator!",
      });
      setPassword('');
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect admin password",
        variant: "destructive",
      });
    }
  };

  if (isAdmin) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-card border border-border shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-victory rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-victory-foreground" />
          </div>
          <CardTitle className="text-victory">Admin Access Active</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            You are currently logged in as an administrator
          </p>
          <Button 
            onClick={logout}
            variant="outline"
            className="w-full"
          >
            Logout Admin
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-card border border-border shadow-card">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-accent-foreground" />
        </div>
        <CardTitle className="text-foreground">Admin Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Admin Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
          <Button type="submit" className="w-full">
            Login as Admin
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};