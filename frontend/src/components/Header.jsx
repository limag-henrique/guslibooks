import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Header() {
    const { cartItems, setIsCartOpen } = useCart();
    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const [genres, setGenres] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                const uniqueGenres = new Set(response.data.map(b => b.genre).filter(Boolean));
                setGenres(Array.from(uniqueGenres).sort());
            } catch (error) {
                console.error("Error fetching genres for header:", error);
            }
        };
        fetchGenres();
    }, []);

    const handleGenreSelect = (genre) => {
        navigate(`/products?genre=${encodeURIComponent(genre)}`);
    };

    return (
        <header className="bg-[#12271D] border-b border-[#0f2118] py-4 px-6 sticky top-0 z-40 shadow-md transition-all">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <img
                        src="/logo.png"
                        alt="GUSLI Logo"
                        className="h-10 object-contain"
                        onError={(e) => { e.target.src = 'https://placehold.co/100x40/png?text=GUSLI' }}
                    />
                </Link>

                <nav className="flex items-center gap-8">
                    {/* Dropdown Navigation */}
                    <div className="relative group">
                        <div className="flex items-center gap-1 text-white font-medium cursor-pointer py-4 hover:text-gusli-highlight-1 transition-colors">
                            Livros <ChevronDown size={16} className="mt-0.5 group-hover:rotate-180 transition-transform" />
                        </div>
                        {/* Dropdown Menu */}
                        <div className="absolute top-full right-1/2 translate-x-1/2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-50">
                            {genres.map(genre => (
                                <button
                                    key={genre}
                                    onClick={() => handleGenreSelect(genre)}
                                    className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-black hover:font-bold transition-colors"
                                >
                                    {genre}
                                </button>
                            ))}
                            <div className="border-t border-gray-100 mt-2 pt-2">
                                <Link to="/products" className="block px-4 py-2 text-xs text-center font-bold text-gusli-highlight-2 hover:bg-gray-50 uppercase tracking-widest">
                                    Ver Todos
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-6">
                        <Link to="/contact" className="text-white hover:text-gusli-highlight-1 transition-colors text-sm font-medium uppercase tracking-widest">
                            Contato
                        </Link>
                        <Link to="/account" className="text-white hover:text-gusli-highlight-1 transition-colors text-sm font-medium uppercase tracking-widest">
                            Minha Conta
                        </Link>
                    </div>

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 text-white hover:text-gusli-highlight-1 transition-colors"
                        aria-label="Open cart"
                    >
                        <ShoppingBag size={24} />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-white text-[#12271D] text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </nav>
            </div>
        </header>
    );
}
