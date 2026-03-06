import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { API_URL } from '../config';

export default function Checkout() {
    const { cartItems, cartTotal, cartSubtotal, totalCartQuantity, hasDiscount, clearCart } = useCart();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [shaking, setShaking] = useState(false);
    const isLoggedIn = !!localStorage.getItem('gusli_user');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        cpf: '',
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
    });

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gusli-bg  group/page">

                <h2 className="font-display text-5xl md:text-7xl text-black mb-8 uppercase tracking-tighter">O arquivo está vazio.</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="text-black uppercase tracking-[0.3em] font-bold text-xs hover:text-black transition-colors  border-b border-black/30 pb-1"
                >
                    [ Retornar ao Acervo ]
                </button>
            </div>
        );
    }

    const handleChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'cpf') {
            value = value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
        }
        if (e.target.name === 'zipCode') {
            value = value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1');
        }
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleZipCodeBlur = async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                if (!res.data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        street: res.data.logradouro || '',
                        neighborhood: res.data.bairro || '',
                        city: res.data.localidade || '',
                        state: res.data.uf || ''
                    }));
                } else {
                    toast.error("CEP não encontrado.");
                }
            } catch (err) {
                console.error("CEP error:", err);
                toast.error("Erro ao buscar integração com os Correios.");
            }
        }
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isValidCPF = (cpfEntrada) => {
        const cpfLimpo = cpfEntrada.replace(/[^\d]+/g, '');
        if (cpfLimpo.length !== 11 || /^(\d)\1+$/.test(cpfLimpo)) return false;
        let soma = 0;
        let resto;
        for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;
        return true;
    };

    const handleProcessCheckout = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.fullName || !formData.email || !formData.street || !formData.number || !formData.city || !formData.state) {
            toast.error('Por favor, preencha todos os campos obrigatórios do endereço.');
            return;
        }

        if (!isValidEmail(formData.email)) {
            toast.error('E-mail inválido. Certifique-se de que ele termina com seu provedor (ex: .com)');
            return;
        }

        if (!isValidCPF(formData.cpf)) {
            toast.error('O CPF inserido é inválido.');
            return;
        }

        setIsLoading(true);

        try {
            // Save data locally if needed or attach to user
            localStorage.setItem('gusli_checkout_info', JSON.stringify(formData));

            const storedUser = localStorage.getItem('gusli_user');
            const user = storedUser ? JSON.parse(storedUser) : null;

            await axios.post(`${API_URL}/api/checkout`, {
                userId: user ? user.id : null,
                total: cartTotal,
                items: cartItems,
                formData: formData
            });

            clearCart();
            navigate('/success');
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Erro ao processar o seu pedido. Tente novamente mais tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gusli-bg pt-32 pb-24 px-6 md:px-12  group/page flex flex-col items-center">

            <div className="w-full max-w-[1600px] flex flex-col lg:flex-row gap-16 lg:gap-24 relative">

                {/* Left Form Section (Editorial) */}
                <div className="flex-1">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-4 text-black hover:text-black mb-12 transition-colors font-bold uppercase text-[10px] tracking-[0.3em] "
                    >
                        <ArrowLeft size={16} /> Voltar
                    </button>

                    <h1 className="font-display text-6xl md:text-8xl text-black uppercase tracking-tighter leading-none mb-4">Checkout</h1>
                    <p className="text-black text-xs uppercase tracking-[0.3em] font-bold mb-16 border-b border-black/20 pb-12">
                        Autorização de Envio e Transação
                    </p>

                    <form onSubmit={handleProcessCheckout} className="space-y-12 max-w-2xl">
                        <div className="flex flex-col gap-10">
                            {/* Identificação */}
                            <div className="space-y-8 border-b border-black/10 pb-12">
                                <h3 className="font-display text-2xl text-black uppercase tracking-widest">Identificação</h3>

                                <div>
                                    <label className="block text-[10px] font-bold text-black mb-2 uppercase tracking-[0.3em]">Nome *</label>
                                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-transparent border-b border-black/30 py-4 text-xl font-medium text-black focus:outline-none focus:border-white transition-colors  placeholder-black/50" placeholder="Primeiro e Último Nome" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-bold text-black mb-2 uppercase tracking-[0.3em]">E-mail *</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-transparent border-b border-black/30 py-4 text-xl font-medium text-black focus:outline-none focus:border-white transition-colors  placeholder-black/50" placeholder="contato@servidor.com" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-black mb-2 uppercase tracking-[0.3em]">Cadastro (CPF) *</label>
                                        <input required type="text" name="cpf" value={formData.cpf} onChange={handleChange} maxLength="14" className={`w-full bg-transparent border-b py-4 text-xl font-medium focus:outline-none transition-colors placeholder-black/50 ${formData.cpf.length >= 11 ? (isValidCPF(formData.cpf) ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600') : 'border-black/30 text-black'}`} placeholder="000.000.000-00" />
                                        {formData.cpf.length >= 11 && (
                                            <p className={`text-[10px] font-bold mt-1 uppercase ${isValidCPF(formData.cpf) ? 'text-green-600' : 'text-red-500'}`}>
                                                {isValidCPF(formData.cpf) ? 'CPF Válido!' : 'CPF Inválido!'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-black mb-2 uppercase tracking-[0.3em]">Celular (WhatsApp de preferência)</label>
                                    <input type="text" name="phone" value={formData.phone || ''} onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^[0-9()+\-#*]*$/.test(val)) {
                                            setFormData({ ...formData, phone: val });
                                        }
                                    }} className="w-full bg-transparent border-b border-black/30 py-4 text-xl font-medium text-black focus:outline-none focus:border-white transition-colors  placeholder-black/50" placeholder="De preferência, que seja WhatsApp" />
                                </div>
                            </div>

                            {/* Entrega */}
                            <div className="space-y-8">
                                <h3 className="font-display text-2xl text-black uppercase tracking-widest">Destino</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-bold text-black mb-2 uppercase tracking-[0.3em]">CEP *</label>
                                        <input required type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} onBlur={handleZipCodeBlur} maxLength="9" className="w-full bg-transparent border-b border-black/30 py-4 text-xl font-medium text-black focus:outline-none focus:border-white transition-colors  placeholder-black/50" placeholder="00000-000" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-black mb-2 uppercase tracking-[0.3em]">Logradouro *</label>
                                        <input required type="text" name="street" value={formData.street} onChange={handleChange} className="w-full bg-transparent border-b border-black/30 py-4 text-xl font-medium text-black focus:outline-none focus:border-white transition-colors  placeholder-black/50" placeholder="Avenida ou Rua" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-bold text-black mb-2 uppercase tracking-[0.3em]">Número *</label>
                                        <input required type="text" name="number" value={formData.number} onChange={handleChange} className="w-full bg-transparent border-b border-black/30 py-4 text-xl font-medium text-black focus:outline-none focus:border-white transition-colors  placeholder-black/50" placeholder="123" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-black mb-2 uppercase tracking-[0.3em]">Complemento / Local</label>
                                        <input type="text" name="complement" value={formData.complement} onChange={handleChange} className="w-full bg-transparent border-b border-black/30 py-4 text-xl font-medium text-black focus:outline-none focus:border-white transition-colors  placeholder-black/50" placeholder="Opcional" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-bold text-black mb-2 uppercase tracking-[0.3em]">Bairro *</label>
                                        <input required type="text" name="neighborhood" value={formData.neighborhood} onChange={handleChange} className="w-full bg-transparent border-b border-black/30 py-4 text-xl font-medium text-black focus:outline-none focus:border-white transition-colors  placeholder-black/50" placeholder="Seu Bairro" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-black mb-2 uppercase tracking-[0.3em]">Localidade *</label>
                                        <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-transparent border-b border-black/30 py-4 text-xl font-medium text-black focus:outline-none focus:border-white transition-colors  placeholder-black/50" placeholder="Cidade" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-black mb-2 uppercase tracking-[0.3em]">Estado *</label>
                                        <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-transparent border-b border-black/30 py-4 text-xl font-medium text-black focus:outline-none focus:border-white transition-colors  placeholder-black/50" placeholder="UF" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 mt-16 border-t border-black/20 hidden md:block">
                            {/* Desktop Button */}
                            {isLoggedIn ? (
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-black text-gusli-bg py-8 font-sans text-4xl font-bold flex justify-center items-center gap-6 disabled:opacity-50 disabled:cursor-not-allowed tracking-tight transition-colors border border-transparent hover:bg-white hover:text-[#12271D] hover:border-[#12271D] rounded-full"
                                >
                                    {isLoading ? 'Processando...' : 'Concluir Pedido'}
                                    {!isLoading && <ArrowRight size={32} />}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className={`w-full bg-gray-400 text-white/70 py-8 font-sans text-4xl font-bold flex justify-center items-center gap-6 tracking-tight border border-transparent rounded-full cursor-not-allowed select-none ${shaking ? 'animate-shake' : ''}`}
                                    onClick={() => {
                                        setShaking(true);
                                        setTimeout(() => setShaking(false), 500);
                                        toast('Você precisa ter uma conta para continuar com este pedido. 🔐\nCrie a sua ou faça login — é rápido!', {
                                            duration: 5000,
                                            icon: '👤',
                                            style: {
                                                borderRadius: '12px',
                                                background: '#12271D',
                                                color: '#fff',
                                                fontSize: '14px',
                                                padding: '14px 18px',
                                                lineHeight: '1.6',
                                            },
                                        });
                                    }}
                                >
                                    Concluir Pedido
                                    <ArrowRight size={32} />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Right Summary Section (Sticky Editorial) */}
                <div className="w-full lg:w-[450px] shrink-0">
                    <div className="sticky top-32 flex flex-col gap-10">
                        <div className="border border-black/20 bg-gusli-green text-black p-10">
                            <h3 className="font-sans font-bold text-2xl text-white mb-8 tracking-tight border-b border-black/20 pb-6 uppercase">Revisão do Pedido</h3>

                            <div className="flex flex-col gap-6 mb-12">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold uppercase tracking-widest text-xs">{item.product.name}</span>
                                            <span className="text-white text-[10px] uppercase font-bold tracking-[0.3em] mt-1">{item.quantity} Uni. · R$ {item.product.price.toFixed(2)}/un.</span>
                                        </div>
                                        <span className="font-display text-lg text-white whitespace-nowrap">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Upsell banner – shown when 1-4 items */}
                            {totalCartQuantity >= 1 && totalCartQuantity <= 4 && (
                                <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 mb-6">
                                    <span className="text-xl">🎁</span>
                                    <p className="text-amber-800 text-xs font-semibold leading-snug">
                                        Adicione mais <strong>{5 - totalCartQuantity} {5 - totalCartQuantity === 1 ? 'livro' : 'livros'}</strong> ao carrinho e ganhe <strong>7% de desconto</strong> no total!
                                    </p>
                                </div>
                            )}

                            <div className="pt-8 border-t border-black/20 flex flex-col gap-3">
                                {hasDiscount && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.3em]">Subtotal</span>
                                        <span className="text-white/60 line-through text-sm">R$ {cartSubtotal.toFixed(2)}</span>
                                    </div>
                                )}
                                {hasDiscount && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-green-300 uppercase tracking-[0.3em]">Desconto 7%</span>
                                        <span className="text-green-300 font-bold text-sm">-R$ {(cartSubtotal - cartTotal).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-[0.4em]">Total</span>
                                    <span className="font-display text-4xl text-white">R$ {cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Button Location (Sticky Bottom) */}
                        <div className="md:hidden sticky bottom-0 bg-gusli-bg pt-4 pb-8 z-50 border-t border-black/20">
                            {isLoggedIn ? (
                                <button
                                    onClick={handleProcessCheckout}
                                    disabled={isLoading}
                                    className="w-full bg-black text-gusli-bg py-5 font-sans font-bold text-2xl flex justify-center items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed tracking-tight transition-colors border border-transparent hover:bg-white hover:text-[#12271D] hover:border-[#12271D] rounded-full"
                                >
                                    {isLoading ? 'Aguarde' : 'Concluir Pedido'}
                                    {!isLoading && <ArrowRight size={24} />}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className={`w-full bg-gray-400 text-white/70 py-5 font-sans font-bold text-2xl flex justify-center items-center gap-4 tracking-tight rounded-full cursor-not-allowed select-none ${shaking ? 'animate-shake' : ''}`}
                                    onClick={() => {
                                        setShaking(true);
                                        setTimeout(() => setShaking(false), 500);
                                        toast('Você precisa ter uma conta para continuar com este pedido. 🔐\nCrie a sua ou faça login — é rápido!', {
                                            duration: 5000,
                                            icon: '👤',
                                            style: {
                                                borderRadius: '12px',
                                                background: '#12271D',
                                                color: '#fff',
                                                fontSize: '14px',
                                                padding: '14px 18px',
                                                lineHeight: '1.6',
                                            },
                                        });
                                    }}
                                >
                                    Concluir Pedido
                                    <ArrowRight size={24} />
                                </button>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
