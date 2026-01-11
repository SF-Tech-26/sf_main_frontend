import { useState, useEffect } from "react";
import "./App.css";
import bg from "./assets/merchbg.jpeg";

/* Fonts */
import "@fontsource/cinzel-decorative";
import "@fontsource/space-grotesk";
import "@fontsource/libre-baskerville";

/* PRODUCTS */
const PRODUCTS = [
  { id: "nw-hoodie", name: "Nightwalker Hoodie", price: 1299 },
  { id: "nw-tee", name: "Nightwalker Tee", price: 1299 },
  { id: "kr-hoodie", name: "Karma Rolls Hoodie", price: 1299 },
  { id: "kr-tee", name: "Karma Rolls Tee", price: 1299 },
];

export default function App() {
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
      id: Date.now(), // 👈 forces re-render every time
      message: `${product.name} added to cart`,
    });
  };

  /* AUTO HIDE TOAST (SHORT) */
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
    <div className="page" style={{ backgroundImage: `url(${bg})` }}>
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
        <div key={toast.id} className="toast">
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
      <div className="top-bar">
        <button className="cart-btn" onClick={onViewCart}>
          🛒 VIEW CART
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>

      <div className="title">
        <h1>SPRING FEST</h1>
        <h2>OFFICIAL MERCH</h2>
      </div>

      <div className="products">
        {PRODUCTS.map((p) => (
          <div className="card" key={p.id}>
            <div className="image-box" />
            <div className="price">₹ {p.price}</div>
            <button className="add-btn" onClick={() => onAdd(p)}>
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
    <div className="cart">
      <div className="cart-scale">
        <h1 className="cart-title">YOUR CART</h1>

        <div className="cart-table">
          <div className="cart-head">
            <span>PRODUCT</span>
            <span>PRICE</span>
            <span>QUANTITY</span>
            <span>TOTAL</span>
          </div>

          <div className="cart-items">
            {items.length === 0 && (
              <div className="empty-cart">Your cart is empty</div>
            )}

            {items.map(({ product, qty }) => (
              <div className="cart-row" key={product.id}>
                <div className="cart-product">
                  <div className="thumb" />
                  <span>{product.name}</span>
                </div>

                <span>₹ {product.price}</span>

                <div className="qty">
                  <button onClick={() => onQtyChange(product.id, -1)}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => onQtyChange(product.id, +1)}>+</button>
                </div>

                <span>₹ {product.price * qty}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-bottom">
          <div className="subtotal">Subtotal &nbsp; ₹ {subtotal}</div>

          <div className="cart-actions">
            <button className="secondary-btn" onClick={onBack}>
              CONTINUE SHOPPING
            </button>
            <button className="primary-btn">CHECKOUT</button>
          </div>
        </div>
      </div>
    </div>
  );
}
