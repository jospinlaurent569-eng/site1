import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types/product';
import { products as initialProducts } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Convert database row to Product type
const dbToProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  description: row.description || '',
  price: Number(row.price),
  originalPrice: row.original_price ? Number(row.original_price) : undefined,
  category: row.category as 'firewood' | 'stoves' | 'accessories',
  subcategory: row.subcategory || '',
  images: row.images || [],
  rating: 4.5, // Default values for fields not in DB
  reviews: 0,
  seller: {
    name: 'boisdechauffe.fr',
    location: 'France',
    verified: true,
  },
  specifications: row.specs || {},
  stock: row.in_stock ? 100 : 0,
  unit: row.unit || 'stère',
  minOrder: 1,
  deliveryEstimate: '3-7 jours',
  certifications: ['PEFC'],
});

// Convert Product to database format
const productToDb = (product: Omit<Product, 'id'>) => ({
  name: product.name,
  description: product.description,
  price: product.price,
  original_price: product.originalPrice,
  category: product.category,
  subcategory: product.subcategory,
  images: product.images,
  in_stock: product.stock > 0,
  unit: product.unit,
  specs: product.specifications,
  featured: false,
});

export function ProductProvider({ children }: { children: ReactNode }) {
  // Start with initial products for instant display
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts(data.map(dbToProduct));
      }
      // Keep initial products if DB is empty
    } catch (error) {
      console.error('Error fetching products:', error);
      // Keep initial products on error
    }
  };

  useEffect(() => {
    // Fetch in background without blocking UI
    fetchProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productToDb(productData)])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setProducts((prev) => [dbToProduct(data), ...prev]);
        toast.success('Produit ajouté avec succès');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error("Erreur lors de l'ajout du produit");
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.subcategory !== undefined) dbUpdates.subcategory = updates.subcategory;
      if (updates.images !== undefined) dbUpdates.images = updates.images;
      if (updates.stock !== undefined) dbUpdates.in_stock = updates.stock > 0;
      if (updates.unit !== undefined) dbUpdates.unit = updates.unit;
      if (updates.specifications !== undefined) dbUpdates.specs = updates.specifications;

      const { error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, ...updates } : product
        )
      );
      toast.success('Produit modifié avec succès');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Erreur lors de la modification du produit');
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts((prev) => prev.filter((product) => product.id !== id));
      toast.success('Produit supprimé avec succès');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression du produit');
      throw error;
    }
  };

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const refreshProducts = async () => {
    setLoading(true);
    await fetchProducts();
  };

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, getProduct, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
