import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CardActivationFormProps {
  onSuccess: () => void;
}

export const CardActivationForm = ({ onSuccess }: CardActivationFormProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardPhoto, setCardPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCardPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActivation = async () => {
    if (!cardNumber.trim()) {
      toast({
        title: "Card Number Required",
        description: "Please enter your card number.",
        variant: "destructive",
      });
      return;
    }

    if (!cardPhoto) {
      toast({
        title: "Photo Required",
        description: "Please take a photo of the back of your card.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to activate your card.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if card exists and is inactive
      const { data: card, error: cardError } = await supabase
        .from('battle_cards')
        .select('*')
        .eq('card_number', cardNumber.trim())
        .eq('status', 'inactive')
        .single();

      if (cardError || !card) {
        toast({
          title: "Invalid Card",
          description: "Card number not found or already activated.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Upload photo to storage
      const fileExt = cardPhoto.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('card-photos')
        .upload(fileName, cardPhoto);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Upload Failed",
          description: "Failed to upload card photo.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('card-photos')
        .getPublicUrl(fileName);

      // Update card status
      const { error: updateError } = await supabase
        .from('battle_cards')
        .update({
          status: 'active',
          activated_by: user.id,
          activated_at: new Date().toISOString(),
        })
        .eq('id', card.id);

      if (updateError) {
        console.error('Update error:', updateError);
        toast({
          title: "Activation Failed",
          description: "Failed to activate card.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Save photo record
      const { error: photoError } = await supabase
        .from('card_activation_photos')
        .insert({
          card_id: card.id,
          user_id: user.id,
          photo_url: publicUrl,
        });

      if (photoError) {
        console.error('Photo record error:', photoError);
      }

      toast({
        title: "Card Activated!",
        description: "Your Battle Royale Card has been successfully activated.",
      });

      // Reset form
      setCardNumber('');
      setCardPhoto(null);
      setPhotoPreview(null);
      onSuccess();
    } catch (error) {
      console.error('Activation error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter your card number and take a photo of the back of your card to complete activation
      </p>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          type="text"
          placeholder="Enter last 4 digits"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          maxLength={16}
        />
      </div>

      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        {photoPreview ? (
          <div className="space-y-4">
            <img 
              src={photoPreview} 
              alt="Card back" 
              className="w-full rounded-lg"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCardPhoto(null);
                setPhotoPreview(null);
              }}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Take Another Photo
            </Button>
          </div>
        ) : (
          <label className="cursor-pointer block">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <Camera className="w-12 h-12 text-muted-foreground" />
              <div>
                <p className="font-semibold">Take Photo</p>
                <p className="text-xs text-muted-foreground">
                  Click to use camera
                </p>
              </div>
            </div>
          </label>
        )}
      </div>

      <Button 
        onClick={handleActivation}
        className="w-full bg-gradient-primary"
        disabled={!cardPhoto || !cardNumber.trim() || isLoading}
      >
        {isLoading ? 'Activating...' : 'Activate Card'}
      </Button>
    </div>
  );
};
