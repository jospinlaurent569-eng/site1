import { Play } from 'lucide-react';

export function VideoSection() {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Notre <span className="text-gradient-fire">savoir-faire</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment nous préparons votre bois de chauffage avec des équipements professionnels pour vous garantir une qualité optimale.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-warm bg-muted">
            <iframe
              src="https://www.youtube.com/embed/zVfjdSqCyc0?rel=0"
              title="Machine à fendre le bois - Bois de Chauffe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Fendeuse de bois professionnelle - Préparation de bûches de qualité
          </p>
        </div>
      </div>
    </section>
  );
}
