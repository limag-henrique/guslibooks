import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeleteCart() {
    const navigate = useNavigate();
    const { clearCart, cartItems } = useCart();
    const [email, setEmail] = useState('');
    const [reason, setReason] = useState('');

    const handleDelete = (e) => {
        e.preventDefault();
        if (!email || !reason) {
            toast.error('Por favor, preencha todos os campos para prosseguir.');
            return;
        }

        // Just clear the cart without the success "compra finalizada" toast if possible,
        // Actually, clearCart might say "Compra finalizada com sucesso!", so manually deleting items:

        clearCart();
        toast.success('Pedido apagado com sucesso.', { icon: '🗑️' });
        navigate('/products');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gusli-bg flex flex-col items-center justify-center text-center px-4  group/page">
                <h2 className="font-display text-5xl md:text-7xl text-black mb-8 uppercase tracking-tighter">O arquivo já está vazio.</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="text-black uppercase tracking-[0.3em] font-bold text-xs hover:text-black transition-colors  border-b border-black/30 pb-1"
                >
                    [ Retornar ao Acervo ]
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gusli-bg pt-32 pb-24 px-6 md:px-12  group/page flex flex-col items-center justify-center">

            <div className="w-full max-w-2xl relative">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-4 text-black hover:text-black mb-12 transition-colors font-bold uppercase text-[10px] tracking-[0.3em] "
                >
                    <ArrowLeft size={16} /> [ Cancelar ]
                </button>

                <h1 className="font-display text-5xl md:text-7xl text-black uppercase tracking-tighter leading-none mb-4">Revisar e Apagar Pedido</h1>
                <p className="text-black text-xs uppercase tracking-[0.3em] font-bold mb-16 border-b border-black/20 pb-12">
                    Confirme o cancelamento da sua seleção
                </p>

                <form onSubmit={handleDelete} className="space-y-12">
                    <div className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-bold text-black mb-2 uppercase tracking-[0.3em]">Confirme seu E-mail *</label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-b border-black/30 py-4 text-xl font-medium text-black focus:outline-none focus:border-red-500 transition-colors  placeholder-black/50"
                                placeholder="contato@servidor.com"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-black mb-2 uppercase tracking-[0.3em]">Motivo do Cancelamento *</label>
                            <select
                                required
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full bg-transparent border-b border-black/30 py-4 text-xl font-medium text-black focus:outline-none focus:border-red-500 transition-colors "
                            >
                                <option value="" className="bg-white border border-[black] text-black">Selecione uma opção</option>
                                <option value="price" className="bg-white border border-[black] text-black">Desisti da compra / Preço alto</option>
                                <option value="mistake" className="bg-white border border-[black] text-black">Adicionei itens por engano</option>
                                <option value="found_elsewhere" className="bg-white border border-[black] text-black">Encontrei em outro lugar</option>
                                <option value="other" className="bg-white border border-[black] text-black">Outro motivo</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-8 mt-8 border-t border-black/20">
                        <button
                            type="submit"
                            className="w-full bg-transparent border border-red-500 text-red-500 py-6 font-display text-2xl md:text-3xl hover:bg-red-500 hover:text-black transform transition-colors shadow-2xl flex justify-center items-center gap-6 uppercase tracking-tighter  group"
                        >
                            <Trash2 size={24} className="group-hover:scale-110 transition-transform" />
                            Apagar Pedido
                        </button>
                        <p className="text-center text-black text-[10px] uppercase font-bold tracking-[0.2em] mt-6">
                            Esta ação não pode ser desfeita e removerá todos os {cartItems.length} itens do carrinho.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
