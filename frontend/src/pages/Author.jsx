import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

export default function Author() {
    const { name } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const authorName = decodeURIComponent(name);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                const authorBooks = response.data.filter(b => b.author === authorName);
                setBooks(authorBooks);
            } catch (error) {
                console.error("Error fetching author books:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
        window.scrollTo(0, 0);
    }, [authorName]);

    if (loading) {
        return (
            <div className="flex-1 flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#12271D] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gusli-bg group/page flex flex-col pt-32">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 w-full pb-20">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-4 text-black hover:text-black mb-16 transition-colors font-bold text-sm tracking-wide"
                >
                    <ArrowLeft size={16} /> Voltar
                </button>

                <div className="mb-16">
                    <p className="text-black tracking-wide font-bold text-xl md:text-2xl mb-6">
                        Autor
                    </p>
                    <h1 className="font-sans font-bold text-5xl md:text-7xl lg:text-8xl text-black tracking-tight leading-[0.85] mb-6">
                        {authorName}
                    </h1>
                </div>

                {books.length === 0 ? (
                    <div className="text-center py-20 text-black">
                        <p className="font-bold tracking-widest text-sm uppercase">Nenhuma obra encontrada para este autor.</p>
                    </div>
                ) : (
                    <div>
                        <h2 className="font-sans font-bold text-3xl md:text-4xl text-black mb-12 tracking-tight">Obras Publicadas</h2>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 mt-10">
                            {books.map((book) => {
                                const variations = book.variations ? JSON.parse(book.variations) : null;
                                const selectedVariation = variations ? variations[0] : null;

                                return (
                                    <div
                                        key={book.id}
                                        className="group flex flex-col bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
                                        onClick={() => navigate(`/product/${book.id}`)}
                                    >
                                        <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5] flex items-center justify-center p-8">
                                            <img
                                                src={`http://localhost:3001${book.image_path}`}
                                                alt={book.name}
                                                className="max-w-full max-h-full object-contain transition-opacity duration-300 group-hover:opacity-50 drop-shadow-md"
                                                onError={(e) => { e.target.src = 'https://placehold.co/400x600/png?text=No+Cover' }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center z-10">
                                                <span className="font-bold text-black text-xs tracking-widest leading-relaxed uppercase">
                                                    ver mais informações<br />acerca desta obra
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col flex-1 p-4">
                                            <h3 className="font-sans font-bold text-sm text-black leading-snug tracking-tight mb-1">{book.name}</h3>

                                            <div className="mt-auto flex items-center justify-between border-t border-black/10 pt-3">
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
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
