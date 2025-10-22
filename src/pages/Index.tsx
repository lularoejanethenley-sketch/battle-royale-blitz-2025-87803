import { GameHero } from "@/components/GameHero";
import { CountdownTimer } from "@/components/CountdownTimer";
import { GameFeatures } from "@/components/GameFeatures";
import { BattleRoyaleCard } from "@/components/BattleRoyaleCard";
import { CardLookupForm } from "@/components/CardLookupForm";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminPanel } from "@/components/AdminPanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <GameHero />
      <CountdownTimer />
      <BattleRoyaleCard />
      <GameFeatures />
      
      {/* Card Lookup Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-primary bg-clip-text text-transparent">
            Card Services
          </h2>
          <CardLookupForm />
        </div>
      </section>
      
      {/* Admin Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-primary bg-clip-text text-transparent">
            Admin Access
          </h2>
          <div className="space-y-8">
            <AdminLogin />
            <AdminPanel />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
