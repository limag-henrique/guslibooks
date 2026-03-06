import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Wand2, Filter, Search, List, ShoppingCart } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_URL } from '../config';

export default function Products() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Filtering State
    const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'Ficção');
    const [maxBudget, setMaxBudget] = useState('');
    const [maxPages, setMaxPages] = useState(2000);

    const absoluteMaxPages = useMemo(() => {
        if (!books.length) return 2000;
        return Math.max(...books.map(b => b.pages || 0));
    }, [books]);

    useEffect(() => {
        if (books.length > 0) {
            setMaxPages(absoluteMaxPages);
        }
    }, [absoluteMaxPages, books.length]);

    // Update state if URL changes
    useEffect(() => {
        const urlGenre = searchParams.get('genre');
        if (urlGenre) {
            setSelectedGenre(urlGenre);
        }
    }, [searchParams]);

    // Track selected variations per product ID
    const [selections, setSelections] = useState({});

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/products`);
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleVariationChange = (productId, variation) => {
        setSelections(prev => ({ ...prev, [productId]: variation }));
    };

    const handleSidebarGenreClick = (genreToSelect) => {
        setSelectedGenre(genreToSelect);
        if (searchParams.has('search')) {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('search');
            if (genreToSelect !== 'Todas') {
                newParams.set('genre', genreToSelect);
            } else {
                newParams.delete('genre');
            }
            navigate(`/products?${newParams.toString()}`);
        }
    };

    const handleSurpriseMe = () => {
        if (books.length === 0) return;
        const randomBook = books[Math.floor(Math.random() * books.length)];
        navigate(`/product/${randomBook.id}`);
    };

    const genres = useMemo(() => {
        // Enforce specific categories as requested
        const wantedGenres = ["Fantasia", "Ficção", "Graphic Novel", "Romance", "Terror", "Thriller Psicológico"];

        // Find existing ones in DB, formatted nicely (case insensitive match if needed, here just checking exact if available)
        return wantedGenres;
    }, [books]);

    // Helper function to normalize text (remove accents, punctuation, convert to lowercase)
    const normalizeText = (text) => {
        if (!text) return '';
        return text
            .normalize('NFD') // Decompose combined graphemes into the combination of simple ones
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^\w\s]/gi, '') // Remove punctuation
            .toLowerCase();
    };

    const filteredBooks = useMemo(() => {
        const searchTerm = searchParams.get('search');
        const normalizedSearchTerm = searchTerm ? normalizeText(searchTerm) : '';

        return books.filter(b => {
            const matchesGenre = selectedGenre === 'Todas' || (b.genre && b.genre.toLowerCase() === selectedGenre.toLowerCase());
            const matchesBudget = !maxBudget || b.price <= parseFloat(maxBudget);
            const matchesPages = (b.pages || 0) <= maxPages;

            let matchesSearch = true;
            if (normalizedSearchTerm) {
                const normalizedTitle = normalizeText(b.name);
                const normalizedAuthor = normalizeText(b.author);
                const normalizedBookGenre = normalizeText(b.genre);
                matchesSearch = normalizedTitle.includes(normalizedSearchTerm) ||
                    normalizedAuthor.includes(normalizedSearchTerm) ||
                    normalizedBookGenre.includes(normalizedSearchTerm);
            }

            // If there's a search term, we override the sidebar genre filter 
            // to allow global searching across all categories.
            if (normalizedSearchTerm) {
                return matchesBudget && matchesPages && matchesSearch;
            }

            return matchesGenre && matchesBudget && matchesPages && matchesSearch;
        });
    }, [books, selectedGenre, maxBudget, maxPages, searchParams]);

    if (loading) {
        return (
            <div className="flex-1 flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#12271D] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gusli-bg  group/page">
            <div className="flex-1 w-full max-w-[1800px] mx-auto pt-24 pb-12 px-4 md:px-8">

                {/* Editorial Typography Header */}
                <div className="mb-16 mt-8 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-black/20 pb-8 relative z-10 w-full">
                    <div>
                        <h1 className="font-sans font-bold text-6xl md:text-8xl text-black uppercase tracking-tighter leading-none">Obras Literárias</h1>
                        <p className="text-black font-bold text-sm tracking-widest uppercase">
                            Exibindo {filteredBooks.length} obras conforme a seleção
                        </p>
                    </div>
                    {/* Glassmorphism Floating 'Surpreenda-me' Action now Top Right */}
                    <button
                        onClick={handleSurpriseMe}
                        className="w-16 h-16 md:w-24 md:h-24 bg-gusli-green text-white rounded-full flex flex-col items-center justify-center shadow-lg border border-transparent hover:border-[#12271D] hover:bg-white hover:text-[#12271D] hover:shadow-xl hover:scale-105 transition-all duration-500 group flex-shrink-0"
                    >
                        <Wand2 size={24} className="mb-1 group-hover:rotate-12 transition-transform duration-700" />
                        <span className="text-[10px] font-bold tracking-widest text-center px-2 uppercase">Aleatório</span>
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">

                    {/* Left Sticky Catalog Filters (Editorial) */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="sticky top-32 flex flex-col gap-12">

                            <div>
                                <h2 className="text-[10px] tracking-[0.3em] font-bold text-black mb-6 flex items-center gap-2">
                                    <List size={14} /> Coleções
                                </h2>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleSidebarGenreClick('Todas')}
                                        className={`text-left text-[10px] uppercase font-sans font-bold tracking-[0.3em] transition-all duration-300 ${selectedGenre === 'Todas' ? 'text-gusli-green translate-x-3' : 'text-black hover:text-gusli-green hover:translate-x-1 '}`}
                                    >
                                        Todas
                                    </button>
                                    {genres.map((genre) => (
                                        <button
                                            key={genre}
                                            onClick={() => handleSidebarGenreClick(genre)}
                                            className={`text-left text-[10px] uppercase font-sans font-bold tracking-[0.3em] transition-all duration-300 ${selectedGenre === genre ? 'text-gusli-green translate-x-3' : 'text-black hover:text-gusli-green hover:translate-x-1 '}`}
                                        >
                                            {genre}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-[10px] tracking-[0.3em] font-bold text-black mb-6 flex items-center gap-2">
                                    <Filter size={14} /> Orcamento Máx
                                </h2>
                                <div className="flex items-center border-b border-black/30 pb-2">
                                    <span className="text-black font-display text-lg mr-2">R$</span>
                                    <input
                                        type="number"
                                        placeholder="Valor..."
                                        value={maxBudget}
                                        onChange={(e) => setMaxBudget(e.target.value)}
                                        className="w-full bg-transparent border-none text-black font-bold placeholder-black/50 focus:outline-none focus:ring-0 text-sm "
                                    />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-[10px] tracking-[0.3em] font-bold text-black mb-6 flex items-center gap-2">
                                    <Filter size={14} /> Limite de Páginas: <span className="text-black">{maxPages}</span>
                                </h2>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max={absoluteMaxPages}
                                        value={maxPages}
                                        onChange={(e) => setMaxPages(parseInt(e.target.value))}
                                        className="w-full h-0.5 bg-black/20 rounded-lg appearance-none accent-gusli-green"
                                    />
                                    <div className="flex justify-between text-[10px] text-black font-bold mt-1 tracking-widest">
                                        <span>0</span>
                                        <span>{absoluteMaxPages}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedGenre('Todas');
                                    setMaxBudget('');
                                    setMaxPages(absoluteMaxPages);
                                    navigate('/products');
                                }}
                                className="text-[10px] font-bold text-black tracking-[0.3em] hover:text-black transition-colors  self-start mt-6"
                            >
                                / Limpar
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Grid */}
                    {/* Main Content Grid (Broken/Asymmetrical) */}
                    <div className="flex-1">
                        {filteredBooks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center text-black border border-black/10 rounded-3xl">
                                <Search size={48} className="mb-6 opacity-20" />
                                <h3 className="font-sans text-4xl text-black tracking-tight mb-2">Vazio</h3>
                                <p className="font-bold tracking-widest text-xs">Nenhuma obra na curadoria bate com estes filtros específicos.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8 w-full">
                                {filteredBooks.map((book) => {
                                    const variations = book.variations ? JSON.parse(book.variations) : null;
                                    const selectedVariation = selections[book.id] || (variations ? variations[0] : null);

                                    return (
                                        <div
                                            key={book.id}
                                            className="group flex flex-col bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
                                            onClick={() => navigate(`/product/${book.id}`)}
                                        >
                                            <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
                                                <img
                                                    src={`${API_URL}${book.image_path}`}
                                                    alt={book.name}
                                                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
                                                    onError={(e) => { e.target.src = 'https://placehold.co/400x600/png?text=No+Cover' }}
                                                />
                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
                                                    <span className="font-bold text-black text-xs tracking-widest leading-relaxed uppercase">
                                                        ver mais informações<br />acerca desta obra
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col flex-1 p-4">
                                                <h3 className="font-sans font-bold text-sm text-black leading-snug tracking-tight mb-1">
                                                    {book.name}
                                                </h3>
                                                <p className="text-xs text-black/50 mb-3">{book.author}</p>

                                                {variations && (
                                                    <div className="mb-3">
                                                        <select
                                                            value={selectedVariation}
                                                            onChange={(e) => handleVariationChange(book.id, e.target.value)}
                                                            className="w-full border-b border-black/20 py-1 text-[10px] font-bold tracking-widest uppercase bg-transparent focus:outline-none text-black cursor-pointer"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {variations.map(v => (
                                                                <option key={v} value={v} className="bg-white text-black">{v}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}

                                                <div className="mt-auto flex items-center justify-between pt-3 border-t border-black/10">
                                                    <span className="font-bold text-lg text-black">R$ {book.price.toFixed(2)}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); addToCart(book, 1, selectedVariation); }}
                                                        className="flex items-center justify-center bg-[#f0f0f0] hover:bg-white hover:text-[#12271D] hover:border-[#12271D] border border-transparent text-black transition-colors p-2 rounded-full"
                                                        aria-label="Adicionar ao carrinho"
                                                    >
                                                        <ShoppingCart size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Removed the fixed button as it was relocated to the top header grid */}
        </div>
    );
}
