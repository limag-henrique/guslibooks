import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gusli-highlight-1 py-12 mt-10">
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <img src="http://localhost:3001/visual/logo.png" alt="GUSLI Books Logo" className="h-8 opacity-75 grayscale hover:grayscale-0 transition-all" />
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} GUSLI Books POC.
                    </p>
                </div>

                <div className="flex gap-4 text-sm text-gray-600">
                    <Link to="/" className="hover:text-black transition-colors">Política de Privacidade</Link>
                    <Link to="/" className="hover:text-black transition-colors">Termos de Serviço</Link>
                    <Link to="/contact" className="hover:text-black transition-colors">Contato</Link>
                    <Link to="/account" className="hover:text-black transition-colors">Conta</Link>
                </div>
            </div>
        </footer>
    );
}
