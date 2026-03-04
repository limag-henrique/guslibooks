import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [variations, setVariations] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                // Fetch all books to find current and compute recommendations
                const response = await axios.get('http://localhost:3001/api/products');
                const allBooks = response.data;
                const foundBook = allBooks.find(b => b.id === parseInt(id));

                if (foundBook) {
                    setBook(foundBook);
                    const vars = foundBook.variations ? JSON.parse(foundBook.variations) : null;
                    const conts = foundBook.continuations ? JSON.parse(foundBook.continuations) : null;
                    setVariations(vars);
                    if (vars) setSelectedVariation(vars[0]);

                    // Generate recommendations
                    let recs = [];
                    // 1. Add continuations if they exist
                    if (conts) {
                        conts.forEach(cName => {
                            const match = allBooks.find(b => b.name === cName);
                            if (match) recs.push(match);
                        });
                    }
                    // 2. Add same author
                    const sameAuthor = allBooks.filter(b => b.author === foundBook.author && b.id !== foundBook.id);
                    recs = [...recs, ...sameAuthor];

                    // 3. Add same genre
                    const sameGenre = allBooks.filter(b => b.genre === foundBook.genre && b.id !== foundBook.id);
                    recs = [...recs, ...sameGenre];

                    // Remove duplicates
                    const uniqueRecs = recs.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

                    // Keep up to 4
                    setRecommendations(uniqueRecs.slice(0, 4));
                }
            } catch (error) {
                console.error("Error fetching book details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex-1 flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#12271D] border-t-transparent"></div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold text-[#12271D] mb-4">Livro não encontrado</h2>
                <button onClick={() => navigate('/products')} className="text-[#12271D] underline">
                    Voltar ao catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
            <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors font-bold uppercase text-sm tracking-widest"
            >
                <ArrowLeft size={20} /> Voltar ao catálogo
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
                {/* Image Section */}
                <div className="bg-gray-50 rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 flex justify-center items-center min-h-[500px]">
                    <img
                        src={`http://localhost:3001${book.image_path}`}
                        alt={book.name}
                        className="max-w-full h-auto max-h-[600px] object-contain rounded drop-shadow-2xl"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x600/png?text=No+Cover' }}
                    />
                </div>

                {/* Info Section */}
                <div className="flex flex-col">
                    <div className="mb-2 flex items-center gap-3">
                        <span className="bg-[#12271D] text-white px-3 py-1 rounded text-xs font-bold tracking-widest uppercase shadow-sm">
                            {book.genre || 'Ficção'}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#12271D] leading-tight mb-2 mt-4 tracking-tight">
                        {book.name}
                    </h1>
                    <p className="text-xl text-gray-400 font-medium mb-8">Por {book.author}</p>

                    <div className="prose prose-lg text-gray-600 mb-10 leading-relaxed font-light">
                        <h3 className="font-bold text-[#12271D] mb-4 text-xl uppercase tracking-widest text-sm">Sinopse</h3>
                        <p>{book.long_description || book.description}</p>
                    </div>

                    <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-6 transform hover:-translate-y-1 transition-transform">
                        <div className="flex items-center justify-between border-b pb-6 border-gray-100">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Preço</span>
                            <span className="text-4xl font-black text-[#12271D]">R$ {book.price.toFixed(2)}</span>
                        </div>

                        {variations && (
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Edição da Capa</label>
                                <select
                                    value={selectedVariation}
                                    onChange={(e) => setSelectedVariation(e.target.value)}
                                    className="w-full border-2 border-gray-200 rounded-xl p-4 text-base bg-gray-50 focus:outline-none focus:border-[#12271D] transition-colors cursor-pointer font-medium"
                                >
                                    {variations.map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            onClick={() => addToCart(book, 1, selectedVariation)}
                            className="bg-[#12271D] text-white hover:bg-black w-full py-5 rounded-xl transition-all shadow-md hover:shadow-xl flex justify-center items-center gap-3 text-lg font-bold uppercase tracking-wider"
                        >
                            <ShoppingBag size={24} />
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            </div>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
                <div className="pt-16 border-t border-gray-200">
                    <h2 className="text-3xl font-extrabold text-[#12271D] mb-8 tracking-tight">Recomendações para você</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendations.map(rec => (
                            <div
                                key={rec.id}
                                className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden cursor-pointer"
                                onClick={() => {
                                    navigate(`/product/${rec.id}`);
                                    window.scrollTo(0, 0);
                                }}
                            >
                                <div className="aspect-[2/3] bg-gray-50 p-4">
                                    <img
                                        src={`http://localhost:3001${rec.image_path}`}
                                        alt={rec.name}
                                        className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                                        onError={(e) => { e.target.src = 'https://placehold.co/400x600/png?text=No+Cover' }}
                                    />
                                </div>
                                <div className="p-4 border-t border-gray-100">
                                    <h3 className="font-bold text-[#12271D] line-clamp-1">{rec.name}</h3>
                                    <p className="text-sm text-gray-400">{rec.author}</p>
                                    <p className="font-black mt-2 text-[#12271D]">R$ {rec.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
