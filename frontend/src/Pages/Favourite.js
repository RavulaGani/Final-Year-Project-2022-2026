import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth }  from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ImageWithFallback from "../Components/ImageWithFallback";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8080";

const Favourite = () => {
  const { userId } = useAuth();
  const toast = useToast();
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const { data } = await axios.post(`${API_URL}/user/singleUser`, { id: userId });
      if (data?.success) setUser(data.user);
    } catch {
      toast.error("Failed to load favourites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, [userId]);

  const removeFavourite = async (itemId) => {
    try {
      const { data } = await axios.post(`${API_URL}/user/removeFavourite`, { userId, itemId });
      if (data?.success) {
        toast.success("Removed from favourites.");
        setUser((prev) => ({
          ...prev,
          favourite: prev.favourite?.filter((i) => i._id !== itemId),
        }));
      } else {
        toast.error(data?.message || "Could not remove.");
      }
    } catch {
      toast.error("Error removing item.");
    }
  };

  if (loading) return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );

  const items = user?.favourite || [];

  return (
    <div className="page-bg min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-down">
          <span className="badge badge-rose mb-3">My Collection</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2">
            Your <span className="gradient-text-rose">Favourites</span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-3">
            {items.length} saved {items.length === 1 ? "outfit" : "outfits"}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="card p-16 text-center animate-scale-in">
            <span className="text-5xl block mb-4">❤️</span>
            <h3 className="font-display text-xl font-bold mb-2">Nothing saved yet</h3>
            <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-xs mx-auto">
              Run a color analysis, then tap the heart icon on any outfit to save it here.
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/upload" className="btn-primary px-6 py-3">Upload Photo</Link>
              <Link to="/camera" className="btn-secondary px-6 py-3">Use Camera</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in-up">
            {items.map((item, i) => (
              <div key={item._id || i} className="card overflow-hidden group">
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={item.itemImage}
                    alt={item.itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackClassName="w-full h-full"
                  />
                  <button
                    onClick={() => removeFavourite(item._id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-rose-DEFAULT/80 transition-all opacity-0 group-hover:opacity-100"
                    title="Remove"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-sm mb-1 truncate">{item.itemName}</h4>
                  {item.itemPrice > 0 && (
                    <p className="text-[var(--text-secondary)] text-sm font-mono">${item.itemPrice}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourite;
