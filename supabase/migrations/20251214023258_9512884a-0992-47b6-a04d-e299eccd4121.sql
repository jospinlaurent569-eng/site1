-- Politique: tout le monde peut ajouter des produits (admin via interface)
CREATE POLICY "Anyone can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

-- Politique: tout le monde peut modifier les produits (admin via interface)
CREATE POLICY "Anyone can update products" 
ON public.products 
FOR UPDATE 
USING (true);

-- Politique: tout le monde peut supprimer les produits (admin via interface)
CREATE POLICY "Anyone can delete products" 
ON public.products 
FOR DELETE 
USING (true);

-- Politique: tout le monde peut modifier les commandes (admin via interface)
CREATE POLICY "Anyone can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);

-- Politique: tout le monde peut supprimer les commandes (admin via interface)
CREATE POLICY "Anyone can delete orders" 
ON public.orders 
FOR DELETE 
USING (true);