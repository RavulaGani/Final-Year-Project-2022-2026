import React, { useState, useRef } from "react";
import { useColorAnalysis } from "../hooks/useColorAnalysis";
import ResultsPanel from "../Components/ResultsPanel";

const Upload = () => {
  const [preview,  setPreview]  = useState(null);
  const [file,     setFile]     = useState(null);
  const [gender,   setGender]   = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const {
    skin, eye, colorRecommendations, showColors, setShowColors,
    filteredClothes, filter, setFilter, clothes, loading,
    runAnalysis, addToFavourite, analysed, reset,
  } = useColorAnalysis();

  const processFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
    reset();
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    await runAnalysis(fd, gender);
  };

  const handleReset = () => {
    setPreview(null); setFile(null); setGender(""); reset();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="page-bg min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-down">
          <span className="badge badge-brand mb-3">AI Skin Analysis</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2">
            Upload Your <span className="gradient-text">Photo</span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-3 max-w-md mx-auto">
            Upload a clear photo of your face. Our AI will detect your skin tone and recommend a personalised color palette.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left — Upload Panel */}
          <div className="space-y-5 animate-slide-in-left">
            {/* Drop Zone */}
            <div
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
                ${dragOver
                  ? "border-brand-500 bg-brand-500/10"
                  : preview
                    ? "border-white/10"
                    : "border-white/20 hover:border-brand-500/50 hover:bg-white/[0.02]"
                }`}
              style={{ minHeight: 320 }}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => !preview && inputRef.current?.click()}
            >
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-80 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleReset(); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                    title="Remove image"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <span className="badge badge-brand">Image ready</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-80 gap-3 p-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">Drop image here or click to browse</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">PNG, JPG, JPEG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={(e) => processFile(e.target.files[0])}
            />

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                Gender <span className="text-rose-DEFAULT">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["male","female"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-3 rounded-xl text-sm font-semibold capitalize transition-all border ${
                      gender === g
                        ? "bg-brand-500/20 border-brand-500 text-white"
                        : "bg-white/5 border-white/10 text-[var(--text-secondary)] hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {g === "male" ? "👨 Male" : "👩 Female"}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload button */}
            <button
              onClick={handleSubmit}
              disabled={!file || !gender || loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analysing your photo…
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  {analysed ? "Re-Analyse" : "Analyse My Colors"}
                </>
              )}
            </button>

            {/* Tips */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-300">
              <p className="font-semibold mb-1">💡 Tips for best results:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Use a photo with natural lighting</li>
                <li>Face should be clearly visible</li>
                <li>Avoid heavy filters or editing</li>
              </ul>
            </div>
          </div>

          {/* Right — Results */}
          <div className="animate-slide-in-right">
            {!analysed && !loading ? (
              <div className="card p-10 text-center h-80 flex flex-col items-center justify-center">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="font-display text-xl font-bold mb-2">Your results will appear here</h3>
                <p className="text-sm text-[var(--text-secondary)]">Upload a photo and select your gender to get started</p>
              </div>
            ) : loading ? (
              <div className="card p-10 text-center h-80 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                <div>
                  <p className="font-semibold">Analysing your photo…</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Detecting skin tone and eye color</p>
                </div>
              </div>
            ) : (
              <ResultsPanel
                skin={skin} eye={eye}
                colorRecommendations={colorRecommendations}
                showColors={showColors} setShowColors={setShowColors}
                filteredClothes={filteredClothes} filter={filter} setFilter={setFilter}
                addToFavourite={addToFavourite} clothes={clothes}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
