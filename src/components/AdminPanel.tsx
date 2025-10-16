import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Users, Shield } from 'lucide-react';
import { AdminCardManagement } from './AdminCardManagement';

export const AdminPanel = () => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-victory rounded-full flex items-center justify-center">
          <Shield className="w-5 h-5 text-victory-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <Badge variant="outline" className="border-victory text-victory">
            Administrator Access
          </Badge>
        </div>
      </div>

      <AdminCardManagement />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Player Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Manage players, view statistics, and moderate gameplay.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Game Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Configure game rules, maps, and server settings.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-victory" />
              Security Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Monitor security, ban players, and review reports.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};