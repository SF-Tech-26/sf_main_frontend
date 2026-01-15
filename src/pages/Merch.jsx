import { useState, useEffect } from "react";

// Backgrounds
import bgDesktop from "../assets/merchbg.jpeg";
import bgMobile from "../assets/merchPHONE.jpeg";

// Hoodie Images
import Yellowhoodie from "../assets/Yellowhoodie.png";
import Bluehoodie from "../assets/Bluehoodie.png";
import Orangehoodie from "../assets/Orangehoodie.png";

/* PRODUCTS */
const PRODUCTS = [
    {
        id: "rm-hoodie",
        name: "RINGMASTER HOODIE",
        shortName: "RGM",
        price: 1299,
        image: Yellowhoodie,
    },
    {
        id: "nw-hoodie",
        name: "Nightwalker Hoodie",
        shortName: "NGW",
        price: 1299,
        image: Bluehoodie,
    },
    {
        id: "kr-hoodie",
        name: "KARMA ROLLS HOODIE",
        shortName: "KRM",
        price: 1299,
        image: Orangehoodie,
    },
];

const SIZES = ["XS", "S", "M", "L", "XL"];

export default function Merch() {
    const [bg, setBg] = useState(bgDesktop);
    const [page, setPage] = useState("merch");
    const [cart, setCart] = useState({});
    const [toast, setToast] = useState(null);

    // Dynamic Background Switcher
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setBg(bgMobile);
            } else {
                setBg(bgDesktop);
            }
        };

        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const cartCount = Object.values(cart).reduce(
        (sum, i) => sum + i.qty,
        0
    );

    const addToCart = (product, size) => {
        const cartKey = `${product.id}-${size}`;
        setCart((prev) => ({
            ...prev,
            [cartKey]: {
                product,
                size,
                qty: (prev[cartKey]?.qty || 0) + 1,
            },
        }));

        setToast({
            id: Date.now(),
            message: `${product.name} (${size}) added to cart`,
        });
    };

    // Helper to trigger warning toast
    const showToast = (msg) => {
        setToast({
            id: Date.now(),
            message: msg
        });
    };

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 1200);
        return () => clearTimeout(t);
    }, [toast]);

    const updateQty = (key, delta) => {
        setCart((prev) => {
            const item = prev[key];
            if (!item) return prev;

            const newQty = item.qty + delta;
            if (newQty <= 0) {
                const copy = { ...prev };
                delete copy[key];
                return copy;
            }

            return {
                ...prev,
                [key]: { ...item, qty: newQty },
            };
        });
    };

    return (
        <div
            className="w-full min-h-screen bg-fixed bg-cover bg-center bg-no-repeat
                       px-4 pt-20 pb-10 md:px-16 md:pt-4
                       text-[#f5e9dc]
                       overflow-x-hidden"
            style={{
                backgroundImage: `url(${bg})`,
                fontFamily: '"Cinzel Decorative", serif',
            }}
        >
            {page === "merch" && (
                <MerchPage
                    onViewCart={() => setPage("cart")}
                    onAdd={addToCart}
                    onToast={showToast}
                    cartCount={cartCount}
                />
            )}

            {page === "cart" && (
                <CartPage
                    cart={cart}
                    onBack={() => setPage("merch")}
                    onQtyChange={updateQty}
                />
            )}

            {/* 🔮 PURPLE TOAST */}
            {toast && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2
                                px-6 py-3 rounded-xl text-sm font-semibold
                                bg-gradient-to-r from-orange-500 to-amber-500
                                text-white
                                shadow-[0_0_30px_rgba(249,115,22,0.6)]
                                z-[9999]"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}

/* ---------------- MERCH PAGE ---------------- */

function MerchPage({ onViewCart, onAdd, onToast, cartCount }) {
    return (
        <>
            {/* Cart Button */}
            <div className="fixed top-4 right-4 z-50">
                {/* Desktop */}
                <button
                    className="hidden md:flex relative bg-black/60 border border-orange-400
                               text-orange-200 px-4 py-2 rounded-md text-sm"
                    onClick={onViewCart}
                >
                    🛒 VIEW CART
                    {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white
                                         w-5 h-5 rounded-full text-xs flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </button>

                {/* Mobile */}
                <button
                    className="md:hidden relative bg-black/70 p-3 rounded-full"
                    onClick={onViewCart}
                >
                    🛒
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white
                                         w-5 h-5 rounded-full text-xs flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Title */}
            <div className="text-center mt-4">
                <h1 className="text-3xl md:text-5xl font-bold animate-text-shimmer whitespace-nowrap">SPRING FEST</h1>
                <h2 className="mt-4 text-xl md:text-3xl text-cyan-300 md:text-orange-300 whitespace-nowrap">
                    OFFICIAL MERCH
                </h2>
            </div>

            {/* Products */}
            <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                            gap-6 md:gap-8 justify-items-center w-full max-w-7xl mx-auto">
                {PRODUCTS.map((p) => (
                    <ProductCard key={p.id} product={p} onAdd={onAdd} onToast={onToast} />
                ))}
            </div>
        </>
    );
}

/* ---------------- PRODUCT CARD (NEW) ---------------- */

function ProductCard({ product, onAdd, onToast }) {
    const [size, setSize] = useState(null);

    const handleAdd = () => {
        if (!size) {
            onToast("Please select a size first!");
            return;
        }
        onAdd(product, size);
    };

    return (
        <div
            className="group w-full max-w-[320px] sm:max-w-[280px] p-5 md:p-6 pb-8 md:pb-10 flex flex-col
                       rounded-2xl text-center
                       bg-gradient-to-b from-blue-900/45 to-blue-950/55
                       md:from-purple-900/45 md:to-purple-950/55
                       border-2 border-cyan-400/55
                       md:border-orange-400/55
                       animate-card-float
                       hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]
                       md:hover:shadow-[0_0_30px_rgba(251,146,60,0.6)]
                       transition-shadow duration-300 relative z-10"
        >
            <div className="flex items-center justify-center mb-6 overflow-hidden h-[220px]">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-auto h-full max-h-[220px] max-w-none
                               scale-[1.3]
                               object-contain
                               brightness-110 contrast-130
                               transition-transform duration-500"
                />
            </div>

            <div className="text-lg font-bold mb-1 mt-auto">
                {product.name}
                <span className="md:hidden"> ({product.shortName})</span>
            </div>
            <div className="text-2xl text-cyan-300 md:text-orange-300 font-bold mb-4">₹ {product.price}</div>

            {/* Size Selector */}
            <div className="flex justify-center gap-2 mb-6">
                {SIZES.map((s) => (
                    <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`size-btn ${size === s ? "active" : ""}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <button
                className="w-full py-2.5 rounded-lg text-black
                           bg-gradient-to-r from-cyan-400 to-blue-400
                           md:from-orange-400 md:to-orange-300
                           hover:shadow-[0_0_22px_rgba(34,211,238,0.9)]
                           md:hover:shadow-[0_0_22px_rgba(255,160,0,0.9)]
                           font-bold tracking-wide"
                onClick={handleAdd}
            >
                ADD TO CART
            </button>
        </div>
    );
}



/* ---------------- CART PAGE ---------------- */

function CartPage({ cart, onBack, onQtyChange }) {
    const items = Object.entries(cart);

    const subtotal = items.reduce(
        (sum, [_, item]) => sum + item.product.price * item.qty,
        0
    );

    return (
        <div className="max-w-6xl mx-auto pt-12 overflow-x-hidden">
            <h1 className="text-center mb-10 text-3xl md:text-5xl font-bold animate-text-shimmer tracking-widest whitespace-nowrap">
                YOUR CART
            </h1>

            {/* Header */}
            <div className="grid grid-cols-4 md:grid-cols-5
                            px-1 md:px-3 mb-4 text-xs md:text-sm uppercase font-bold tracking-wider">
                <span className="md:text-center">Product</span>
                <span className="text-center">Size</span>
                <span className="text-center hidden md:block">Price</span>
                <span className="text-center">Qty</span>
                <span className="text-right pr-4 md:text-center md:pr-0">Total</span>
            </div>

            {/* Scrollable Items Container */}
            <div className="max-h-[260px] md:max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(([key, { product, size, qty }]) => {
                    const liveProduct = PRODUCTS.find(p => p.id === product.id) || product;
                    return (
                        <div
                            key={key}
                            className="grid grid-cols-4 md:grid-cols-5
                               items-center text-xs md:text-sm
                               px-1 py-4 md:px-3 md:py-3 mb-3
                               bg-blue-900/40 backdrop-blur-md
                               md:bg-purple-900/70 md:backdrop-blur-none
                               border border-cyan-500/30
                               md:border-orange-400/20
                               text-[#f5e9dc]
                               shadow-[0_4px_20px_rgba(0,0,0,0.3)]
                               md:shadow-none
                               rounded-xl"
                        >
                            <div className="text-center truncate">
                                <span className="text-sm md:hidden">{liveProduct.shortName}</span>
                                <span className="text-base hidden md:block">{liveProduct.name}</span>
                            </div>

                            <span className="text-center text-cyan-300 md:text-orange-300 font-bold">
                                {size}
                            </span>

                            <span className="text-center hidden md:block text-base font-bold text-blue-200">
                                ₹ {liveProduct.price}
                            </span>

                            <div className="flex justify-center items-center gap-1 md:gap-2">
                                <button
                                    onClick={() => onQtyChange(key, -1)}
                                    className="w-5 h-5 md:w-7 md:h-7 flex items-center justify-center rounded-md border border-cyan-400/50 md:border-orange-400/40"
                                >
                                    −
                                </button>
                                <span className="w-6 text-center">{qty}</span>
                                <button
                                    onClick={() => onQtyChange(key, +1)}
                                    className="w-5 h-5 md:w-7 md:h-7 flex items-center justify-center rounded-md border border-cyan-400/50 md:border-orange-400/40"
                                >
                                    +
                                </button>
                            </div>

                            <span className="text-right pr-4 md:text-center md:pr-0 font-extrabold text-cyan-400 md:text-orange-300">
                                ₹ {liveProduct.price * qty}
                            </span>
                        </div>
                    )
                })}
            </div>

            {items.length === 0 && (
                <div className="text-center py-10 text-white/50">
                    Your cart is empty.
                </div>
            )}

            {/* Bottom */}
            {items.length > 0 && (
                <div className="mt-8 flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-2">
                    <div className="px-3 py-2 md:px-6 md:py-3 rounded-xl
                                    bg-gradient-to-r from-lime-400 to-emerald-500
                                    md:from-emerald-500 md:to-teal-400
                                    text-emerald-950 font-semibold text-xs md:text-base whitespace-nowrap">
                        Subtotal ₹ {subtotal}
                    </div>

                    <div className="flex flex-col w-full gap-3 md:flex-row md:w-auto md:gap-4 md:justify-center">
                        <button
                            onClick={onBack}
                            className="w-full md:w-auto px-3 py-2 md:px-6 md:py-3 rounded-lg text-black
                                       bg-gradient-to-r from-cyan-400 to-blue-400
                                       md:from-orange-400 md:to-orange-300
                                       text-xs md:text-base font-bold whitespace-nowrap"
                        >
                            CONTINUE SHOPPING
                        </button>

                        <button
                            className="w-full md:w-auto px-3 py-2 md:px-6 md:py-3 rounded-lg text-black
                                       bg-gradient-to-r from-cyan-400 to-blue-400
                                       md:from-orange-400 md:to-orange-300
                                       text-xs md:text-base font-bold"
                        >
                            CHECKOUT
                        </button>
                    </div>
                </div>
            )}
            {items.length === 0 && (
                <button
                    onClick={onBack}
                    className="mt-4 px-6 py-2 rounded-lg border border-cyan-400 md:border-orange-400 text-cyan-300 md:text-orange-300 mx-auto block"
                >
                    Go Back
                </button>
            )}
        </div>
    );
}