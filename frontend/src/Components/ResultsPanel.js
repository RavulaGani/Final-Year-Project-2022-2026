import React from "react";
import ImageWithFallback from "./ImageWithFallback";

const FILTER_OPTIONS = ["all", "casual", "formal", "traditional", "party", "accessory"];

const ClothingCard = ({ item, onFav }) => (
  <div className="card overflow-hidden group">
    <div className="relative h-52 overflow-hidden">
      <ImageWithFallback
        src={item.image}
        alt={item.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        fallbackClassName="w-full h-full"
      />
      {item.category && (
        <span className="absolute top-2 left-2 badge badge-brand text-[10px]">
          {item.category}
        </span>
      )}
    </div>
    <div className="p-4">
      <h4 className="font-semibold text-sm mb-1 truncate">{item.name}</h4>
      {item.price && (
        <p className="text-[var(--text-secondary)] text-sm mb-3 font-mono">{item.price}</p>
      )}
      <button
        onClick={() => onFav(item)}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-rose-DEFAULT/30 text-rose-DEFAULT text-sm hover:bg-rose-DEFAULT/10 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        Save
      </button>
    </div>
  </div>
);

const ResultsPanel = ({
  skin, eye, colorRecommendations, showColors, setShowColors,
  filteredClothes, filter, setFilter, addToFavourite, clothes,
}) => {
  return (
    <div className="w-full animate-fade-in-up">
      {/* Analysis Summary */}
      <div className="glass-dark border border-white/10 rounded-2xl p-6 mb-6">
        <h3 className="font-display text-lg font-bold mb-4">Your Analysis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {skin && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
              <span className="text-2xl">🌿</span>
              <div>
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Skin Season</p>
                <p className="font-semibold capitalize">{skin}</p>
              </div>
            </div>
          )}
          {eye && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-DEFAULT/10 border border-rose-DEFAULT/20">
              <span className="text-2xl">👁</span>
              <div>
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Eye Colour</p>
                <p className="font-semibold capitalize">{eye}</p>
              </div>
            </div>
          )}
        </div>

        {colorRecommendations.length > 0 && (
          <>
            <button
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors mb-3"
              onClick={() => setShowColors((s) => !s)}
            >
              <svg
                className={`w-4 h-4 transition-transform ${showColors ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {showColors ? "Hide" : "Show"} color palette ({colorRecommendations.length} colors)
            </button>
            {showColors && (
              <div className="flex flex-wrap gap-2">
                {colorRecommendations.map((color, i) => (
                  <div
                    key={i}
                    className="group relative w-10 h-10 rounded-lg border-2 border-white/10 hover:scale-110 transition-transform cursor-default"
                    style={{ backgroundColor: color.startsWith("#") ? color : `#${color}` }}
                    title={color}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono">
                      {color}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Clothes Grid */}
      {clothes.length > 0 && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <h3 className="font-display text-xl font-bold">
              Recommended Outfits
              <span className="text-sm font-normal text-[var(--text-secondary)] ml-2">
                ({filteredClothes.length})
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                    filter === f
                      ? "bg-brand-500 text-white"
                      : "bg-white/5 text-[var(--text-secondary)] hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredClothes.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              <span className="text-4xl block mb-3">🔍</span>
              <p>No items in this category. Try "All".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredClothes.map((item, i) => (
                <ClothingCard key={i} item={item} onFav={addToFavourite} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
