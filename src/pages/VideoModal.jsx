import { useEffect } from "react";

export default function VideoModal({ open, onClose }) {
    // lock scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/90
                 flex items-center justify-center"
        >
            {/* CLOSE BUTTON */}
            <button
                onClick={onClose}
                className="absolute top-4 right-5 text-white text-4xl z-[10000]"
            >
                ×
            </button>

            {/* VIDEO */}
            <div className="w-[92%] max-w-4xl aspect-video">
                <iframe
                    className="w-full h-full rounded-md"
                    src="https://www.youtube.com/embed/wj2p4BIsR6w?autoplay=1&rel=0"
                    title="Spring Fest Aftermovie"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
