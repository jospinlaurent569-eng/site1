import { Link } from 'react-router-dom';
import { Flame, Mail, Phone, MapPin, Clock, Star } from 'lucide-react';

const customerReviews = [
  {
    name: "Marie L.",
    text: "Excellent service, bois de qualité supérieure livré rapidement !",
  },
  {
    name: "Jean-Pierre D.",
    text: "Très satisfait de mon poêle, installation impeccable.",
  },
  {
    name: "Sophie M.",
    text: "Service client réactif et produits au top. Je recommande !",
  },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Flame className="h-8 w-8 text-primary" />
              <span className="font-display text-xl font-bold">
                bois<span className="text-primary">dechauffe</span>.fr
              </span>
            </Link>
            <p className="text-sm text-secondary-foreground/80">
              La marketplace européenne du chauffage. Bois, poêles et accessoires de qualité livrés chez vous.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Catégories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=firewood" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Bois de chauffage
                </Link>
              </li>
              <li>
                <Link to="/products?category=stoves" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Poêles à bois
                </Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Livraison
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  CGV
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <Mail className="h-4 w-4 text-primary" />
                contact@boisdechauffe.fr
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <Phone className="h-4 w-4 text-primary" />
                +33 1 23 45 67 89
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <MapPin className="h-4 w-4 text-primary" />
                Livraison France et pays limitrophes
              </li>
              <li className="flex items-start gap-2 text-sm text-secondary-foreground/80">
                <Clock className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p>Lun - Sam : 8h - 18h</p>
                  <p className="text-secondary-foreground/60">Dimanche : Fermé</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="border-t border-secondary-foreground/10 mt-8 pt-8">
          <h3 className="font-display font-semibold text-lg mb-6 text-center">Avis de nos clients</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerReviews.map((review, index) => (
              <div key={index} className="bg-secondary-foreground/5 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-secondary-foreground/80 italic">"{review.text}"</p>
                <p className="text-sm font-semibold text-secondary-foreground">{review.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-secondary-foreground/60">
              © 2024 boisdechauffe.fr. Tous droits réservés.
            </p>
            <Link 
              to="/admin" 
              className="text-xs text-secondary-foreground/40 hover:text-primary transition-colors"
            >
              Administration
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-secondary-foreground/40">Paiements sécurisés</span>
            <div className="flex gap-2 text-secondary-foreground/60">
              <span className="text-xs px-2 py-1 bg-secondary-foreground/10 rounded">Visa</span>
              <span className="text-xs px-2 py-1 bg-secondary-foreground/10 rounded">Mastercard</span>
              <span className="text-xs px-2 py-1 bg-secondary-foreground/10 rounded">PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
