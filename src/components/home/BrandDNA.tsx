import { Flame, Leaf, Users, Shield } from 'lucide-react';

const values = [
  {
    icon: Flame,
    title: 'Passion du Chauffage',
    description: 'Depuis des générations, nous perpétuons l\'art du chauffage au bois, alliant tradition et innovation.',
  },
  {
    icon: Leaf,
    title: 'Engagement Écologique',
    description: 'Bois issu de forêts gérées durablement, circuits courts et empreinte carbone minimisée.',
  },
  {
    icon: Users,
    title: 'Réseau de Confiance',
    description: 'Des vendeurs européens vérifiés, sélectionnés pour leur expertise et leur qualité de service.',
  },
  {
    icon: Shield,
    title: 'Qualité Certifiée',
    description: 'Chaque produit répond aux normes européennes les plus strictes en matière de sécurité.',
  },
];

export const BrandDNA = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-card to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">
            Notre ADN
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
            Robins des Bois, la Marketplace du Chauffage en Europe
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Nous connectons les meilleurs fournisseurs européens de bois de chauffage, poêles et accessoires 
            avec des clients exigeants. Notre mission : rendre le chauffage au bois accessible, 
            écologique et de qualité supérieure.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group text-center p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-5 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '15+', label: 'Pays desservis' },
            { value: '500+', label: 'Vendeurs vérifiés' },
            { value: '50K+', label: 'Clients satisfaits' },
            { value: '98%', label: 'Taux de satisfaction' },
          ].map((stat, index) => (
            <div key={index} className="p-4">
              <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
