import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ImageWithFallback from "../Components/ImageWithFallback";

const API_URL = "http://localhost:8080";

const Profile = () => {
  const { user: authUser, userId } = useAuth();
  const toast = useToast();
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const { data } = await axios.post(`${API_URL}/user/singleUser`, { id: userId });
      if (data?.success) setUser(data.user);
    } catch (err) {
      toast.error("Failed to load profile data.");
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
        toast.error(data?.message || "Could not remove item.");
      }
    } catch {
      toast.error("Error removing item. Try again.");
    }
  };

  if (loading) return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );

  const displayName = user?.name || authUser?.name || "User";
  const displayEmail = user?.email || authUser?.email || "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="page-bg min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="relative mb-8 animate-fade-in-down">
          <div
            className="h-40 rounded-3xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(192,68,238,0.4) 0%, rgba(255,77,109,0.3) 100%)" }}
          >
            <div className="absolute inset-0 noise-overlay" />
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-12">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-rose-DEFAULT border-4 border-[var(--surface)] flex items-center justify-center text-white text-3xl font-display font-bold flex-shrink-0">
                {initial}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4 pb-1">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold">{displayName}</h1>
                  <p className="text-[var(--text-secondary)] text-sm">{displayEmail}</p>
                </div>
                <div className="flex gap-2">
                  <span className="badge badge-brand">Member</span>
                  <span className="badge badge-rose">{user?.favourite?.length || 0} saved</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Favourites Section */}
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold">
              Saved Outfits
              <span className="text-sm font-normal text-[var(--text-secondary)] ml-2">
                ({user?.favourite?.length || 0})
              </span>
            </h2>
          </div>

          {!user?.favourite?.length ? (
            <div className="card p-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/10 to-rose-DEFAULT/10 border border-white/5 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold mb-2">No saved outfits yet</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Run an analysis and tap the heart icon to save your favourite looks.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {user.favourite.map((item, i) => (
                <div key={item._id || i} className="card overflow-hidden group">
                  <div className="relative h-52 overflow-hidden">
                    <ImageWithFallback
                      src={item.itemImage}
                      alt={item.itemName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackClassName="w-full h-full"
                    />
                    <button
                      onClick={() => removeFavourite(item._id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-rose-DEFAULT/80 transition-all opacity-0 group-hover:opacity-100"
                      title="Remove from favourites"
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
    </div>
  );
};

export default Profile;
