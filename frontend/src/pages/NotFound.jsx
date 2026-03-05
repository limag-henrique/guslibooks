import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 bg-gusli-bg pt-20">
            <h1 className="text-4xl md:text-5xl font-bold text-gusli-green mb-6 text-center">
                Página não encontrada
            </h1>
            <p className="text-lg md:text-xl text-black text-center max-w-2xl font-medium">
                Infelizmente tivemos um erro aqui... o que acha de seguirmos para os livros de <Link to="/products?genre=Ficção" className="text-gusli-green underline hover:font-bold transition-all">Ficção</Link> para imaginarmos como se nada tivesse dado errado?
            </p>
        </div>
    );
}
