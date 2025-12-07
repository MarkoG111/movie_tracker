import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function BackToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`
                fixed bottom-8 right-8 p-6 rounded-full z-50
                bg-purple-600 text-white shadow-lg shadow-purple-500/30
                hover:bg-purple-700 transition-all
                ${
                    visible
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-90 pointer-events-none"
                }
            `}
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
}
