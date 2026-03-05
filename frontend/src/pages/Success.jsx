import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function Success() {
    return (
        <div className="min-h-screen bg-gusli-green flex flex-col justify-center items-center px-4 text-center">
            <CheckCircle size={64} className="text-white mb-8" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white mb-6 uppercase tracking-tight">
                pedido realizado
            </h1>
            <p className="text-lg md:text-xl text-white max-w-2xl font-medium leading-relaxed mb-12 opacity-90">
                Já enviamos todas as informações para seu e-mail e número cadastrado. Agora é só sentar e pensar nas suas próximas aventuras literárias ;)
            </p>
            <Link
                to="/products"
                className="bg-white text-gusli-green px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-gray-100 transition-colors shadow-lg"
            >
                Continuar Comprando
            </Link>
        </div>
    );
}
