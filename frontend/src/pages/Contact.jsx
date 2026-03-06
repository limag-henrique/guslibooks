import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#12271D] mb-4 text-center tracking-tight">Fale Conosco</h1>
            <p className="text-black mb-12 text-center max-w-2xl text-lg font-medium">Estamos aqui para ajudar. Entre em contato através de um dos canais abaixo ou visite nossa sede corporativa para tomar um café literário.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mb-16">
                {/* Email */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 transition-colors text-[#12271D]">
                        <Mail size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#12271D] mb-2">Suporte</h3>
                    <p className="text-black mb-4 font-medium text-sm">Respostas em até 24h úteis</p>
                    <a href="mailto:henriquelimagusmao@gmail.com" className="text-[#12271D] font-black underline underline-offset-4 decoration-2">henriquelimagusmao@gmail.com</a>
                </div>

                {/* Telephone */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 transition-colors text-[#12271D]">
                        <Phone size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#12271D] mb-2">Telefone</h3>
                    <p className="text-black mb-4 font-medium text-sm">Seg a Sex, 09h - 18h</p>
                    <a href="tel:+5531994217926" className="text-[#12271D] font-black underline underline-offset-4 decoration-2">(31) 99421-7926</a>
                </div>

                {/* Address */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 transition-colors text-[#12271D]">
                        <MapPin size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#12271D] mb-2">Sede Corporativa</h3>
                    <p className="text-black mb-4 font-medium text-sm">Belo Horizonte - MG</p>
                    <p className="text-[#12271D] font-bold text-sm">R. Levindo Lopes, 357<br />5º Andar<br />CEP: 30140-170</p>
                </div>

                {/* Working Hours */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 transition-colors text-[#12271D]">
                        <Clock size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#12271D] mb-2">Horários</h3>
                    <p className="text-black mb-4 font-medium text-sm">Atendimento Presencial</p>
                    <p className="text-[#12271D] font-bold text-sm">Segunda a Sexta:<br />Das 09:00 às 18:00<br />Sábados: 09:00 às 13:00</p>
                </div>
            </div>

            <div className="w-full bg-white rounded-3xl p-10 md:p-16 text-center border border-gray-100">
                <h2 className="text-2xl font-bold text-[#12271D] mb-4">Gusli Livros e Cultura</h2>
                <p className="text-black font-medium max-w-lg mx-auto">CNPJ: 45.123.456/0001-89</p>
            </div>
        </div>
    );
}
