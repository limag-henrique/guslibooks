import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function Home() {
    const [randomBooks, setRandomBooks] = useState([]);
    const [allGenres, setAllGenres] = useState([]);
    const { addToCart } = useCart();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                const allBooks = response.data;
                const shuffled = [...allBooks].sort(() => 0.5 - Math.random());
                setRandomBooks(shuffled.slice(0, 4));

                // Extract all valid unique genres
                const existingGenres = Array.from(new Set(allBooks.map(b => b.genre))).filter(Boolean);
                setAllGenres(existingGenres);
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleCategoryClick = (category) => {
        navigate(`/products?genre=${encodeURIComponent(category)}`);
    };

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast multiplier
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center py-16 px-4 md:py-24 bg-gusli-bg">
                <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#12271D] mb-6 leading-tight tracking-tight max-w-4xl">
                        Uma seleção exclusiva de livros que valem a pena.
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl font-medium tracking-wide">
                        Livros que você realmente vai ler, não apenas deixar acumulando poeira.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 bg-[#12271D] text-white shadow-xl hover:shadow-2xl font-bold px-10 py-4 rounded-full hover:bg-black hover:-translate-y-1 transform transition-all uppercase tracking-widest text-sm"
                    >
                        Explorar Coleção
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Glassmorphism Category Wheel / Carousel */}
            <section
                className="relative py-32 px-4 transition-all duration-700 ease-in-out bg-[#12271D]"
            >
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 drop-shadow-md">Descubra Seu Novo Gênero</h2>

                    <div
                        ref={scrollRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        className="flex overflow-x-hidden gap-4 p-6 md:p-8 w-full mx-auto rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl cursor-grab active:cursor-grabbing hide-scrollbar select-none"
                    >
                        {allGenres.length === 0 ? (
                            <p className="text-white w-full text-center">Carregando Gêneros...</p>
                        ) : (
                            allGenres.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryClick(cat)}
                                    className="flex-shrink-0 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 bg-transparent text-white border border-white/20 hover:bg-white hover:text-[#12271D] hover:scale-[1.03]"
                                >
                                    {cat}
                                </button>
                            ))
                        )}
                    </div>

                    <p className="text-white/60 mt-8 font-medium">
                        Deslize o mouse para girar a roda e selecione um gênero.
                    </p>
                </div>
            </section>

            {/* 4 Random Books */}
            <section className="py-20 px-4 bg-gusli-bg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-12 border-b border-gray-200 pb-4">
                        <h2 className="text-3xl font-bold text-[#12271D]">Recomendações Exclusivas</h2>
                        <Link to="/products" className="text-[#12271D] font-bold hover:text-black hover:underline flex items-center gap-1 uppercase text-sm tracking-wider">
                            Ver todos os produtos <ArrowRight size={16} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-gray-200 aspect-[2/3] rounded-xl"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {randomBooks.map(book => (
                                <div key={book.id} className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gusli-highlight-1 overflow-hidden h-full">
                                    <div
                                        className="relative aspect-[2/3] overflow-hidden bg-gray-50 p-4 cursor-pointer"
                                        onClick={() => navigate(`/product/${book.id}`)}
                                    >
                                        <img
                                            src={`http://localhost:3001${book.image_path}`}
                                            alt={book.name}
                                            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 rounded shadow-md"
                                            onError={(e) => { e.target.src = 'https://placehold.co/400x600/png?text=No+Cover' }}
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3
                                            className="font-bold text-lg text-gusli-highlight-2 line-clamp-2 leading-tight mb-2 cursor-pointer hover:text-black transition-colors"
                                            onClick={() => navigate(`/product/${book.id}`)}
                                        >
                                            {book.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-4">{book.author}</p>
                                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gusli-highlight-1/50">
                                            <span className="font-bold text-lg text-black">R$ {book.price.toFixed(2)}</span>
                                            <button
                                                onClick={() => addToCart(book)}
                                                className="bg-gusli-highlight-1 hover:bg-[#12271D] hover:text-white p-3 rounded-full transition-colors text-gusli-highlight-2"
                                                aria-label="Add to cart"
                                            >
                                                <ShoppingBag size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Seamless Infinite Animated Marquee */}
            <section className="relative overflow-hidden py-8 flex items-center bg-white border-y border-gray-100 h-24">
                <div className="flex w-max animate-marquee gap-8">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 flex items-center">
                            <span className="text-3xl sm:text-4xl font-black text-gray-200 uppercase tracking-widest leading-none">
                                {(allGenres.length > 0 ? allGenres : ['CARREGANDO']).join(' • ')} •
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
