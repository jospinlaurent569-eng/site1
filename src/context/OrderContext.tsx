import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Order {
  id: string;
  items: CartItem[];
  email: string;
  name?: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  total: number;
  createdAt: Date;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  getOrder: (id: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Convert database row to Order type
const dbToOrder = (row: any): Order => ({
  id: row.id,
  items: row.items || [],
  email: row.customer_email,
  name: row.customer_name,
  phone: row.customer_phone,
  address: {
    street: row.delivery_address,
    city: row.delivery_city,
    postalCode: row.delivery_postal_code,
    country: row.delivery_country,
  },
  notes: row.notes,
  status: row.status as Order['status'],
  total: Number(row.total_amount),
  createdAt: new Date(row.created_at),
});

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setOrders(data.map(dbToOrder));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    try {
      // Convert items to plain JSON-compatible objects (exclude base64 images)
      const itemsJson = orderData.items.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          images: (item.product.images || []).filter(img => !img?.startsWith('data:')).slice(0, 1),
          unit: item.product.unit,
        },
        quantity: item.quantity,
      }));

      const dbOrder = {
        customer_name: orderData.name || null,
        customer_email: orderData.email,
        customer_phone: orderData.phone || null,
        delivery_address: orderData.address.street,
        delivery_city: orderData.address.city,
        delivery_postal_code: orderData.address.postalCode,
        delivery_country: orderData.address.country,
        notes: orderData.notes || null,
        items: itemsJson,
        total_amount: orderData.total,
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([dbOrder])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newOrder = dbToOrder(data);
        setOrders((prev) => [newOrder, ...prev]);
        return data.id;
      }
      
      throw new Error('No data returned');
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error("Erreur lors de l'enregistrement de la commande");
      throw error;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );
      toast.success('Statut de la commande mis à jour');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
      throw error;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setOrders((prev) => prev.filter((order) => order.id !== id));
      toast.success('Commande supprimée');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Erreur lors de la suppression de la commande');
      throw error;
    }
  };

  const getOrder = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  const refreshOrders = async () => {
    setLoading(true);
    await fetchOrders();
  };

  return (
    <OrderContext.Provider value={{ orders, loading, addOrder, updateOrderStatus, deleteOrder, getOrder, refreshOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
