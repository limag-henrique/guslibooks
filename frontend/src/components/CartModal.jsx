import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CartModal() {
    const [preferenceId, setPreferenceId] = useState(null);
    const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal, clearCart, fetchCart } = useCart();

    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            <div className="relative w-full max-w-md h-full bg-gusli-bg shadow-xl flex flex-col pt-6 transform transition-transform duration-300 ease-in-out sm:max-w-md">
                <div className="flex items-center justify-between px-6 pb-4 border-b border-gusli-highlight-1">
                    <h2 className="text-xl font-bold text-gusli-highlight-2">Seu Carrinho</h2>
                    <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-black transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <p>Seu carrinho está vazio.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="mt-4 text-gusli-highlight-2 underline"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} className="flex gap-4 p-4 border rounded-xl border-gusli-highlight-1 bg-white">
                                <img
                                    src={`http://localhost:3001${item.product.image_path}`}
                                    alt={item.product.name}
                                    className="w-20 h-28 object-cover rounded shadow-sm"
                                    onError={(e) => { e.target.src = 'https://placehold.co/100x150/png?text=No+Cover' }}
                                />

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-gusli-highlight-2 line-clamp-2 leading-tight">{item.product.name}</h3>
                                        {item.variation && <p className="text-sm text-gray-500 mt-1">Variante: {item.variation}</p>}
                                        <p className="text-sm text-gray-400">{item.product.author}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2 bg-gusli-bg rounded-lg p-1 border border-gusli-highlight-1">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.variation, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="p-1 rounded text-gray-500 hover:bg-gusli-highlight-1 disabled:opacity-50 transition-colors"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.variation, item.quantity + 1)}
                                                disabled={item.quantity >= 10}
                                                className="p-1 rounded text-gray-500 hover:bg-gusli-highlight-1 disabled:opacity-50 transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.product.id, item.variation)}
                                            className="text-red-500 hover:text-white bg-red-50 hover:bg-red-600 border border-red-100 hover:border-red-600 p-2 rounded-lg transition-colors flex items-center justify-center shadow-sm"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && !preferenceId && (
                    <div className="p-6 border-t border-gusli-highlight-1 bg-white">
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <span className="text-gray-600 font-bold uppercase tracking-widest text-xs">Total do Pedido</span>
                                <span className="text-2xl font-black text-gusli-highlight-2">R$ {cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-gusli-highlight-2 text-gusli-bg py-4 rounded-xl font-bold hover:bg-black hover:scale-[1.02] transform transition-all shadow-md flex justify-center items-center gap-2 uppercase tracking-wider text-sm"
                        >
                            Revisar & Pagar Pedido
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
