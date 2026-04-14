import React, { useState } from "react";

const ImageWithFallback = ({ src, alt, className, fallbackClassName }) => {
  const [errored, setErrored] = useState(false);

  if (errored || !src || src.includes("example.com") || src.includes("google.com/url")) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-brand-900/50 to-surface-3 ${fallbackClassName || className}`}>
        <div className="text-center p-4">
          <svg className="w-10 h-10 text-brand-500/50 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-[var(--text-secondary)]">{alt || "Image"}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  );
};

export default ImageWithFallback;
