import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Truck, Shield, Leaf } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-warm" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-ember/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-slide-up">
            <span className="animate-pulse">🔥</span>
            Marketplace N°1 du chauffage en Europe
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-slide-up animation-delay-100">
            Chauffez-vous{' '}
            <span className="text-gradient-fire">naturellement</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up animation-delay-200">
            Découvrez notre sélection de bois de chauffage, poêles et accessoires. 
            Livraison partout en Europe, sans création de compte.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-300">
            <Link to="/products">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                Explorer le catalogue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/products?category=firewood">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Voir le bois de chauffage
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-8 animate-slide-up animation-delay-400">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-5 w-5 text-primary" />
              <span>Livraison Europe</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-primary" />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Leaf className="h-5 w-5 text-primary" />
              <span>Bois certifié PEFC</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
