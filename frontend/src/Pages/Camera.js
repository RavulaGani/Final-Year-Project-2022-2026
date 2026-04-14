import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { useColorAnalysis } from "../hooks/useColorAnalysis";
import ResultsPanel from "../Components/ResultsPanel";

const Camera = () => {
  const [captured,   setCaptured]   = useState(null);
  const [gender,     setGender]     = useState("");
  const [camReady,   setCamReady]   = useState(false);
  const [camError,   setCamError]   = useState(false);
  const webcamRef = useRef(null);

  const {
    skin, eye, colorRecommendations, showColors, setShowColors,
    filteredClothes, filter, setFilter, clothes, loading,
    runAnalysis, addToFavourite, analysed, reset,
  } = useColorAnalysis();

  const handleCapture = async () => {
    if (!gender) return; // button is disabled anyway
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;
    setCaptured(imageSrc);
    const blob = await fetch(imageSrc).then((r) => r.blob());
    const file = new File([blob], "captured.png", { type: "image/png" });
    const fd   = new FormData();
    fd.append("file", file);
    await runAnalysis(fd, gender);
  };

  const handleRetake = () => {
    setCaptured(null);
    reset();
  };

  return (
    <div className="page-bg min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-down">
          <span className="badge badge-rose mb-3">Live Camera</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2">
            Real-time <span className="gradient-text-rose">Analysis</span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-3 max-w-md mx-auto">
            Use your webcam for instant skin tone detection — no file upload needed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left — Camera Panel */}
          <div className="space-y-5 animate-slide-in-left">
            {/* Gender FIRST */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                Select Gender First <span className="text-rose-DEFAULT">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["male","female"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-3 rounded-xl text-sm font-semibold capitalize transition-all border ${
                      gender === g
                        ? "bg-rose-DEFAULT/20 border-rose-DEFAULT text-white"
                        : "bg-white/5 border-white/10 text-[var(--text-secondary)] hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {g === "male" ? "👨 Male" : "👩 Female"}
                  </button>
                ))}
              </div>
            </div>

            {/* Camera / Preview */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ minHeight: 320 }}>
              {captured ? (
                <>
                  <img src={captured} alt="Captured" className="w-full h-80 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="badge badge-brand">Captured</span>
                  </div>
                </>
              ) : camError ? (
                <div className="flex flex-col items-center justify-center h-80 gap-3 p-6 text-center">
                  <span className="text-4xl">📷</span>
                  <p className="text-sm text-[var(--text-secondary)]">Camera not available.</p>
                  <p className="text-xs text-[var(--text-secondary)]">Please allow camera access in your browser settings.</p>
                </div>
              ) : (
                <div className="relative h-80">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/png"
                    className="w-full h-full object-cover"
                    onUserMedia={() => setCamReady(true)}
                    onUserMediaError={() => setCamError(true)}
                    mirrored
                  />
                  {/* Overlay face guide */}
                  {camReady && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-40 h-52 rounded-full border-2 border-dashed border-white/30" />
                    </div>
                  )}
                  {!camReady && !camError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              {!captured ? (
                <button
                  onClick={handleCapture}
                  disabled={!gender || !camReady || loading}
                  className="btn-rose flex-1 py-4 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analysing…
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="3" strokeWidth={2} />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M6.343 6.343A8 8 0 1017.657 17.657 8 8 0 006.343 6.343z" />
                      </svg>
                      {!gender ? "Select gender first" : "Capture & Analyse"}
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRetake}
                    className="btn-secondary flex-1 py-4"
                  >
                    ↺ Retake
                  </button>
                  {!analysed && (
                    <button
                      onClick={async () => {
                        const blob = await fetch(captured).then((r) => r.blob());
                        const file = new File([blob], "captured.png", { type: "image/png" });
                        const fd = new FormData(); fd.append("file", file);
                        await runAnalysis(fd, gender);
                      }}
                      disabled={loading}
                      className="btn-primary flex-1 py-4 flex items-center justify-center gap-2"
                    >
                      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Analyse →"}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Camera tips */}
            <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-sm text-brand-300">
              <p className="font-semibold mb-1">📸 Camera Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Ensure good lighting on your face</li>
                <li>Align your face with the oval guide</li>
                <li>Look straight at the camera</li>
              </ul>
            </div>
          </div>

          {/* Right — Results */}
          <div className="animate-slide-in-right">
            {!analysed && !loading ? (
              <div className="card p-10 text-center h-80 flex flex-col items-center justify-center">
                <div className="text-5xl mb-4">📷</div>
                <h3 className="font-display text-xl font-bold mb-2">Results appear here</h3>
                <p className="text-sm text-[var(--text-secondary)]">Capture a photo to begin your analysis</p>
              </div>
            ) : loading ? (
              <div className="card p-10 text-center h-80 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                <div>
                  <p className="font-semibold">Reading your colors…</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">This usually takes a few seconds</p>
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

export default Camera;
