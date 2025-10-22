import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Shield, LogIn, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminLogin = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-card border border-border shadow-card">
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (user && isAdmin) {
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
            Logged in as {user.email}
          </p>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (user && !isAdmin) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-card border border-border shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-foreground">Not an Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            You are logged in as {user.email}, but you don't have admin privileges.
          </p>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
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
        <CardTitle className="text-foreground">Admin Access</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center mb-4">
          Sign in to access admin features
        </p>
        <Button 
          onClick={() => navigate('/auth')}
          className="w-full"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Button>
      </CardContent>
    </Card>
  );
};