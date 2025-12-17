import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: 'Inscription réussie !',
      description: 'Vous recevrez nos meilleures offres par email.',
    });
    
    setEmail('');
    setIsLoading(false);
  };

  return (
    <section className="py-16 md:py-24 gradient-fire">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 mb-6">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Offres Exclusives
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Inscrivez-vous pour recevoir nos promotions sur le bois de chauffage et profiter de 5% de réduction sur votre première commande.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground"
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              {isLoading ? 'Inscription...' : "S'inscrire"}
            </Button>
          </form>

          <p className="text-xs text-primary-foreground/60 mt-4">
            En vous inscrivant, vous acceptez notre politique de confidentialité. Désabonnement possible à tout moment.
          </p>
        </div>
      </div>
    </section>
  );
}
