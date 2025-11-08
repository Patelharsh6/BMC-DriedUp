import React, { createContext, useState, useMemo, useContext } from 'react';

const productsData = [
  { id: 1, name: 'Sun-Kissed Apricots', desc: 'Sweet, chewy, and full of Vitamin A.', price: 349, img: 'https://placehold.co/400x300/FCD34D/4D7C0F?text=Apricots' },
  { id: 2, name: 'Tropical Mango Slices', desc: 'A burst of tropical flavor in every bite.', price: 499, img: 'https://placehold.co/400x300/FCD34D/4D7C0F?text=Dried+Mango' },
  { id: 3, name: 'Forest Berry Mix', desc: 'A tangy, sweet antioxidant powerhouse.', price: 650, img: 'https://placehold.co/400x300/F87171/4D7C0F?text=Dried+Berries' },
  { id: 4, name: 'Crunchy Almonds', desc: 'Perfectly roasted for a healthy snack.', price: 399, img: 'https://placehold.co/400x300/FFEDD5/4D7C0F?text=Almonds' },
  { id: 5, name: 'Cashew Delight', desc: 'Creamy cashews with a hint of salt.', price: 499, img: 'https://placehold.co/400x300/D9F99D/4D7C0F?text=Cashews' },
  { id: 6, name: 'Pistachio Crunch', desc: 'Nutty and delicious pistachios.', price: 599, img: 'https://placehold.co/400x300/DEF7FF/4D7C0F?text=Pistachios' },
  { id: 7, name: 'Mixed Dry Fruits', desc: 'A healthy mix of dried fruits.', price: 699, img: 'https://placehold.co/400x300/FBCFE8/4D7C0F?text=Mixed+Fruits' },
  { id: 8, name: 'Roasted Walnuts', desc: 'Crunchy walnuts for your daily snack.', price: 550, img: 'https://placehold.co/400x300/C7D2FE/4D7C0F?text=Walnuts' },
];

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [products, setProducts] = useState(
    productsData.map((p) => ({ ...p, quantity: 0 }))
  );

  const handleAddToCart = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity + 1 } : p
      )
    );
  };

  const handleRemoveFromCart = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id && p.quantity > 0 ? { ...p, quantity: p.quantity - 1 } : p
      )
    );
  };

  const clearCart = () => {
    setProducts(productsData.map((p) => ({ ...p, quantity: 0 })));
  };

  const cartItems = useMemo(() => products.filter((p) => p.quantity > 0), [products]);

  const totalItems = useMemo(() => products.reduce((acc, p) => acc + p.quantity, 0), [products]);

  const totalPrice = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );

  const value = {
    products,
    cartItems,
    totalItems,
    totalPrice,
    handleAddToCart,
    handleRemoveFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
