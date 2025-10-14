import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trophy, Heart, Target } from 'lucide-react';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [stats, setStats] = useState({ eliminations: 0, survived: 0, placement: 0 });
  const gameLoopRef = useRef<number>();

  useEffect(() => {
    if (gameState !== 'playing' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    // Game constants
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 600;
    const PLAYER_SIZE = 20;
    const ENEMY_SIZE = 18;
    const BULLET_SIZE = 5;
    const ITEM_SIZE = 15;
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Game state
    const player = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      health: 100,
      speed: 3,
      weapon: 'rifle'
    };

    const keys: { [key: string]: boolean } = {};
    const bullets: Array<{ x: number; y: number; dx: number; dy: number; fromPlayer: boolean }> = [];
    const enemies: Array<{ x: number; y: number; health: number; shootCooldown: number }> = [];
    const items: Array<{ x: number; y: number; type: 'health' | 'shield' | 'weapon' }> = [];
    
    let storm = { x: 0, y: 0, radius: Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) };
    let targetStorm = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, radius: 250 };
    let eliminations = 0;
    let enemiesLeft = 20;
    let gameTime = 0;

    // Spawn enemies
    for (let i = 0; i < 20; i++) {
      enemies.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        health: 100,
        shootCooldown: 0
      });
    }

    // Spawn items
    for (let i = 0; i < 10; i++) {
      items.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        type: Math.random() > 0.6 ? 'health' : Math.random() > 0.5 ? 'shield' : 'weapon'
      });
    }

    // Input handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
      
      // Shooting
      if (e.key === ' ' && bullets.length < 10) {
        const mouseX = (e as any).clientX || CANVAS_WIDTH / 2;
        const mouseY = (e as any).clientY || CANVAS_HEIGHT / 2;
        const rect = canvas.getBoundingClientRect();
        const targetX = mouseX - rect.left;
        const targetY = mouseY - rect.top;
        const angle = Math.atan2(targetY - player.y, targetX - player.x);
        
        bullets.push({
          x: player.x,
          y: player.y,
          dx: Math.cos(angle) * 8,
          dy: Math.sin(angle) * 8,
          fromPlayer: true
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    const handleClick = (e: MouseEvent) => {
      if (bullets.length < 10) {
        const rect = canvas.getBoundingClientRect();
        const targetX = e.clientX - rect.left;
        const targetY = e.clientY - rect.top;
        const angle = Math.atan2(targetY - player.y, targetX - player.x);
        
        bullets.push({
          x: player.x,
          y: player.y,
          dx: Math.cos(angle) * 8,
          dy: Math.sin(angle) * 8,
          fromPlayer: true
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleClick);

    // Game loop
    const gameLoop = () => {
      gameTime++;
      
      // Clear canvas
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw grid
      ctx.strokeStyle = '#0f3460';
      ctx.lineWidth = 1;
      for (let i = 0; i < CANVAS_WIDTH; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let i = 0; i < CANVAS_HEIGHT; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_WIDTH, i);
        ctx.stroke();
      }

      // Update storm
      if (gameTime % 180 === 0) {
        targetStorm.radius = Math.max(100, targetStorm.radius - 50);
        targetStorm.x = CANVAS_WIDTH / 2 + (Math.random() - 0.5) * 100;
        targetStorm.y = CANVAS_HEIGHT / 2 + (Math.random() - 0.5) * 100;
      }
      
      storm.x += (targetStorm.x - storm.x) * 0.005;
      storm.y += (targetStorm.y - storm.y) * 0.005;
      storm.radius += (targetStorm.radius - storm.radius) * 0.005;

      // Draw storm
      ctx.save();
      ctx.fillStyle = 'rgba(138, 43, 226, 0.3)';
      ctx.beginPath();
      ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.arc(storm.x, storm.y, storm.radius, 0, Math.PI * 2, true);
      ctx.fill('evenodd');
      ctx.restore();

      // Move player
      if (keys['w'] || keys['arrowup']) player.y -= player.speed;
      if (keys['s'] || keys['arrowdown']) player.y += player.speed;
      if (keys['a'] || keys['arrowleft']) player.x -= player.speed;
      if (keys['d'] || keys['arrowright']) player.x += player.speed;

      player.x = Math.max(PLAYER_SIZE, Math.min(CANVAS_WIDTH - PLAYER_SIZE, player.x));
      player.y = Math.max(PLAYER_SIZE, Math.min(CANVAS_HEIGHT - PLAYER_SIZE, player.y));

      // Storm damage to player
      const distFromStorm = Math.sqrt(Math.pow(player.x - storm.x, 2) + Math.pow(player.y - storm.y, 2));
      if (distFromStorm > storm.radius) {
        player.health -= 0.5;
      }

      // Draw player
      ctx.fillStyle = '#4ecca3';
      ctx.beginPath();
      ctx.arc(player.x, player.y, PLAYER_SIZE, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Update and draw enemies
      enemies.forEach((enemy, index) => {
        if (enemy.health <= 0) return;

        // AI movement
        const distToPlayer = Math.sqrt(Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2));
        const distFromStorm = Math.sqrt(Math.pow(enemy.x - storm.x, 2) + Math.pow(enemy.y - storm.y, 2));
        
        // Move away from storm or toward player
        if (distFromStorm > storm.radius - 50) {
          const angle = Math.atan2(storm.y - enemy.y, storm.x - enemy.x);
          enemy.x += Math.cos(angle) * 2;
          enemy.y += Math.sin(angle) * 2;
        } else if (distToPlayer < 200 && distToPlayer > 100) {
          const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
          enemy.x += Math.cos(angle) * 1.5;
          enemy.y += Math.sin(angle) * 1.5;
        }

        // Storm damage
        if (distFromStorm > storm.radius) {
          enemy.health -= 1;
        }

        // Enemy shooting
        enemy.shootCooldown--;
        if (distToPlayer < 250 && enemy.shootCooldown <= 0) {
          const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
          bullets.push({
            x: enemy.x,
            y: enemy.y,
            dx: Math.cos(angle) * 5,
            dy: Math.sin(angle) * 5,
            fromPlayer: false
          });
          enemy.shootCooldown = 60 + Math.random() * 40;
        }

        // Draw enemy
        if (enemy.health > 0) {
          ctx.fillStyle = '#e94560';
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, ENEMY_SIZE, 0, Math.PI * 2);
          ctx.fill();
          
          // Health bar
          ctx.fillStyle = '#ff0000';
          ctx.fillRect(enemy.x - 15, enemy.y - 25, 30, 3);
          ctx.fillStyle = '#00ff00';
          ctx.fillRect(enemy.x - 15, enemy.y - 25, (enemy.health / 100) * 30, 3);
        }
      });

      // Update and draw bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        // Remove bullets outside canvas
        if (bullet.x < 0 || bullet.x > CANVAS_WIDTH || bullet.y < 0 || bullet.y > CANVAS_HEIGHT) {
          bullets.splice(i, 1);
          continue;
        }

        // Check collisions
        if (bullet.fromPlayer) {
          enemies.forEach((enemy) => {
            if (enemy.health > 0) {
              const dist = Math.sqrt(Math.pow(bullet.x - enemy.x, 2) + Math.pow(bullet.y - enemy.y, 2));
              if (dist < ENEMY_SIZE) {
                enemy.health -= 35;
                bullets.splice(i, 1);
                if (enemy.health <= 0) {
                  eliminations++;
                  enemiesLeft--;
                }
              }
            }
          });
        } else {
          const dist = Math.sqrt(Math.pow(bullet.x - player.x, 2) + Math.pow(bullet.y - player.y, 2));
          if (dist < PLAYER_SIZE) {
            player.health -= 15;
            bullets.splice(i, 1);
          }
        }

        // Draw bullet
        ctx.fillStyle = bullet.fromPlayer ? '#ffeb3b' : '#ff5722';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, BULLET_SIZE, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw and collect items
      items.forEach((item, index) => {
        const dist = Math.sqrt(Math.pow(player.x - item.x, 2) + Math.pow(player.y - item.y, 2));
        if (dist < PLAYER_SIZE + ITEM_SIZE) {
          if (item.type === 'health') player.health = Math.min(100, player.health + 30);
          items.splice(index, 1);
          return;
        }

        ctx.fillStyle = item.type === 'health' ? '#4ecca3' : item.type === 'shield' ? '#3498db' : '#f39c12';
        ctx.fillRect(item.x - ITEM_SIZE / 2, item.y - ITEM_SIZE / 2, ITEM_SIZE, ITEM_SIZE);
      });

      // Draw HUD
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`HP: ${Math.max(0, Math.floor(player.health))}`, 20, 30);
      ctx.fillText(`Eliminations: ${eliminations}`, 20, 60);
      ctx.fillText(`Alive: ${enemiesLeft + 1}`, 20, 90);
      
      // Game over conditions
      if (player.health <= 0) {
        setStats({ eliminations, survived: gameTime, placement: enemiesLeft + 2 });
        setGameState('gameover');
        return;
      }

      if (enemiesLeft === 0) {
        setStats({ eliminations, survived: gameTime, placement: 1 });
        setGameState('gameover');
        return;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('click', handleClick);
    };
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setStats({ eliminations: 0, survived: 0, placement: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col items-center justify-center p-4">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      {gameState === 'menu' && (
        <Card className="p-8 max-w-md w-full bg-gradient-card border-primary/20">
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Battle Royale
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Survive the storm, eliminate enemies, and be the last one standing!
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm">WASD or Arrow Keys to move</span>
            </div>
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm">Click or Spacebar to shoot</span>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm">Collect green items for health</span>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-sm">Stay inside the safe zone</span>
            </div>
          </div>

          <Button 
            onClick={startGame} 
            size="lg" 
            className="w-full bg-gradient-primary hover:shadow-glow"
          >
            Drop In!
          </Button>
        </Card>
      )}

      {gameState === 'playing' && (
        <div className="flex flex-col items-center gap-4">
          <canvas
            ref={canvasRef}
            className="border-4 border-primary/30 rounded-lg shadow-intense"
          />
          <p className="text-muted-foreground text-sm">
            Click on the game or press SPACE to shoot
          </p>
        </div>
      )}

      {gameState === 'gameover' && (
        <Card className="p-8 max-w-md w-full bg-gradient-card border-primary/20">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-primary bg-clip-text text-transparent">
            {stats.placement === 1 ? 'Victory Royale!' : 'Game Over'}
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center p-3 bg-background/50 rounded">
              <span className="text-muted-foreground">Placement:</span>
              <span className="font-bold text-primary text-xl">#{stats.placement}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-background/50 rounded">
              <span className="text-muted-foreground">Eliminations:</span>
              <span className="font-bold text-xl">{stats.eliminations}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-background/50 rounded">
              <span className="text-muted-foreground">Time Survived:</span>
              <span className="font-bold text-xl">{Math.floor(stats.survived / 60)}s</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={startGame} 
              size="lg" 
              className="w-full bg-gradient-primary hover:shadow-glow"
            >
              Play Again
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              size="lg" 
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Game;
