import { useState, useEffect } from "react";

// Background
import bg from "../assets/merchbg.jpeg";

// Hoodie Images
import Yellowhoodie from "../assets/Yellowhoodie.png";
import Bluehoodie from "../assets/Bluehoodie.png";
import Orangehoodie from "../assets/Orangehoodie.png";

/* PRODUCTS */
const PRODUCTS = [
    {
        id: "kr-hoodie",
        name: "Karma Rolls Hoodie",
        price: 1299,
        image: Yellowhoodie,
    },
    {
        id: "nw-hoodie",
        name: "Nightwalker Hoodie",
        price: 1299,
        image: Bluehoodie,
    },
    {
        id: "mg-hoodie",
        name: "Magician Hoodie",
        price: 1299,
        image: Orangehoodie,
    },
];

export default function Merch() {
    const [page, setPage] = useState("merch");
    const [cart, setCart] = useState({});
    const [toast, setToast] = useState(null);

    const cartCount = Object.values(cart).reduce(
        (sum, i) => sum + i.qty,
        0
    );

    const addToCart = (product) => {
        setCart((prev) => ({
            ...prev,
            [product.id]: {
                product,
                qty: (prev[product.id]?.qty || 0) + 1,
            },
        }));

        setToast({
            id: Date.now(),
            message: `${product.name} added to cart`,
        });
    };

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 1200);
        return () => clearTimeout(t);
    }, [toast]);

    const updateQty = (id, delta) => {
        setCart((prev) => {
            const item = prev[id];
            if (!item) return prev;

            const newQty = item.qty + delta;
            if (newQty <= 0) {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            }

            return {
                ...prev,
                [id]: { ...item, qty: newQty },
            };
        });
    };

    return (
        <div
            className="w-full min-h-screen bg-fixed bg-cover bg-center bg-no-repeat
                       px-4 py-10 md:px-16
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
                                bg-gradient-to-r from-purple-500 to-fuchsia-500
                                text-white
                                shadow-[0_0_30px_rgba(168,85,247,0.9)]
                                z-[9999]">
                    {toast.message}
                </div>
            )}
        </div>
    );
}

/* ---------------- MERCH PAGE ---------------- */

function MerchPage({ onViewCart, onAdd, cartCount }) {
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
            <div className="text-center mt-20">
                <h1 className="text-5xl font-bold">SPRING FEST</h1>
                <h2 className="mt-3 text-3xl text-orange-300">
                    OFFICIAL MERCH
                </h2>
            </div>

            {/* Products */}
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                            gap-8 justify-items-center">
                {PRODUCTS.map((p) => (
                    <div
                        key={p.id}
                        className="w-full max-w-[280px] md:h-[345px] p-4 flex flex-col
                                   rounded-2xl text-center
                                   bg-gradient-to-b from-purple-900/45 to-purple-950/55
                                   border-2 border-orange-400/55
                                   animate-card-float"
                    >
                        <div className="flex items-center justify-center mb-3 overflow-hidden">
                            <img
                                src={p.image}
                                alt={p.name}
                                className="w-[260px] md:w-[450px]
                                           h-auto max-w-none
                                           -translate-x-8 md:-translate-x-22
                                           brightness-110 contrast-130"
                            />
                        </div>

                        <div className="mt-auto mb-2 text-lg">
                            ₹ {p.price}
                        </div>

                        <button
                            className="w-full py-2.5 rounded-lg text-black
                                       bg-gradient-to-r from-orange-400 to-orange-300
                                       hover:shadow-[0_0_22px_rgba(255,160,0,0.9)]"
                            onClick={() => onAdd(p)}
                        >
                            ADD TO CART
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}

/* ---------------- CART PAGE ---------------- */

function CartPage({ cart, onBack, onQtyChange }) {
    const items = Object.values(cart);

    const subtotal = items.reduce(
        (sum, i) => sum + i.product.price * i.qty,
        0
    );

    return (
        <div className="max-w-6xl mx-auto pt-12 overflow-x-hidden">
            <h1 className="text-center mb-10 text-5xl tracking-widest">
                YOUR CART
            </h1>

            {/* Header */}
            <div className="grid grid-cols-[1.5fr_0.9fr_1fr_1fr]
                            px-3 mb-4 text-sm uppercase">
                <span>Product</span>
                <span className="text-center">Price</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Total</span>
            </div>

            {items.map(({ product, qty }) => (
                <div
                    key={product.id}
                    className="grid grid-cols-[1.5fr_0.9fr_1fr_1fr]
                               items-center
                               px-3 py-3 mb-3
                               bg-gradient-to-r from-purple-900/70 to-purple-950/80
                               rounded-xl"
                >
                    <span className="truncate">{product.name}</span>

                    <span className="text-center">
                        ₹ {product.price}
                    </span>

                    <div className="flex justify-center items-center gap-2">
                        <button
                            onClick={() => onQtyChange(product.id, -1)}
                            className="w-7 h-7 rounded-md border border-orange-400/40"
                        >
                            −
                        </button>
                        <span>{qty}</span>
                        <button
                            onClick={() => onQtyChange(product.id, +1)}
                            className="w-7 h-7 rounded-md border border-orange-400/40"
                        >
                            +
                        </button>
                    </div>

                    <span className="text-right">
                        ₹ {product.price * qty}
                    </span>
                </div>
            ))}

            {/* Bottom */}
            <div className="mt-8 flex flex-col gap-6">
                <div className="px-6 py-3 rounded-xl
                                bg-gradient-to-r from-emerald-500 to-teal-400
                                text-emerald-950 font-semibold w-fit">
                    Subtotal ₹ {subtotal}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onBack}
                        className="flex-1 px-6 py-3 rounded-lg text-black
                                   bg-gradient-to-r from-orange-400 to-orange-300"
                    >
                        CONTINUE SHOPPING
                    </button>

                    <button
                        className="flex-1 px-6 py-3 rounded-lg text-black
                                   bg-gradient-to-r from-orange-400 to-orange-300"
                    >
                        CHECKOUT
                    </button>
                </div>
            </div>
        </div>
    );
}
