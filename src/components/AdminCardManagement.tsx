import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BattleCard {
  id: string;
  card_number: string;
  status: string;
  activated_at: string | null;
  created_at: string;
}

export const AdminCardManagement = () => {
  const [cards, setCards] = useState<BattleCard[]>([]);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const { data, error } = await supabase
      .from('battle_cards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cards:', error);
      toast({
        title: "Error",
        description: "Failed to load cards.",
        variant: "destructive",
      });
      return;
    }

    setCards(data || []);
  };

  const handleAddCard = async () => {
    if (!newCardNumber.trim()) {
      toast({
        title: "Card Number Required",
        description: "Please enter a card number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from('battle_cards')
      .insert({
        card_number: newCardNumber.trim(),
        status: 'inactive',
      });

    if (error) {
      console.error('Error adding card:', error);
      toast({
        title: "Error",
        description: error.message.includes('duplicate') 
          ? "Card number already exists." 
          : "Failed to add card.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "Card Added",
      description: "New card has been added successfully.",
    });

    setNewCardNumber('');
    fetchCards();
    setIsLoading(false);
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    const { error } = await supabase
      .from('battle_cards')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting card:', error);
      toast({
        title: "Error",
        description: "Failed to delete card.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Card Deleted",
      description: "Card has been removed successfully.",
    });

    fetchCards();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      inactive: "secondary",
      blocked: "destructive",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Card */}
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="newCard">Add New Card</Label>
            <Input
              id="newCard"
              type="text"
              placeholder="Enter card number (e.g., last 4 digits)"
              value={newCardNumber}
              onChange={(e) => setNewCardNumber(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleAddCard} 
              disabled={isLoading}
              className="bg-gradient-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </div>
        </div>

        {/* Cards Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Card Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activated At</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No cards found. Add your first card above.
                  </TableCell>
                </TableRow>
              ) : (
                cards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell className="font-mono">{card.card_number}</TableCell>
                    <TableCell>{getStatusBadge(card.status)}</TableCell>
                    <TableCell>
                      {card.activated_at 
                        ? new Date(card.activated_at).toLocaleDateString() 
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {new Date(card.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCard(card.id)}
                        disabled={card.status === 'active'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
