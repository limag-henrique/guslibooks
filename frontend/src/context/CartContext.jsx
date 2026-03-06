import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('gusli_cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('gusli_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = async (product, quantity = 1, variation = null) => {
        try {
            if (quantity < 1 || quantity > 10) {
                toast.error('A quantidade deve ser entre 1 e 10 unidades.');
                return;
            }

            const existingItem = cartItems.find(item => item.product.id === product.id && (item.variation === variation || (!item.variation && !variation)));

            if (existingItem) {
                if (existingItem.quantity + quantity > 10) {
                    toast.error('O limite máximo é de 10 unidades por pedido.');
                    return;
                }
                const newQuantity = existingItem.quantity + quantity;
                setCartItems(cartItems.map(item =>
                    (item.product.id === product.id && (item.variation === variation || (!item.variation && !variation))) ? { ...item, quantity: newQuantity } : item
                ));
            } else {
                setCartItems([...cartItems, { product, quantity, variation }]);
            }
            toast.success('Produto adicionado à sacola!');
            setIsCartOpen(true);
        } catch (err) {
            toast.error('Falha ao adicionar ao carrinho.');
            console.error(err);
        }
    };

    const updateQuantity = async (productId, variation, newQuantity) => {
        try {
            if (newQuantity < 1) return;
            if (newQuantity > 10) {
                toast.error('O limite máximo é de 10 unidades por pedido.');
                return;
            }
            setCartItems(cartItems.map(item =>
                (item.product.id === productId && (item.variation === variation || (!item.variation && !variation))) ? { ...item, quantity: newQuantity } : item
            ));
        } catch {
            toast.error('Falha ao atualizar quantidade.');
        }
    };

    const removeFromCart = async (productId, variation) => {
        try {
            setCartItems(cartItems.filter(item => !(item.product.id === productId && (item.variation === variation || (!item.variation && !variation)))));
            toast.success('Produto removido da sacola.');
        } catch {
            toast.error('Falha ao remover produto.');
        }
    };

    const clearCart = async () => {
        try {
            // Keep checkout sync
            setCartItems([]);
            localStorage.removeItem('gusli_cart');
            toast.success('Compra finalizada com sucesso!', { duration: 4000, icon: '🎉' });
            setIsCartOpen(false);
        } catch (err) {
            toast.error('Erro ao finalizar compra.');
            console.error(err);
        }
    };

    const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const hasDiscount = totalCartQuantity >= 5;
    const cartSubtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const cartTotal = hasDiscount ? cartSubtotal * 0.93 : cartSubtotal;

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, isCartOpen, setIsCartOpen, cartTotal, cartSubtotal, totalCartQuantity, hasDiscount }}>
            {children}
        </CartContext.Provider>
    );
};
