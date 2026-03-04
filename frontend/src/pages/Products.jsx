import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Wand2, Filter, Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Products() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Filtering State
    const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'Todas');
    const [maxBudget, setMaxBudget] = useState('');

    // Update state if URL changes
    useEffect(() => {
        const urlGenre = searchParams.get('genre');
        if (urlGenre) {
            setSelectedGenre(urlGenre);
        }
    }, [searchParams]);

    // Track selected variations per product ID
    const [selections, setSelections] = useState({});
    const [fetchErr, setFetchErr] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
                setFetchErr(error.message || "Failed to fetch");
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleVariationChange = (productId, variation) => {
        setSelections(prev => ({ ...prev, [productId]: variation }));
    };

    const handleSurpriseMe = () => {
        if (books.length === 0) return;
        const randomBook = books[Math.floor(Math.random() * books.length)];
        navigate(`/product/${randomBook.id}`);
    };

    const genres = useMemo(() => {
        const uniqueGenres = new Set(books.map(b => b.genre).filter(Boolean));
        return ['Todas', ...Array.from(uniqueGenres).sort()];
    }, [books]);

    const filteredBooks = useMemo(() => {
        return books.filter(b => {
            const matchesGenre = selectedGenre === 'Todas' || b.genre === selectedGenre;
            const matchesBudget = !maxBudget || b.price <= parseFloat(maxBudget);
            return matchesGenre && matchesBudget;
        });
    }, [books, selectedGenre, maxBudget]);

    if (loading) {
        return (
            <div className="flex-1 flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#12271D] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-12 flex flex-col md:flex-row gap-10">

            {/* Left Sidebar */}
            <aside className="w-full md:w-64 shrink-0 flex flex-col gap-8">
                <div>
                    <h2 className="text-sm uppercase tracking-widest font-bold text-gray-500 mb-4 flex items-center gap-2">
                        <Filter size={16} /> Categorias
                    </h2>
                    <div className="flex flex-col gap-1">
                        {genres.map(genre => (
                            <button
                                key={genre}
                                onClick={() => {
                                    setSelectedGenre(genre);
                                    navigate(genre === 'Todas' ? '/products' : `/products?genre=${encodeURIComponent(genre)}`);
                                }}
                                className={`text-left px-3 py-2 rounded-lg font-medium transition-all ${selectedGenre === genre
                                    ? 'bg-[#12271D] text-white shadow-md'
                                    : 'text-gray-600 hover:bg-white hover:text-[#12271D]'
                                    }`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-sm uppercase tracking-widest font-bold text-gray-500 mb-4 flex items-center gap-2">
                        <Search size={16} /> Filtrar Preço
                    </h2>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-400">Orçamento Máximo (R$)</label>
                        <input
                            type="number"
                            placeholder="Ex: 50.00"
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(e.target.value)}
                            className="w-full border-b pb-2 text-lg font-bold text-[#12271D] focus:outline-none focus:border-[#12271D] bg-transparent"
                            min="0"
                        />
                    </div>
                </div>

                <button
                    onClick={() => {
                        setSelectedGenre('Todas');
                        setMaxBudget('');
                        navigate('/products');
                    }}
                    className="mt-auto text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-[#12271D] text-center"
                >
                    Resetar Filtros
                </button>
            </aside>

            {/* Main Content Grid */}
            <main className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#12271D] tracking-tight mb-2">
                            {selectedGenre === 'Todas' ? 'Catálogo Completo' : selectedGenre}
                        </h1>
                        <p className="text-gray-500 font-medium">Exibindo {filteredBooks.length} obras.</p>
                    </div>
                    <button
                        onClick={handleSurpriseMe}
                        className="flex justify-center items-center gap-2 bg-[#12271D] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-all whitespace-nowrap"
                    >
                        <Wand2 size={20} />
                        Surpreenda-me
                    </button>
                </div>

                {filteredBooks.length === 0 ? (
                    <div className="py-20 text-center">
                        <h3 className="text-2xl font-bold text-gray-400">Nenhum livro encontrado nestes critérios.</h3>
                        {fetchErr && <p className="text-red-500 font-bold mt-4">Erro de conexão: {fetchErr}</p>}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBooks.map(book => {
                            const variations = book.variations ? JSON.parse(book.variations) : null;
                            const selectedVariation = selections[book.id] || (variations ? variations[0] : null);

                            return (
                                <div key={book.id} className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden h-full group animate-in fade-in zoom-in-95">
                                    <div
                                        className="relative aspect-[2/3] overflow-hidden bg-gray-50 p-4 cursor-pointer"
                                        onClick={() => navigate(`/product/${book.id}`)}
                                    >
                                        <img
                                            src={`http://localhost:3001${book.image_path}`}
                                            alt={book.name}
                                            className="w-full h-full object-contain rounded shadow-md transform group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => { e.target.src = 'https://placehold.co/400x600/png?text=No+Cover' }}
                                        />
                                    </div >

                                    <div className="p-6 flex flex-col flex-1">
                                        <div
                                            className="cursor-pointer group-hover:text-gray-500 transition-colors"
                                            onClick={() => navigate(`/product/${book.id}`)}
                                        >
                                            <h3 className="font-bold text-lg text-[#12271D] line-clamp-2 leading-tight mb-1">{book.name}</h3>
                                            <p className="text-sm text-gray-500 mb-3">{book.author}</p>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-6 line-clamp-3 font-medium">{book.short_description || book.description}</p>

                                        {variations && (
                                            <div className="mb-4">
                                                <select
                                                    value={selectedVariation}
                                                    onChange={(e) => handleVariationChange(book.id, e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-50 focus:outline-none focus:border-[#12271D] cursor-pointer"
                                                >
                                                    {variations.map(v => (
                                                        <option key={v} value={v}>{v}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                                            <span className="font-black text-lg text-[#12271D]">R$ {book.price.toFixed(2)}</span>
                                            <button
                                                onClick={() => addToCart(book, 1, selectedVariation)}
                                                className="bg-[#12271D] text-white hover:bg-black px-4 py-2 rounded-full transition-colors flex items-center gap-2 text-sm font-bold shadow-md"
                                            >
                                                <ShoppingBag size={16} /> Adicionar
                                            </button>
                                        </div>
                                    </div>
                                </div >
                            );
                        })}
                    </div >
                )}
            </main >
        </div >
    );
}
