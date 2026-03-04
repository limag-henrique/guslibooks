import { BookOpen } from 'lucide-react';

export default function SplashScreen() {
    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-out fade-out duration-500 delay-[2500ms] fill-mode-forwards pointer-events-none overflow-hidden">

            {/* Background Marquee */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full whitespace-nowrap opacity-10">
                <div className="animate-marquee inline-block text-[15vw] font-black text-gusli-highlight-2 uppercase tracking-widest">
                    NARRATIVE • IMAGINATION • CHAPTERS • JOURNEY • STORYTELLING • NARRATIVE • IMAGINATION •
                </div>
            </div>

            <div className="flex gap-4 mb-8 relative z-10">
                {/* 4 Bouncing Books */}
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="animate-bounce text-gusli-highlight-2"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    >
                        <BookOpen size={48} strokeWidth={1.5} />
                    </div>
                ))}
            </div>

            <h1 className="text-4xl font-extrabold text-gusli-highlight-2 tracking-tight opacity-0 animate-in fade-in duration-700 slide-in-from-bottom-5 relative z-10">
                Guzli livros
            </h1>
            <p className="text-gusli-highlight-1 mt-4 text-lg font-medium opacity-0 animate-in fade-in duration-700 delay-300 slide-in-from-bottom-2 relative z-10">
                Preparando as melhores histórias para você...
            </p>
        </div>
    );
}
