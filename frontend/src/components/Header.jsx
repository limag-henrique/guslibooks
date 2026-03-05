import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ChevronDown, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Header() {
    const { cartItems, setIsCartOpen } = useCart();
    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const [genres, setGenres] = useState([]);
    const navigate = useNavigate();

    // Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchEnter = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false); // Optionally close after search
        }
    };

    // We can remove scrolled state logic as header is strictly set to #12271D now

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
        <header className="fixed w-full top-0 z-50 bg-gusli-green border-b border-black/20 py-4 shadow-md">
            <div className="max-w-[1600px] mx-auto px-6 h-12 flex items-center justify-between">

                {/* Typographic Logo */}
                <Link to="/" className="flex items-center gap-4 group">
                    <img src="http://localhost:3001/visual/logo.png" alt="Gusli Logo" className="h-8 md:h-12 w-auto object-contain" />
                    <span className="font-sans font-bold text-2xl tracking-tight text-white group-hover:text-gusli-bg transition-colors duration-300 hidden sm:block">Gusli Books</span>
                </Link>

                <nav className="flex items-center gap-10">
                    <div className="flex items-center gap-6">
                        {/* Dropdown Navigation */}
                        <div className="relative group">
                            <Link to="/products" className="flex items-center gap-1.5 text-white font-bold py-4 hover:text-gusli-bg transition-colors text-sm">
                                Loja <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300" />
                            </Link>
                            {/* Dropdown Menu */}
                            <div className="absolute top-full right-1/2 translate-x-1/2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-50">
                                {genres.map(genre => (
                                    <button
                                        key={genre}
                                        onClick={() => handleGenreSelect(genre)}
                                        className="px-4 py-2 text-left text-sm text-black hover:bg-white hover:text-black hover:font-bold transition-colors"
                                    >
                                        {genre}
                                    </button>
                                ))}
                                <div className="border-t border-gray-100 mt-2 pt-2">
                                    <button onClick={() => handleGenreSelect('Todas')} className="w-full block px-4 py-2 text-sm text-center font-bold text-black hover:bg-white hover:text-gusli-green transition-colors">
                                        Ver Todos
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative flex items-center">
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="text-white hover:text-gusli-bg transition-colors"
                                aria-label="Toggle search"
                            >
                                <Search size={20} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-64 sm:w-80 md:w-96 ml-3 opacity-100' : 'w-0 ml-0 opacity-0'}`}>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearchEnter}
                                    onBlur={() => {
                                        // Small delay to allow click events (like search icon toggle) to process first
                                        setTimeout(() => setIsSearchOpen(false), 200);
                                    }}
                                    placeholder="digite uma obra, autor ou gênero"
                                    className={`w-full bg-white text-black px-4 py-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-xs sm:text-sm transition-opacity duration-300 shadow-inner ${isSearchOpen ? 'opacity-100' : 'opacity-0'}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-6">
                        <Link to="/contact" className="text-white hover:text-gusli-bg transition-colors text-sm font-bold">
                            Contato
                        </Link>
                        <Link to="/account" className="text-white hover:text-gusli-bg transition-colors text-sm font-bold">
                            Minha Conta
                        </Link>
                    </div>

                    <div className="flex items-center gap-6 ml-4 pl-6 border-l border-white/30">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex items-center gap-2 group"
                            aria-label="Open cart"
                        >
                            <span className="text-sm font-bold text-white group-hover:text-gusli-bg transition-colors hidden sm:block">Carrinho</span>
                            <div className="relative">
                                <ShoppingBag size={20} className="text-white group-hover:text-gusli-bg transition-colors" strokeWidth={1.5} />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-red-600 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        {itemCount}
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}
