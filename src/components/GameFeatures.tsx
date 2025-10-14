import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "Dynamic Building",
    description: "Master the art of construction with unlimited building possibilities. Create fortresses, bridges, and tactical structures in real-time combat.",
    badge: "Core Feature",
    color: "primary"
  },
  {
    title: "100 Player Battles",
    description: "Drop into massive multiplayer battles with up to 100 players. Every match is unique with dynamic storm patterns and loot spawns.",
    badge: "Multiplayer",
    color: "secondary"
  },
  {
    title: "Epic Weapons Arsenal",
    description: "Discover legendary weapons, explosive devices, and game-changing items. From assault rifles to rocket launchers.",
    badge: "Combat",
    color: "accent"
  },
  {
    title: "Evolving Island",
    description: "Battle on a living, breathing island that changes with each season. New locations, secrets, and challenges await.",
    badge: "World",
    color: "victory"
  },
  {
    title: "Team Strategy",
    description: "Squad up with friends or go solo. Coordinate strategies, share resources, and dominate the competition together.",
    badge: "Social",
    color: "primary"
  },
  {
    title: "Victory Royale",
    description: "Be the last player or team standing to claim the ultimate prize. Every victory is earned through skill and strategy.",
    badge: "Achievement",
    color: "secondary"
  }
];

export function GameFeatures() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Game Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the ultimate battle royale with cutting-edge mechanics, 
            stunning visuals, and endless replayability.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-glow animate-bounce-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    variant="secondary" 
                    className={`bg-gradient-to-r from-${feature.color} to-${feature.color}-glow text-${feature.color}-foreground border-0`}
                  >
                    {feature.badge}
                  </Badge>
                  <div className={`w-2 h-2 rounded-full bg-${feature.color} animate-pulse`}></div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}