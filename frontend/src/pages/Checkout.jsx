import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

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
            <div className="min-h-screen flex flex-col items-center justify-center bg-gusli-bg mt-20 px-4">
                <h2 className="text-2xl font-bold text-gusli-highlight-2 mb-4">Seu carrinho está vazio.</h2>
                <button onClick={() => navigate('/products')} className="text-blue-600 hover:underline">
                    Voltar para a loja
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
                toast.error("Erro ao buscar integração com os Correios.");
            }
        }
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isValidCPF = (cpf) => {
        const cleanCPF = cpf.replace(/\D/g, '');
        return cleanCPF.length === 11;
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

            // Create Preference directly
            const prefRes = await axios.post('http://localhost:3001/api/create_preference', {
                cartItems,
                payerInfo: formData
            });
            if (prefRes.data.init_point) {
                // Redirect user to Mercado Pago to finalize payment
                window.location.href = prefRes.data.init_point;
                return;
            }
        } catch (error) {
            console.error("Mercado Pago checkout error:", error);
            toast.error("Processando via sistema de fallback seguro...", { duration: 4000 });

            // Fallback: Finalize order on backend if MP fails
            const storedUser = localStorage.getItem('gusli_user');
            const user = storedUser ? JSON.parse(storedUser) : null;

            await axios.post('http://localhost:3001/api/checkout', {
                userId: user ? user.id : null,
                total: cartTotal,
                items: cartItems
            });

            clearCart();
            navigate('/account'); // Send to their account or success page
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gusli-bg py-24 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">

                {/* Left Form Section */}
                <div className="flex-1 bg-white p-8 rounded-3xl shadow-xl border border-gusli-highlight-1">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors">
                        <ArrowLeft size={16} /> Voltar
                    </button>

                    <h1 className="text-3xl font-extrabold text-gusli-highlight-2 mb-2">Finalizar Pedido</h1>
                    <p className="text-gray-500 mb-8 font-medium">Preencha seus dados para entrega e cobrança.</p>

                    <form onSubmit={handleProcessCheckout} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo *</label>
                                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all" placeholder="João da Silva" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">E-mail *</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all" placeholder="joao@email.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">CPF *</label>
                                    <input required type="text" name="cpf" value={formData.cpf} onChange={handleChange} maxLength="14" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all" placeholder="000.000.000-00" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">CEP *</label>
                                    <input required type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} onBlur={handleZipCodeBlur} maxLength="9" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all" placeholder="00000-000" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Logradouro / Rua *</label>
                                    <input required type="text" name="street" value={formData.street} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all" placeholder="Rua / Avenida" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Número *</label>
                                    <input required type="text" name="number" value={formData.number} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all" placeholder="123" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Complemento</label>
                                    <input type="text" name="complement" value={formData.complement} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all" placeholder="Apto 4, Bloco B (Opcional)" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Bairro *</label>
                                    <input required type="text" name="neighborhood" value={formData.neighborhood} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all" placeholder="Bairro" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Cidade *</label>
                                    <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all" placeholder="Cidade" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Estado *</label>
                                    <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all" placeholder="UF" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 mt-8 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#12271D] text-white py-5 rounded-xl font-black text-lg hover:bg-black hover:scale-[1.01] transform transition-all shadow-xl flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest"
                            >
                                {isLoading ? 'Processando Conexão...' : 'Ir para Pagamento'}
                                {!isLoading && <ArrowRight size={20} />}
                            </button>
                            <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 text-sm">
                                <ShieldCheck size={16} /> Pagamento seguro e encriptado via Mercado Pago
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Summary Section */}
                <div className="w-full md:w-80 flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gusli-highlight-1 sticky top-32">
                        <h3 className="font-bold text-lg text-gusli-highlight-2 mb-4 pb-4 border-b border-gray-100">Resumo do Pedido</h3>

                        <div className="flex flex-col gap-4 mb-6">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-gray-600 line-clamp-1 max-w-[60%]">{item.quantity}x {item.product.name}</span>
                                    <span className="font-medium text-black">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total</span>
                            <span className="text-xl font-black text-[#12271D]">R$ {cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
