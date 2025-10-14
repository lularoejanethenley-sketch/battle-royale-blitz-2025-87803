import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-game-island.jpg";

export function GameHero() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <Badge 
          variant="secondary" 
          className="mb-6 px-4 py-2 text-lg font-bold animate-bounce-in bg-gradient-primary border-0"
        >
          Launching July 22, 2025 at 12 AM
        </Badge>
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-hero bg-clip-text text-transparent animate-float">
          BATTLE ZONE
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Drop into the ultimate battle royale experience. Build, fight, and survive on a dynamic island 
          where only the strongest claim victory. Get ready for intense combat and endless possibilities.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="gaming" 
            size="lg" 
            onClick={() => navigate('/game')}
            className="text-xl px-8 py-4"
          >
            <Gamepad2 className="mr-2 h-6 w-6" />
            Play Now
          </Button>
          <Button variant="outline" size="lg" className="text-xl px-8 py-4 border-primary bg-background/20 backdrop-blur-sm">
            Watch Trailer
          </Button>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">100</div>
            <div className="text-muted-foreground">Players Per Match</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary">∞</div>
            <div className="text-muted-foreground">Building Possibilities</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent">1</div>
            <div className="text-muted-foreground">Victory Royale</div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-secondary rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-3 h-3 bg-accent rounded-full animate-float opacity-80" style={{ animationDelay: '2s' }}></div>
    </section>
  );
}