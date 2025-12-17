import { Truck, Shield, Leaf, Clock, CreditCard, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Livraison Europe',
    description: 'Livraison dans tous les pays européens avec suivi en temps réel',
  },
  {
    icon: Shield,
    title: 'Vendeurs Vérifiés',
    description: 'Tous nos vendeurs sont certifiés et contrôlés pour votre sécurité',
  },
  {
    icon: Leaf,
    title: 'Bois Durable',
    description: 'Bois certifié PEFC issu de forêts gérées durablement',
  },
  {
    icon: Clock,
    title: 'Sans Compte',
    description: 'Commandez en quelques clics sans créer de compte',
  },
  {
    icon: CreditCard,
    title: 'Paiement Sécurisé',
    description: 'Transactions protégées par cryptage SSL/TLS',
  },
  {
    icon: HeadphonesIcon,
    title: 'Support Réactif',
    description: 'Notre équipe répond sous 24h à toutes vos questions',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pourquoi Robins des Bois ?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une expérience d'achat simple, sécurisée et écologique
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group text-center p-6 rounded-2xl transition-all duration-300 hover:bg-card hover:shadow-soft"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-warm">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
