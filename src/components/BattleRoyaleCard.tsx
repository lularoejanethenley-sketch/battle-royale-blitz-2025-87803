import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Shield, Zap, Trophy, Sparkles, Camera } from 'lucide-react';
import { CardActivationForm } from './CardActivationForm';

export const BattleRoyaleCard = () => {
  const [showActivation, setShowActivation] = useState(false);

  const cardBenefits = [
    {
      icon: <Trophy className="w-5 h-5 text-secondary" />,
      title: "Victory Rewards",
      description: "Earn 3x points on gaming purchases"
    },
    {
      icon: <Shield className="w-5 h-5 text-primary" />,
      title: "Battle Protection",
      description: "Fraud protection and purchase security"
    },
    {
      icon: <Zap className="w-5 h-5 text-accent" />,
      title: "Lightning Speed",
      description: "Instant transactions for in-game purchases"
    },
    {
      icon: <Sparkles className="w-5 h-5 text-victory" />,
      title: "Exclusive Access",
      description: "Early access to new Battle Zone features"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-secondary text-secondary">
            Sponsored by Citibank
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Battle Royale Card
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get your exclusive Battle Zone themed Citibank card and unlock premium gaming rewards
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Card Preview */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              {/* Card Design */}
              <div className="bg-gradient-hero rounded-2xl p-8 shadow-intense transform hover:scale-105 transition-transform duration-300">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-white font-bold text-xl">Battle Royale</h3>
                    <p className="text-white/80 text-sm">Citibank Rewards Card</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-white/60 text-xs mb-1">CARD NUMBER</div>
                  <div className="text-white font-mono text-lg tracking-wider">
                    •••• •••• •••• 2025
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-white/60 text-xs mb-1">CARDHOLDER</div>
                    <div className="text-white font-semibold">BATTLE CHAMPION</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/60 text-xs mb-1">EXPIRES</div>
                    <div className="text-white font-semibold">08/29</div>
                  </div>
                </div>
                
                {/* Battle Zone Logo Area */}
                <div className="absolute top-4 right-4 opacity-20">
                  <div className="text-white text-xs font-bold">BATTLE ZONE</div>
                </div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-hero rounded-2xl blur-xl opacity-30 -z-10"></div>
            </div>
          </div>

          {/* Benefits & Application */}
          <div className="space-y-8">
            <div className="grid gap-4">
              {cardBenefits.map((benefit, index) => (
                <Card key={index} className="bg-gradient-card border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{benefit.icon}</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full bg-gradient-primary hover:shadow-glow"
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfBi62gFTJPQYsI-8x719rJLbRS87fgoUakAnrXo2W1M-arJg/viewform?usp=header', '_blank')}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Apply for Battle Royale Card
              </Button>

              <Dialog open={showActivation} onOpenChange={setShowActivation}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Activate Your Card
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Activate Your Battle Royale Card
                    </DialogTitle>
                  </DialogHeader>
                  <CardActivationForm onSuccess={() => setShowActivation(false)} />
                </DialogContent>
              </Dialog>

              <p className="text-xs text-muted-foreground text-center">
                * Credit approval required. Terms and conditions apply. 
                Battle Zone rewards program subject to change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};