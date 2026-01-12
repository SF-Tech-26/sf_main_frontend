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

    return (
        <div
            className="w-full min-h-screen bg-fixed bg-cover bg-center bg-no-repeat px-4 py-10 md:px-16 text-[#f5e9dc]"
            style={{
                backgroundImage: `url(${bg})`,
                fontFamily: '"Cinzel Decorative", serif',
            }}
        >
            <MerchPage
                onViewCart={() => setPage("cart")}
                onAdd={addToCart}
                cartCount={cartCount}
            />
        </div>
    );
}

/* ---------------- MERCH PAGE ---------------- */

function MerchPage({ onViewCart, onAdd, cartCount }) {
    return (
        <>
            {/* Cart Button */}
            <div className="fixed top-4 right-4 z-50">
                <button
                    className="relative bg-black/55 border border-orange-400 text-orange-200 px-4 py-2 rounded-md font-cinzel text-sm"
                    onClick={onViewCart}
                >
                    🛒 VIEW CART
                    {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Title */}
            <div className="text-center mt-20">
                <h1 className="font-cinzel text-5xl font-bold">SPRING FEST</h1>
                <h2 className="mt-3 font-cinzel text-3xl text-orange-300">
                    OFFICIAL MERCH
                </h2>
            </div>

            {/* Products */}
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {PRODUCTS.map((p) => (
                    <div
                        key={p.id}
                        className="w-full max-w-[280px] md:h-[345px] p-4 flex flex-col bg-gradient-to-b from-purple-900/45 to-purple-950/55 backdrop-blur-md border-2 border-orange-400/55 rounded-2xl text-center"
                    >
                        {/* 🔥 IMAGE — WIDTH CONTROLS EVERYTHING */}
                        <div className="flex items-center justify-center overflow-hidden mb-3 animate-merch-float">
                            <img
                                src={p.image}
                                alt={p.name}
                                className="
                                    w-[450px] md:w-[450px]
                                    h-[300px]
                                    max-w-none
                                    -translate-x-22
                                    brightness-120
                                    contrast-135
                                    
                                "
                            />
                        </div>

                        {/* Price */}
                        <div className="mt-auto mb-2 font-cinzel text-lg">
                            ₹ {p.price}
                        </div>

                        {/* Button */}
                        <button
                            className="w-full py-2.5 bg-gradient-to-r from-orange-400 to-orange-300 rounded-lg font-cinzel tracking-widest text-black"
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
