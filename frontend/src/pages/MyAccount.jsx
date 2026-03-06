import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Package, LogOut, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function MyAccount() {
    const navigate = useNavigate();

    // Authentication State
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [authError, setAuthError] = useState('');

    // Dashboard State
    const [activeTab, setActiveTab] = useState('profile');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Check if user is already logged in (simulated using localStorage)
    useEffect(() => {
        const storedUser = localStorage.getItem('gusli_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Fetch orders when tab switches to 'orders'
    useEffect(() => {
        if (user && activeTab === 'orders') {
            const fetchOrders = async () => {
                setLoadingOrders(true);
                try {
                    const response = await axios.get(`${API_URL}/api/user/orders?userId=${user.id}`);
                    setOrders(response.data);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                } finally {
                    setLoadingOrders(false);
                }
            };
            fetchOrders();
        }
    }, [user, activeTab]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const payload = isLogin ? { email: formData.email, password: formData.password } : formData;

            const response = await axios.post(`${API_URL}${endpoint}`, payload);

            // Success
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('gusli_user', JSON.stringify(userData));
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setAuthError(error.response.data.error);
            } else {
                setAuthError("Ocorreu um erro no servidor.");
            }
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('gusli_user');
        setActiveTab('profile');
        setFormData({ name: '', email: '', password: '' });
    };

    // Render Authentication Forms
    if (!user) {
        return (
            <div className="min-h-[80vh] flex flex-col justify-center items-center py-32 px-4 bg-white">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md animate-in fade-in zoom-in-95">
                    <div className="flex justify-center mb-8 text-[#12271D]">
                        <User size={48} strokeWidth={1} />
                    </div>
                    <h2 className="text-3xl font-bold text-[#12271D] text-center mb-8 tracking-tight">
                        {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
                    </h2>

                    {authError && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100">
                            {authError}
                        </div>
                    )}

                    <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5">
                        {!isLogin && (
                            <div>
                                <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2">Nome Completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border-b-2 border-gray-200 focus:border-[#12271D] py-2 text-lg font-medium bg-transparent focus:outline-none transition-colors"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full border-b-2 border-gray-200 focus:border-[#12271D] py-2 text-lg font-medium bg-transparent focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2">Senha</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full border-b-2 border-gray-200 focus:border-[#12271D] py-2 text-lg font-medium bg-transparent focus:outline-none transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-[#12271D] text-white hover:bg-black font-bold py-4 rounded-xl transition-all shadow-md mt-4 w-full uppercase tracking-widest text-sm flex justify-center items-center gap-2"
                        >
                            {isLogin ? 'Entrar' : 'Cadastrar'}
                            <ArrowRight size={16} />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-black font-medium">
                        {isLogin ? 'Novo por aqui? ' : 'Já tem uma conta? '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#12271D] font-bold hover:underline"
                        >
                            {isLogin ? 'Cadastre-se' : 'Entrar'}
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    // Render Dashboard
    return (
        <div className="max-w-[1200px] mx-auto px-4 py-32 flex flex-col md:flex-row gap-10 min-h-[70vh]">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
                <div className="mb-8 p-4 bg-white rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-black uppercase tracking-widest mb-1">Logado como</p>
                    <p className="font-bold text-[#12271D] text-lg leading-tight">{user.name}</p>
                </div>

                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all border ${activeTab === 'profile' ? 'border-[#12271D] text-[#12271D] bg-transparent shadow-sm' : 'text-black hover:bg-white hover:text-[#12271D] border-transparent'
                        }`}
                >
                    <User size={20} /> Meu Perfil
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all border ${activeTab === 'orders' ? 'border-[#12271D] text-[#12271D] bg-transparent shadow-sm' : 'text-black hover:bg-white hover:text-[#12271D] border-transparent'
                        }`}
                >
                    <Package size={20} /> Histórico de Pedidos
                </button>
                <button
                    onClick={() => setActiveTab('status')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all border ${activeTab === 'status' ? 'border-[#12271D] text-[#12271D] bg-transparent shadow-sm' : 'text-black hover:bg-white hover:text-[#12271D] border-transparent'
                        }`}
                >
                    <BookOpen size={20} /> Status dos Pedidos
                </button>

                <button
                    onClick={async () => {
                        if (window.confirm("Tem certeza que deseja apagar sua conta? Esta ação é irreversível.")) {
                            try {
                                await axios.delete(`${API_URL}/api/user/${user.id}`);
                                handleLogout();
                            } catch (err) {
                                console.error("Error deleting account:", err);
                                alert("Erro ao apagar conta.");
                            }
                        }
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-red-500 hover:bg-red-50 transition-all mt-auto"
                >
                    <LogOut size={20} /> Apagar conta
                </button>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                    <LogOut size={20} /> Sair da conta
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm min-h-[400px]">
                {activeTab === 'profile' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h1 className="text-3xl font-extrabold text-[#12271D] mb-8 tracking-tight">Seus Dados Pessoais</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-black uppercase tracking-widest mb-1">Nome Completo</label>
                                <p className="text-xl font-medium text-[#12271D] border-b pb-2">{user.name}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-black uppercase tracking-widest mb-1">E-mail</label>
                                <div className="border-b pb-2 flex items-center justify-between">
                                    <p className="text-xl font-medium text-[#12271D]">{user.email}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-black uppercase tracking-widest mb-1">Membro Desde</label>
                                <p className="text-xl font-medium text-[#12271D] border-b pb-2">
                                    {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'Recentemente'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h1 className="text-3xl font-extrabold text-[#12271D] mb-8 tracking-tight">Histórico de Pedidos</h1>

                        {loadingOrders ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#12271D] border-t-transparent"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12 flex flex-col items-center">
                                <Package size={48} className="text-gray-200 mb-4" />
                                <h3 className="text-xl font-bold text-black mb-2">Nenhum pedido efetuado</h3>
                                <p className="text-black mb-6">Explore o catálogo e faça sua primeira compra!</p>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="bg-transparent border border-[#12271D] text-[#12271D] px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:shadow-xl transition-all"
                                >
                                    Ver Catálogo
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {orders.map(order => {
                                    const itemsList = order.items ? JSON.parse(order.items) : [];
                                    return (
                                        <div key={order.id} className="border border-gray-200 rounded-2xl p-6 hover:border-[#12271D] hover:shadow-md transition-all">
                                            <div className="flex flex-wrap justify-between items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                                                <div>
                                                    <p className="text-xs font-bold text-black uppercase tracking-widest mb-1">Pedido {order.order_code ? `#${order.order_code}` : `#${order.id}`}</p>
                                                    <p className="font-bold text-[#12271D]">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                                                    <p className="text-xs text-black mt-1">Status: {order.status}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-black uppercase tracking-widest mb-1">Total</p>
                                                    <p className="font-black text-xl text-[#12271D]">R$ {order.total.toFixed(2)}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs font-bold text-black uppercase tracking-widest mb-3">Itens Comprados</p>
                                                <ul className="flex flex-col gap-2">
                                                    {itemsList.map((item, idx) => (
                                                        <li key={idx} className="flex justify-between items-center text-sm font-medium text-black bg-white p-2 rounded">
                                                            <span className="truncate pr-4 flex-1">
                                                                {item.quantity}x {item.product.name}
                                                                {item.variation ? ` (${item.variation})` : ''}
                                                            </span>
                                                            <span className="shrink-0">R$ {(item.quantity * item.product.price).toFixed(2)}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'status' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h1 className="text-3xl font-extrabold text-[#12271D] mb-8 tracking-tight">Status dos Pedidos</h1>

                        {loadingOrders ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#12271D] border-t-transparent"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12 flex flex-col items-center">
                                <BookOpen size={48} className="text-gray-200 mb-4" />
                                <h3 className="text-xl font-bold text-black mb-2">Sem atualizações de status</h3>
                                <p className="text-black mb-6">Seus acompanhamentos de envio aparecerão aqui.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {orders.map(order => (
                                    <div key={order.id} className="border border-gray-200 rounded-2xl p-6 bg-white">
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-sm font-bold text-[#12271D]">Pedido #{order.id}</p>
                                            <span className="bg-[#12271D] text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                                                {order.status}
                                            </span>
                                        </div>
                                        {/* Status Timeline Simulation */}
                                        <div className="flex flex-col gap-4 relative pl-4 border-l-2 border-[#12271D]/20 ml-2">
                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-[#12271D] rounded-full ring-4 ring-white"></div>
                                                <p className="text-sm font-bold text-gray-800">Pagamento Aprovado</p>
                                                <p className="text-xs text-black">{new Date(order.created_at).toLocaleString('pt-BR')}</p>
                                            </div>
                                            <div className="relative opacity-50">
                                                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-gray-300 rounded-full ring-4 ring-white"></div>
                                                <p className="text-sm font-bold text-black">Preparando Pacote</p>
                                                <p className="text-xs text-black">Aguardando atualização</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
