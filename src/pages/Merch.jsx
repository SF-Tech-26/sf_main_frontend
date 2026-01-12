import { useState, useEffect } from "react";

// Import the background image
import bg from "../assets/merchbg.jpeg";

/* PRODUCTS */
const PRODUCTS = [
    { id: "nw-hoodie", name: "Nightwalker Hoodie", price: 1299 },
    { id: "nw-tee", name: "Nightwalker Tee", price: 1299 },
    { id: "kr-hoodie", name: "Karma Rolls Hoodie", price: 1299 },
    { id: "kr-tee", name: "Karma Rolls Tee", price: 1299 },
];

export default function Merch() {
    const [page, setPage] = useState("merch");
    const [cart, setCart] = useState({});
    const [toast, setToast] = useState(null);

    /* TOTAL ITEMS */
    const cartCount = Object.values(cart).reduce(
        (sum, i) => sum + i.qty,
        0
    );

    /* ADD TO CART (ALWAYS TRIGGERS TOAST) */
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

    /* AUTO HIDE TOAST */
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 1200);
        return () => clearTimeout(t);
    }, [toast]);

    /* UPDATE QUANTITY */
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
            className="w-full min-h-screen bg-fixed bg-cover bg-center bg-no-repeat px-4 py-10 md:px-16 md:py-10 text-[#f5e9dc] overflow-y-auto"
            style={{ backgroundImage: `url(${bg})` }}
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

            {/* TOAST */}
            {toast && (
                <div
                    key={toast.id}
                    className="fixed top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-teal-400 text-emerald-950 px-6 py-3 rounded-xl font-spaceGrotesk text-sm font-semibold z-[9999] shadow-[0_0_18px_rgba(0,230,118,0.9),0_0_32px_rgba(0,230,118,0.6)] animate-toast-pop"
                >
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
            {/* Top Bar - Cart Button */}
            <div className="flex justify-end md:justify-end fixed md:relative top-4 right-4 md:top-0 md:right-0 z-50">
                <button
                    className="relative bg-black/55 border border-orange-400 text-orange-200 px-4 py-2 rounded-md font-spaceGrotesk text-xs md:text-sm tracking-wider cursor-pointer transition-all duration-300 hover:shadow-[0_0_14px_rgba(255,160,90,0.7)] md:w-auto w-11 h-11 md:h-auto flex items-center justify-center"
                    onClick={onViewCart}
                >
                    <span className="hidden md:inline">🛒 VIEW CART</span>
                    <span className="md:hidden text-xl">🛒</span>
                    {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full text-xs font-semibold flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Title */}
            <div className="text-center mt-16 md:mt-0">
                <h1 className="font-cinzel text-4xl md:text-6xl font-bold tracking-wider animate-float-slow text-shadow-[0_0_12px_rgba(255,200,140,0.6),0_0_26px_rgba(255,140,80,0.35)]">
                    SPRING FEST
                </h1>
                <h2 className="mt-3 font-playfair text-2xl md:text-4xl tracking-wider text-orange-300 animate-float-medium">
                    OFFICIAL MERCH
                </h2>
            </div>

            {/* Products Grid */}
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
                {PRODUCTS.map((p) => (
                    <div
                        key={p.id}
                        className="w-full max-w-[280px] h-auto md:h-[345px] p-4 flex flex-col bg-gradient-to-b from-purple-900/45 to-purple-950/55 backdrop-blur-md border-2 border-orange-400/55 rounded-2xl text-center shadow-[inset_0_0_18px_rgba(255,180,120,0.08),0_0_18px_rgba(255,120,60,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[inset_0_0_22px_rgba(255,180,120,0.12),0_0_26px_rgba(255,140,80,0.45)]"
                    >
                        {/* Image placeholder */}
                        <div className="h-40 md:h-[165px] mb-3 rounded-xl border border-dashed border-orange-300/35 bg-black/20" />

                        {/* Price */}
                        <div className="mt-auto mb-2 font-spaceGrotesk text-lg md:text-xl font-semibold text-shadow-[0_0_6px_rgba(255,180,120,0.35)]">
                            ₹ {p.price}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            className="w-full py-2.5 bg-gradient-to-r from-orange-400 to-orange-300 border-none rounded-lg font-bebas text-sm md:text-base tracking-widest cursor-pointer transition-all duration-300 hover:shadow-[0_0_14px_rgba(255,160,90,0.8),0_0_26px_rgba(255,120,60,0.6)] text-black"
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
        <div className="max-w-5xl mx-auto pt-10">
            {/* Cart Title */}
            <h1 className="text-center my-8 font-cinzel text-4xl md:text-6xl tracking-wider animate-float-slow text-shadow-[0_0_12px_rgba(255,200,140,0.6),0_0_26px_rgba(255,140,80,0.35)]">
                YOUR CART
            </h1>

            {/* Cart Table */}
            <div className="flex flex-col mt-5">
                {/* Header - Hidden on mobile */}
                <div className="hidden md:grid grid-cols-[2.5fr_1fr_1fr_1fr] items-center py-4 border-b border-orange-400/30 font-spaceGrotesk text-base tracking-wide opacity-85">
                    <span>PRODUCT</span>
                    <span>PRICE</span>
                    <span>QUANTITY</span>
                    <span>TOTAL</span>
                </div>

                {/* Cart Items */}
                <div className="max-h-80 overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-orange-400/50">
                    {items.length === 0 && (
                        <div className="text-center py-10 text-orange-200/70 font-libreBaskerville text-lg">
                            Your cart is empty
                        </div>
                    )}

                    {items.map(({ product, qty }) => (
                        <div
                            key={product.id}
                            className="grid grid-cols-1 md:grid-cols-[2.5fr_1fr_1fr_1fr] items-center gap-3 py-4 border-b border-orange-400/30 md:bg-transparent bg-gradient-to-b from-purple-900/70 to-purple-950/75 md:rounded-none rounded-2xl md:border-0 md:border-b md:p-0 p-4 mb-4 md:mb-0"
                        >
                            {/* Product */}
                            <div className="flex items-center gap-4 font-libreBaskerville text-base md:text-lg">
                                <div className="w-12 h-16 rounded-md bg-black/30 border border-orange-400/40" />
                                <span>{product.name}</span>
                            </div>

                            {/* Price */}
                            <div className="flex justify-between md:block">
                                <span className="md:hidden text-orange-200/55 text-sm">Price</span>
                                <span>₹ {product.price}</span>
                            </div>

                            {/* Quantity */}
                            <div className="flex justify-between md:justify-start items-center">
                                <span className="md:hidden text-orange-200/55 text-sm">Qty</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        className="w-8 h-8 rounded-md bg-black/40 border border-orange-400 text-orange-200 text-lg cursor-pointer transition-all duration-200 hover:shadow-[0_0_10px_rgba(255,160,90,0.7)]"
                                        onClick={() => onQtyChange(product.id, -1)}
                                    >
                                        −
                                    </button>
                                    <span className="text-lg font-medium">{qty}</span>
                                    <button
                                        className="w-8 h-8 rounded-md bg-black/40 border border-orange-400 text-orange-200 text-lg cursor-pointer transition-all duration-200 hover:shadow-[0_0_10px_rgba(255,160,90,0.7)]"
                                        onClick={() => onQtyChange(product.id, +1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between md:block">
                                <span className="md:hidden text-orange-200/55 text-sm">Total</span>
                                <span>₹ {product.price * qty}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart Bottom */}
            <div className="mt-7 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Subtotal */}
                <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500/45 to-teal-400/20 border border-emerald-400/75 font-spaceGrotesk text-lg font-semibold text-emerald-100 shadow-[0_0_10px_rgba(211,230,0,0.55),0_0_18px_rgba(199,230,0,0.51)]">
                    Subtotal &nbsp; ₹ {subtotal}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        className="flex-1 md:flex-none px-5 py-3 bg-black/50 border border-orange-400 text-orange-200 rounded-lg font-spaceGrotesk text-sm tracking-wider transition-all duration-300 hover:shadow-[0_0_10px_rgba(255,160,90,0.5)]"
                        onClick={onBack}
                    >
                        CONTINUE SHOPPING
                    </button>
                    <button className="flex-1 md:flex-none px-7 py-3 bg-gradient-to-r from-orange-400 to-orange-300 border-none rounded-lg font-spaceGrotesk text-sm tracking-wider text-black transition-all duration-300 hover:shadow-[0_0_14px_rgba(255,160,90,0.8)]">
                        CHECKOUT
                    </button>
                </div>
            </div>
        </div>
    );
}