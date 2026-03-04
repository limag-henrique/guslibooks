import { useState, useEffect } from 'react';

export default function AdOptOut() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasOptedOut = localStorage.getItem('gusli_ad_opt_out');
        if (!hasOptedOut) {
            setTimeout(() => setIsVisible(true), 500);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('gusli_ad_opt_out', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gusli-highlight-2 text-gusli-bg p-4 z-50 transform transition-transform duration-500 translate-y-0">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-lg mb-1">We value your privacy (AdOptOut)</h3>
                    <p className="text-sm opacity-90 text-gusli-highlight-1">
                        GUSLI Books uses cookies to ensure you get the best browsing experience on our platform.
                        By continuing, you agree to our privacy conditions.
                    </p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={handleAccept}
                        className="text-gusli-highlight-2 bg-gusli-bg px-5 py-2 rounded-md font-medium hover:bg-white transition-colors"
                    >
                        Accept & Close
                    </button>
                </div>
            </div>
        </div>
    );
}
