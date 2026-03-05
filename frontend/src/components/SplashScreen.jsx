import { BookOpen } from 'lucide-react';

export default function SplashScreen() {
    return (
        <div className="fixed inset-0 z-[100] bg-[#12271D] flex flex-col items-center justify-center pointer-events-none overflow-hidden pb-12">

            {/* Banner Icon */}
            <div className="mb-16 relative z-10">
                <img src="/íconebanner.png" alt="Ícone Banner" className="w-[120px] md:w-[150px] animate-pulse" />
            </div>

            {/* Bouncing Books Loader */}
            <div className="flex gap-4 mb-16 relative z-10 justify-center">
                {[...Array(4)].map((_, i) => (
                    <BookOpen
                        key={i}
                        size={64}
                        className="text-white animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                        strokeWidth={2}
                    />
                ))}
            </div>

            {/* Circulating Marquee of Genres */}
            <div className="w-full relative overflow-hidden flex items-center h-24 z-10">
                <div className="flex w-max animate-marquee gap-8" style={{ animationDuration: '15s' }}>
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 flex items-center">
                            <span className="font-sans font-black text-4xl sm:text-5xl text-gusli-green tracking-tighter leading-none">
                                Fantasia • Ficção Científica • Romance • Terror • Biografia • Mistério •
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cinematic Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        </div>
    );
}
