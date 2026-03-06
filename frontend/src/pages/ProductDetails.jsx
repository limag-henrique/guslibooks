import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { API_URL } from '../config';

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
                const response = await axios.get(`${API_URL}/api/products`);
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
        <div className="min-h-screen bg-gusli-bg  group/page flex flex-col pt-32">

            <div className="max-w-[1600px] mx-auto px-6 md:px-12 w-full pb-20">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center gap-4 text-black hover:text-black mb-16 transition-colors font-bold text-sm tracking-wide "
                >
                    <ArrowLeft size={16} /> Voltar ao Catálogo
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start mb-32 relative">

                    {/* Left Typography Block */}
                    <div className="lg:col-span-5 flex flex-col order-2 lg:order-1 sticky top-32">
                        <div className="mb-8">
                            <span className="text-black tracking-wide font-bold text-lg mb-4 block">
                                {book.genre || 'Ficção'}
                            </span>
                            <h1 className="font-sans font-bold text-5xl md:text-7xl lg:text-8xl text-black tracking-tight leading-[0.85] mb-6">
                                {book.name}
                            </h1>
                            <p className="text-black text-sm tracking-wide mb-12 border-b border-black/20 pb-12">
                                Por <span
                                    className="underline cursor-pointer hover:text-gray-700"
                                    onClick={() => navigate(`/author/${encodeURIComponent(book.author)}`)}
                                >{book.author}</span>
                            </p>
                        </div>

                        <div className="prose prose-invert prose-lg text-black mb-8 font-light leading-relaxed max-w-none">
                            <p className="text-base md:text-xl opacity-90">
                                {(() => {
                                    const desc = book.long_description || book.description || '';
                                    // Match various formats: "(320)", "320 páginas", "320 Páginas" at the end or anywhere
                                    return desc.replace(/(?:\()?\d+\s*(?:páginas|paginas|Páginas|Paginas)(?:\))?/i, '')
                                        .replace(/\(\d+\)/, '') // Catch standalone parenthesized numbers if they were meant to be pages
                                        .replace(/\s\s+/g, ' ')
                                        .trim();
                                })()}
                            </p>
                        </div>

                        {/* Pages Section */}
                        {(() => {
                            const desc = book.long_description || book.description || '';
                            const pageMatchFull = desc.match(/(\d+)\s*(?:páginas|paginas|Páginas|Paginas)/i);
                            const pageMatchParen = desc.match(/\((\d+)\)/);
                            const pageCount = pageMatchFull ? pageMatchFull[1] : (pageMatchParen ? pageMatchParen[1] : null);

                            if (pageCount) {
                                return (
                                    <div className="mb-16">
                                        <p className="text-black font-bold text-sm tracking-widest uppercase pb-4 border-b border-black/10">
                                            {pageCount} páginas de pura empolgação
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </div>

                    {/* Right Image Block */}
                    <div className="lg:col-span-7 flex justify-center items-center order-1 lg:order-2 relative h-full w-full">
                        <img
                            src={`${API_URL}${book.image_path}`}
                            alt={book.name}
                            className="w-[180px] md:w-[220px] lg:w-[260px] max-w-none object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                            onError={(e) => { e.target.src = 'https://placehold.co/400x600/png?text=No+Cover' }}
                        />
                    </div>
                </div>

                {/* Checkout Block (Fixed Bottom / Floating Style) */}
                <div className="border-t border-black/20 pt-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 sticky bottom-0 bg-gusli-bg/95 backdrop-blur-md py-8 z-40">
                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-bold text-black tracking-wide"></span>
                        <span className="font-sans font-bold text-5xl md:text-6xl text-black leading-none">R$ {book.price.toFixed(2)}</span>
                    </div>

                    {variations ? (
                        <div className="w-full md:w-auto">
                            <label className="block text-[10px] font-bold text-black mb-3 tracking-wide">Variantes / Acabamento</label>
                            <select
                                value={selectedVariation}
                                onChange={(e) => setSelectedVariation(e.target.value)}
                                className="w-full md:w-64 border-b border-black/30 py-3 text-sm font-bold tracking-wide bg-transparent focus:outline-none text-black "
                            >
                                {variations.map(v => (
                                    <option key={v} value={v} className="bg-gusli-bg text-black">{v}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="w-full md:w-auto invisible">
                            {/* Spacing placeholder */}
                            <span className="block text-[10px] font-bold text-black mb-3 tracking-wide">-</span>
                        </div>
                    )}

                    <button
                        onClick={() => addToCart(book, 1, selectedVariation)}
                        className="bg-black text-gusli-bg px-12 py-5 transition-all shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] flex justify-center items-center gap-4 text-sm font-bold tracking-wide w-full md:w-auto rounded-full transform hover:-translate-y-1 border border-transparent hover:bg-white hover:text-[#12271D] hover:border-[#12271D]"
                    >
                        <ShoppingBag size={18} />
                        Adicionar ao carrinho
                    </button>
                </div>
            </div>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
                <div className="pt-24 border-t border-black/20 max-w-[1600px] mx-auto px-6 md:px-12 pb-24 w-full cursor-default">
                    <h2 className="font-sans font-bold text-4xl md:text-5xl text-black mb-16 tracking-tight">Obras Relacionadas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {recommendations.map((rec) => (
                            <div
                                key={rec.id}
                                className="group flex flex-col border border-black bg-white cursor-pointer relative"
                                onClick={() => {
                                    navigate(`/product/${rec.id}`);
                                    window.scrollTo(0, 0);
                                }}
                            >
                                <div className="relative aspect-[2/3] overflow-hidden bg-white border-b border-black">
                                    <img
                                        src={`${API_URL}${rec.image_path}`}
                                        alt={rec.name}
                                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-40"
                                        onError={(e) => { e.target.src = 'https://placehold.co/400x600/png?text=No+Cover' }}
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 text-center">
                                        <span className="font-bold text-black text-sm tracking-widest leading-relaxed uppercase">
                                            ver mais informações<br />acerca desta obra
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 p-6">
                                    <p className="text-[10px] tracking-[0.3em] font-bold text-black mb-2 uppercase">{rec.author}</p>
                                    <h3 className="font-sans text-xl font-bold text-black leading-tight tracking-tight mb-4">{rec.name}</h3>
                                    <p className="font-bold mt-auto border-t border-black/20 pt-4 text-sm text-black uppercase tracking-widest">R$ {rec.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
