import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth }  from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ImageWithFallback from "../Components/ImageWithFallback";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8080";

const Cart = () => {
  const { userId } = useAuth();
  const toast = useToast();
  const [cart,    setCart]    = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const { data } = await axios.post(`${API_URL}/user/singleUser`, { id: userId });
      if (data?.success) setCart(data?.user?.cart || []);
    } catch {
      toast.error("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, [userId]);

  const removeFromCart = async (itemId) => {
    try {
      await axios.post(`${API_URL}/user/delete`, { userID: userId, itemID: itemId });
      toast.success("Item removed from cart.");
      setCart((prev) => prev.filter((i) => i._id !== itemId));
    } catch {
      toast.error("Error removing item.");
    }
  };

  const total = cart.reduce((sum, item) => {
    const price = parseFloat(String(item.itemPrice).replace(/[^0-9.]/g, "")) || 0;
    return sum + price;
  }, 0);

  if (loading) return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="page-bg min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-down">
          <span className="badge badge-gold mb-3">Shopping Cart</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2">
            Your <span className="gradient-text">Cart</span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-3">{cart.length} {cart.length === 1 ? "item" : "items"}</p>
        </div>

        {cart.length === 0 ? (
          <div className="card p-16 text-center animate-scale-in">
            <span className="text-5xl block mb-4">🛒</span>
            <h3 className="font-display text-xl font-bold mb-2">Your cart is empty</h3>
            <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-xs mx-auto">
              Discover outfits that match your color palette and add them here.
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/upload" className="btn-primary px-6 py-3">Analyse Photo</Link>
              <Link to="/camera" className="btn-secondary px-6 py-3">Use Camera</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="card p-4 flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.itemImage}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                      fallbackClassName="w-full h-full"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-semibold truncate">{item.itemName}</h4>
                    <p className="text-[var(--text-secondary)] text-sm font-mono">{item.itemPrice}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="flex-shrink-0 w-8 h-8 rounded-lg bg-rose-DEFAULT/10 border border-rose-DEFAULT/20 flex items-center justify-center hover:bg-rose-DEFAULT/20 transition-colors text-rose-DEFAULT"
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="card p-6 h-fit">
              <h3 className="font-display text-xl font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Items ({cart.length})</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Shipping</span>
                  <span className="text-emerald-400">Free</span>
                </div>
              </div>
              <div className="divider" />
              <div className="flex justify-between font-bold text-lg mb-5">
                <span>Total</span>
                <span className="gradient-text">${total.toFixed(2)}</span>
              </div>
              <button className="btn-primary w-full py-3">
                Checkout →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
