import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const SKIN_SEASONS = ["spring", "summer", "autumn", "winter"];
const GENDERS = ["male", "female"];

const Form = () => {
  const navigate = useNavigate();
  const toast    = useToast();
  const [formData, setFormData] = useState({ skinSeason: "", gender: "" });

  const handle = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.skinSeason || !formData.gender) {
      toast.warning("Please fill in all fields.");
      return;
    }
    toast.success(`Showing ${formData.skinSeason} palette for ${formData.gender}.`);
    navigate("/upload");
  };

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md glass-dark border border-white/10 rounded-3xl p-8 animate-scale-in">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">🎨</span>
          <h2 className="font-display text-3xl font-bold">Manual Color Form</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Already know your season? Enter it here.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
              Skin Season
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SKIN_SEASONS.map((s) => (
                <button
                  key={s} type="button"
                  onClick={() => setFormData((p) => ({ ...p, skinSeason: s }))}
                  className={`py-2.5 px-4 rounded-xl text-sm font-semibold capitalize transition-all border ${
                    formData.skinSeason === s
                      ? "bg-brand-500/20 border-brand-500 text-white"
                      : "bg-white/5 border-white/10 text-[var(--text-secondary)] hover:border-white/30"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g} type="button"
                  onClick={() => setFormData((p) => ({ ...p, gender: g }))}
                  className={`py-2.5 px-4 rounded-xl text-sm font-semibold capitalize transition-all border ${
                    formData.gender === g
                      ? "bg-brand-500/20 border-brand-500 text-white"
                      : "bg-white/5 border-white/10 text-[var(--text-secondary)] hover:border-white/30"
                  }`}
                >
                  {g === "male" ? "👨 Male" : "👩 Female"}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4">
            Continue to Analysis →
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
