import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Mail, MapPin, Phone, User, Shield, Truck, Award } from 'lucide-react';

const countries = [
  'France',
  'Belgique',
  'Suisse',
  'Luxembourg',
  'Allemagne',
  'Pays-Bas',
  'Espagne',
  'Italie',
  'Autriche',
  'Portugal',
];

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save order
      const newOrderId = await addOrder({
        items: [...items],
        email: formData.email,
        name: formData.name || undefined,
        phone: formData.phone || undefined,
        address: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        notes: formData.notes || undefined,
        total,
      });

      setOrderId(newOrderId);
      setIsSuccess(true);
      clearCart();

      toast({
        title: 'Commande envoyée !',
        description: `Référence: ${newOrderId}. Vous recevrez un email de confirmation sous 24h.`,
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: 'Erreur',
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-4">
              Merci pour votre commande !
            </h1>
            <p className="text-muted-foreground mb-2">
              Référence: <strong>{orderId}</strong>
            </p>
            <p className="text-muted-foreground mb-8">
              Nous avons bien reçu votre demande. Vous serez contacté par email à{' '}
              <strong>{formData.email}</strong> sous 24 heures pour confirmer les
              détails de livraison et procéder au paiement sécurisé.
            </p>
            <Button variant="hero" onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-2">Finaliser la commande</h1>
        <p className="text-muted-foreground mb-8">
          Pas de compte requis. Remplissez vos informations et nous vous contacterons pour finaliser.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Coordonnées
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">
                      <User className="h-4 w-4 inline mr-1" />
                      Nom (optionnel)
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Jean Dupont"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Téléphone (optionnel)
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+33 6 12 34 56 78"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Adresse de livraison
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="street">Adresse *</Label>
                    <Input
                      id="street"
                      name="street"
                      placeholder="123 Rue du Bois"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Code postal *</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      placeholder="75001"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Paris"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="country">Pays *</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(v) =>
                        setFormData((prev) => ({ ...prev, country: v }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-display text-xl font-semibold">
                  Notes (optionnel)
                </h2>
                <Textarea
                  name="notes"
                  placeholder="Instructions de livraison, questions..."
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-xl border border-border p-6 space-y-6">
                <h2 className="font-display text-xl font-semibold">
                  Votre commande
                </h2>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="font-medium shrink-0">
                        {(item.product.price * item.quantity).toFixed(2)}€
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{total.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>À confirmer</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total estimé</span>
                    <span className="font-bold text-primary">
                      {total.toFixed(2)}€
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer la commande'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Vous serez contacté par email sous 24h pour confirmer les détails
                  et procéder au paiement sécurisé.
                </p>

                {/* Trust & Certification Section */}
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                    <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Paiement 100% sécurisé</p>
                      <p className="text-xs text-muted-foreground">Transactions cryptées SSL, conformes PCI-DSS</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                    <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Livraison France & pays limitrophes</p>
                      <p className="text-xs text-muted-foreground">Belgique, Suisse, Luxembourg, Allemagne...</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                    <Award className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Produits certifiés</p>
                      <p className="text-xs text-muted-foreground">Bois séché PEFC, poêles normes CE & Flamme Verte</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  🛡️ <strong>Garantie satisfaction</strong> : Votre commande est traitée avec soin par notre équipe. 
                  Plus de 2 500 clients satisfaits en France et en Europe.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
