import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useProducts } from '@/context/ProductContext';
import { useOrders, Order } from '@/context/OrderContext';
import { Product } from '@/types/product';
import { Flame, Package, ShoppingCart, Users, TrendingUp, Settings, LogOut, Eye, Edit, Trash2, Plus, Upload, X, MapPin, Mail, Phone, User, Home, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { uploadProductImage, deleteProductImage } from '@/lib/storage';

const categoryLabels: Record<string, string> = {
  firewood: 'Bois de chauffage',
  stoves: 'Poêles',
  accessories: 'Accessoires',
};

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
};

const statusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'firewood' as 'firewood' | 'stoves' | 'accessories',
    subcategory: '',
    unit: 'stère',
    stock: '',
    minOrder: '1',
    deliveryEstimate: '3-5 jours',
    images: [] as string[],
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admine' && accessCode === '1990') {
      setIsAuthenticated(true);
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue sur le tableau de bord Robins des Bois.',
      });
    } else {
      toast({
        title: 'Identifiants incorrects',
        description: 'Nom ou code incorrect.',
        variant: 'destructive',
      });
    }
  };

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploadingImage(true);
    
    try {
      for (const file of Array.from(files)) {
        const imageUrl = await uploadProductImage(file);
        setProductForm((prev) => ({
          ...prev,
          images: [...prev.images, imageUrl],
        }));
      }
      toast({
        title: 'Image téléchargée',
        description: 'L\'image a été sauvegardée dans le cloud.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de télécharger l\'image.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = productForm.images[index];
    
    // Only delete from storage if it's a cloud URL
    if (imageUrl.includes('product-images')) {
      await deleteProductImage(imageUrl);
    }
    
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        subcategory: product.subcategory,
        unit: product.unit,
        stock: product.stock.toString(),
        minOrder: product.minOrder.toString(),
        deliveryEstimate: product.deliveryEstimate,
        images: product.images,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: 'firewood',
        subcategory: '',
        unit: 'stère',
        stock: '',
        minOrder: '1',
        deliveryEstimate: '3-5 jours',
        images: [],
      });
    }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = () => {
    if (!productForm.name || !productForm.price || !productForm.stock) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires.',
        variant: 'destructive',
      });
      return;
    }

    const productData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      category: productForm.category,
      subcategory: productForm.subcategory || productForm.category,
      unit: productForm.unit,
      stock: parseInt(productForm.stock),
      minOrder: parseInt(productForm.minOrder),
      deliveryEstimate: productForm.deliveryEstimate,
      images: productForm.images.length > 0 ? productForm.images : ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=400'],
      rating: 4.5,
      reviews: 0,
      seller: {
        name: 'Robins des Bois',
        location: 'France',
        verified: true,
      },
      specifications: {},
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast({ title: 'Produit modifié', description: `${productForm.name} a été mis à jour.` });
    } else {
      addProduct(productData);
      toast({ title: 'Produit ajouté', description: `${productForm.name} a été ajouté au catalogue.` });
    }

    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`Supprimer "${product.name}" ?`)) {
      deleteProduct(product.id);
      toast({ title: 'Produit supprimé', description: `${product.name} a été supprimé.` });
    }
  };

  const stats = [
    { label: 'Commandes', value: orders.length.toString(), icon: ShoppingCart },
    { label: 'Produits', value: products.length.toString(), icon: Package },
    { label: 'En attente', value: orders.filter((o) => o.status === 'pending').length.toString(), icon: Users },
    { label: 'CA Total', value: `${orders.reduce((sum, o) => sum + o.total, 0).toFixed(0)}€`, icon: TrendingUp },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-soft">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Flame className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold">Robins des Bois</h1>
              <p className="text-muted-foreground text-sm mt-2">Administration</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nom"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="code">Code d'accès</Label>
                <Input
                  id="code"
                  type="password"
                  placeholder="••••"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="mt-1 text-center text-2xl tracking-widest"
                  maxLength={4}
                />
              </div>
              <Button type="submit" variant="hero" className="w-full">
                Accéder au tableau de bord
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Flame className="h-8 w-8 text-primary" />
          <span className="font-display text-xl font-bold">
            Robins<span className="text-primary">DesBois</span>
          </span>
        </div>

        <nav className="space-y-1">
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: TrendingUp },
            { id: 'orders', label: 'Commandes', icon: ShoppingCart },
            { id: 'products', label: 'Produits', icon: Package },
            { id: 'settings', label: 'Paramètres', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
            <Link to="/">
              <Home className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={() => setIsAuthenticated(false)}>
            <LogOut className="h-5 w-5 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 bg-card border-b border-border px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu / back button */}
              <Button variant="ghost" size="icon" className="lg:hidden" asChild>
                <Link to="/">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="font-display text-xl lg:text-2xl font-bold">
                {activeTab === 'dashboard' && 'Tableau de bord'}
                {activeTab === 'orders' && 'Commandes'}
                {activeTab === 'products' && 'Produits'}
                {activeTab === 'settings' && 'Paramètres'}
              </h1>
            </div>
            {/* Mobile nav tabs */}
            <div className="flex lg:hidden gap-1">
              <Button 
                variant={activeTab === 'orders' ? 'default' : 'ghost'} 
                size="icon"
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button 
                variant={activeTab === 'products' ? 'default' : 'ghost'} 
                size="icon"
                onClick={() => setActiveTab('products')}
              >
                <Package className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <stat.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h2 className="font-display text-lg font-semibold">Dernières commandes</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ID</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Client</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Total</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Statut</th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-muted/30">
                          <td className="px-5 py-4 text-sm font-medium">{order.id}</td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">{order.email}</td>
                          <td className="px-5 py-4 text-sm font-medium">{order.total.toFixed(2)}€</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                              {statusLabels[order.status]}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                            Aucune commande pour le moment
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Toutes les commandes ({orders.length})</h2>
              </div>
              
              {orders.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Aucune commande pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-card rounded-xl border border-border overflow-hidden">
                      {/* Order Header */}
                      <div className="p-4 bg-muted/30 border-b border-border flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-bold text-primary">{order.id}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', { 
                              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                            {statusLabels[order.status]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select value={order.status} onValueChange={(v) => {
                            updateOrderStatus(order.id, v as Order['status']);
                          }}>
                            <SelectTrigger className="w-36 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="confirmed">Confirmée</SelectItem>
                              <SelectItem value="shipped">Expédiée</SelectItem>
                              <SelectItem value="delivered">Livrée</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => {
                            if (confirm('Supprimer cette commande ?')) {
                              deleteOrder(order.id);
                              toast({ title: 'Commande supprimée' });
                            }
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Order Content */}
                      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Customer Info */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm flex items-center gap-2 text-primary">
                            <User className="h-4 w-4" /> Informations client
                          </h4>
                          <div className="space-y-2 text-sm">
                            {order.name && (
                              <p><span className="text-muted-foreground">Nom:</span> <span className="font-medium">{order.name}</span></p>
                            )}
                            <p className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">{order.email}</span>
                            </p>
                            {order.phone && (
                              <p className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">{order.phone}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Delivery Address */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm flex items-center gap-2 text-primary">
                            <MapPin className="h-4 w-4" /> Adresse de livraison
                          </h4>
                          <div className="text-sm space-y-1">
                            <p className="font-medium">{order.address.street}</p>
                            <p>{order.address.postalCode} {order.address.city}</p>
                            <p className="text-muted-foreground">{order.address.country}</p>
                          </div>
                        </div>
                        
                        {/* Order Notes */}
                        {order.notes && (
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-primary">Notes</h4>
                            <p className="text-sm bg-muted p-2 rounded">{order.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Order Items */}
                      <div className="border-t border-border p-4">
                        <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                          <Package className="h-4 w-4 text-primary" /> Articles commandés ({order.items.length})
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                              <div className="w-12 h-12 bg-background rounded overflow-hidden flex-shrink-0">
                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.product.price.toFixed(2)}€ × {item.quantity} {item.product.unit}
                                </p>
                              </div>
                              <p className="font-bold text-primary">{(item.product.price * item.quantity).toFixed(2)}€</p>
                            </div>
                          ))}
                        </div>
                        
                        {/* Total */}
                        <div className="mt-4 pt-4 border-t border-border flex justify-end">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total de la commande</p>
                            <p className="text-2xl font-bold text-primary">{order.total.toFixed(2)}€</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Tous les produits</h2>
                <Button onClick={() => openProductModal()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Produit</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Catégorie</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Prix</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Stock</th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-muted/30">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                              {product.images[0] ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=100';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <span className="font-medium text-sm line-clamp-1">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm">{categoryLabels[product.category]}</td>
                        <td className="px-5 py-4 text-sm font-medium">{product.price}€/{product.unit}</td>
                        <td className="px-5 py-4 text-sm">{product.stock}</td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openProductModal(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteProduct(product)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <p className="text-muted-foreground">Paramètres à venir.</p>
            </div>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Commande {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </p>
                  <p className="font-medium">{selectedOrder.email}</p>
                </div>
                {selectedOrder.name && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" /> Nom
                    </p>
                    <p className="font-medium">{selectedOrder.name}</p>
                  </div>
                )}
                {selectedOrder.phone && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Téléphone
                    </p>
                    <p className="font-medium">{selectedOrder.phone}</p>
                  </div>
                )}
                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Adresse de livraison
                  </p>
                  <p className="font-medium">
                    {selectedOrder.address.street}<br />
                    {selectedOrder.address.postalCode} {selectedOrder.address.city}<br />
                    {selectedOrder.address.country}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold mb-3">Articles commandés</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-12 h-12 bg-background rounded overflow-hidden">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qté: {item.quantity}</p>
                      </div>
                      <p className="font-bold">{(item.product.price * item.quantity).toFixed(2)}€</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-primary">{selectedOrder.total.toFixed(2)}€</p>
                </div>
                <Select value={selectedOrder.status} onValueChange={(v) => {
                  updateOrderStatus(selectedOrder.id, v as Order['status']);
                  setSelectedOrder({ ...selectedOrder, status: v as Order['status'] });
                }}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmée</SelectItem>
                    <SelectItem value="shipped">Expédiée</SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedOrder.notes && (
                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Notes du client</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Product Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom du produit *</Label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ex: Bois de chêne sec"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={productForm.description}
                onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Description du produit..."
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prix *</Label>
                <Input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
                  placeholder="89"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Unité</Label>
                <Select value={productForm.unit} onValueChange={(v) => setProductForm((p) => ({ ...p, unit: v }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stère">Stère</SelectItem>
                    <SelectItem value="palette">Palette</SelectItem>
                    <SelectItem value="unité">Unité</SelectItem>
                    <SelectItem value="lot">Lot</SelectItem>
                    <SelectItem value="kg">Kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Catégorie</Label>
                <Select value={productForm.category} onValueChange={(v) => setProductForm((p) => ({ ...p, category: v as any }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="firewood">Bois de chauffage</SelectItem>
                    <SelectItem value="stoves">Poêles</SelectItem>
                    <SelectItem value="accessories">Accessoires</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Stock *</Label>
                <Input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))}
                  placeholder="100"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Photos du produit</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {productForm.images.map((img, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted">
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=100';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingImage ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span className="text-xs mt-1">Ajouter</span>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsProductModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleProductSubmit}>
              {editingProduct ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
