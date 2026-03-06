import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowRight, ShoppingCart, TreePine, Leaf } from 'lucide-react';
import { API_URL } from '../config';

export default function Home() {
    const [randomBooks, setRandomBooks] = useState([]);
    const [allGenres, setAllGenres] = useState([]);
    const { addToCart } = useCart();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/products`);
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

    return (
        <div className="relative w-full min-h-screen bg-gusli-bg overflow-hidden group/page flex flex-col">

            {/* Solid Green Banner Hero */}
            <section className="relative w-full pt-48 pb-32 flex items-center justify-center overflow-hidden bg-[#12271D]">
                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center md:text-left text-white">
                    <img src="/íconebanner.png" alt="Ícone Banner" className="w-[120px] md:w-[150px] animate-in fade-in slide-in-from-bottom-4 duration-1000" />
                    <div className="flex flex-col items-center md:items-start">
                        <p className="text-white tracking-wide font-bold text-xl md:text-2xl mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            Seleção de livros que não pegam poeira na estante
                        </p>

                        <h1 className="font-sans font-bold text-[8vw] md:text-[6vw] leading-[0.85] text-white tracking-tight mb-10 max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            Obras com <br /> impressão humanizada.
                        </h1>
                    </div>
                </div>
            </section>

            {/* Environmental Impact Section */}
            <section className="bg-gusli-bg py-32 px-6 max-w-[1600px] mx-auto w-full border-b border-black/10">
                <div className="max-w-[1200px] mx-auto">
                    <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-[#12271D] text-center tracking-tight mb-16">
                        O que você também compra com seu livro?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Card 1: The Problem */}
                        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8 md:p-12 flex flex-col items-start border border-black/5">
                            <div className="bg-[#12271D]/10 p-4 rounded-full mb-8">
                                <TreePine size={32} strokeWidth={1.5} className="text-[#12271D]" />
                            </div>
                            <h3 className="font-sans font-bold text-2xl text-[#12271D] mb-4 tracking-tight">
                                Problemas ocultos
                            </h3>
                            <p className="text-black/80 font-light text-lg leading-relaxed">
                                A indústria tradicional esconde um lado insustentável: desperdício de papel, impacto ambiental e autores mal remunerados.
                            </p>
                        </div>

                        {/* Card 2: The Solution */}
                        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8 md:p-12 flex flex-col items-start border border-black/5">
                            <div className="bg-[#12271D]/10 p-4 rounded-full mb-8">
                                <Leaf size={32} strokeWidth={1.5} className="text-[#12271D]" />
                            </div>
                            <h3 className="font-sans font-bold text-2xl text-[#12271D] mb-4 tracking-tight">
                                Nossa solução
                            </h3>
                            <p className="text-black/80 font-light text-lg leading-relaxed">
                                Nossas obras são 100% impressas sob demanda com materiais recicláveis, mão de obra ética e royalties justos para quem as produz.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4 Random Books */}
            <section className="py-32 px-6 max-w-[1600px] mx-auto w-full">
                <div className="flex justify-between items-end mb-16">
                    <h2 className="font-sans font-bold text-5xl md:text-7xl text-black tracking-tight">Livros que <br /> valem a leitura</h2>
                    <Link to="/products" className="text-black font-bold hover:text-gusli-green transition-colors flex items-center gap-2 text-sm tracking-wide mb-2">
                        Ver coleção inteira <ArrowRight size={16} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-white border border-[black] aspect-[2/3] w-full"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 mt-10">
                        {randomBooks.map((book) => (
                            <div
                                key={book.id}
                                className="group flex flex-col bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
                                onClick={() => navigate(`/product/${book.id}`)}
                            >
                                {/* Image Box */}
                                <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5] flex items-center justify-center p-8">
                                    <img
                                        src={`${API_URL}${book.image_path}`}
                                        alt={book.name}
                                        className="max-w-full max-h-full object-contain transition-opacity duration-300 group-hover:opacity-50 drop-shadow-md"
                                        onError={(e) => { e.target.src = 'https://placehold.co/400x600/png?text=No+Cover' }}
                                    />
                                    {/* Hover Overlay Text Centered */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center z-10">
                                        <span className="font-bold text-black text-xs tracking-widest leading-relaxed uppercase">
                                            ver mais informações<br />acerca desta obra
                                        </span>
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="flex flex-col flex-1 p-4">
                                    <h3 className="font-sans font-bold text-sm text-black leading-snug tracking-tight mb-1">
                                        {book.name}
                                    </h3>
                                    <p className="text-xs text-black/50 mb-3">{book.author}</p>
                                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-black/10">
                                        <span className="font-bold text-lg text-black">R$ {book.price.toFixed(2)}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); addToCart(book); }}
                                            className="flex items-center justify-center bg-[#f0f0f0] hover:bg-white hover:text-[#12271D] hover:border-[#12271D] border border-transparent text-black transition-colors p-2 rounded-full"
                                            aria-label="Adicionar ao carrinho"
                                        >
                                            <ShoppingCart size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Descubra Seu Novo Gênero */}
            <section className="py-24 px-6 w-full bg-[#12271D]">
                <div className="max-w-[1600px] mx-auto">
                    <h2 className="font-sans font-bold text-4xl text-white tracking-tight mb-12 text-center">Descubra sua próxima leitura</h2>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {allGenres.slice(0, 6).map((genre, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleCategoryClick(genre)}
                                className="px-6 py-3 border border-white rounded-full text-white tracking-wide text-sm font-bold hover:bg-gusli-bg hover:text-gusli-green hover:border-black hover:shadow-[0_4px_10px_rgba(0,0,0,0.5)] active:bg-gusli-bg active:text-gusli-green active:border-black active:shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all bg-transparent mt-4"
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scrolling Genre Marquee */}
            <div className="w-full bg-gusli-bg py-5 overflow-hidden">
                <div className="flex w-max animate-marquee gap-12">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 flex items-center gap-12">
                            {["Fantasia", "Ficção", "Graphic Novel", "Romance", "Terror", "Thriller Psicológico"].map(g => (
                                <span key={g} className="font-sans font-black text-xl text-black tracking-[0.2em] uppercase whitespace-nowrap">
                                    {g} <span className="text-gusli-green mx-3">•</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
