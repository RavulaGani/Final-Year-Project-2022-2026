import React, { useState, useRef, useEffect, useCallback } from "react";

// ── Config ────────────────────────────────────────────────────────────────────
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

// ── Quick suggestion chips ────────────────────────────────────────────────────
const QUICK_CHIPS = [
  { label: "🎨 Find my season",       msg: "How do I find out my color season?" },
  { label: "📱 How to use the app",   msg: "Can you walk me through how to use Color Insight?" },
  { label: "🌸 Spring palette",       msg: "What colors should I wear for a Spring skin tone?" },
  { label: "📷 Camera not working",   msg: "My camera isn't working on the Camera page, what do I do?" },
  { label: "🍂 Autumn outfits",       msg: "Give me outfit color combinations for an Autumn skin tone." },
  { label: "💡 Warm vs cool tones",   msg: "What's the difference between warm and cool undertones?" },
];

// ── Typing animation ──────────────────────────────────────────────────────────
const TypingDots = () => (
  <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 0" }}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 7, height: 7,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f472b6, #a855f7)",
          display: "inline-block",
          animation: `irisTyping 1.2s ease-in-out ${i * 0.2}s infinite`,
        }}
      />
    ))}
  </div>
);

// ── Message bubble ────────────────────────────────────────────────────────────
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 8,
      marginBottom: 12,
      animation: "irisSlideIn 0.25s ease-out",
    }}>
      {!isUser && (
        <div style={{
          width: 30, height: 30,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #6366f1 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 12px rgba(168,85,247,0.4)",
          fontSize: 13,
        }}>
          ✦
        </div>
      )}
      <div style={{
        maxWidth: "78%",
        padding: isUser ? "10px 14px" : "11px 14px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        background: isUser
          ? "linear-gradient(135deg, #ec4899, #a855f7)"
          : "rgba(255,255,255,0.06)",
        color: isUser ? "#fff" : "#f0e8ff",
        fontSize: "0.855rem",
        lineHeight: 1.65,
        boxShadow: isUser
          ? "0 4px 16px rgba(236,72,153,0.25)"
          : "inset 0 0 0 1px rgba(255,255,255,0.08)",
        backdropFilter: isUser ? "none" : "blur(8px)",
        letterSpacing: "0.01em",
      }}>
        {msg.typing
          ? <TypingDots />
          : <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{msg.content}</p>
        }
        {!msg.typing && (
          <div style={{
            fontSize: "0.7rem",
            marginTop: 5,
            opacity: 0.45,
            textAlign: isUser ? "left" : "right",
            color: isUser ? "rgba(255,255,255,0.8)" : "#c4b5fd",
          }}>
            {new Date(msg.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ColorInsightChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: "assistant",
      content: "Hi, I'm Iris ✦\n\nYour personal Color Insight style guide. Ask me about your color season, outfit pairings, or anything fashion — I'm here to help you glow! 🌸",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
      setHasNew(false);
    }
  }, [open]);

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");

    const userMsg = { id: Date.now(), role: "user", content: userText, ts: Date.now() };
    const typingId = Date.now() + 1;
    const typingMsg = { id: typingId, role: "assistant", content: "", typing: true, ts: Date.now() };

    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setLoading(true);

    const history = [...messages, userMsg]
      .filter((m) => !m.typing)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      abortRef.current = new AbortController();
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        signal: abortRef.current.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't get a response. Please try again.";

      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? { ...m, content: reply, typing: false, ts: Date.now() }
            : m
        )
      );
      if (!open) setHasNew(true);
    } catch (err) {
      if (err.name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? { ...m, content: "Something went wrong connecting to Iris. Please check your connection and try again. 💫", typing: false, ts: Date.now() }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, open]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      role: "assistant",
      content: "Hi, I'm Iris ✦\n\nYour personal Color Insight style guide. Ask me about your color season, outfit pairings, or anything fashion — I'm here to help you glow! 🌸",
      ts: Date.now(),
    }]);
  };

  const showChips = messages.filter((m) => !m.typing).length <= 2;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes irisTyping {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes irisSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes irisFabPulse {
          0%,100% { box-shadow: 0 8px 30px rgba(236,72,153,0.45), 0 0 0 0 rgba(236,72,153,0.3); }
          50%     { box-shadow: 0 8px 30px rgba(236,72,153,0.45), 0 0 0 10px rgba(236,72,153,0); }
        }
        @keyframes irisShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes irisBadgePop {
          0%,100% { transform: scale(1); }
          50%     { transform: scale(1.25); }
        }
        @keyframes irisSpinLoader {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .iris-root * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }

        /* ── FAB ── */
        .iris-fab {
          position: fixed; bottom: 28px; right: 28px; z-index: 9998;
          width: 62px; height: 62px; border-radius: 50%; border: none; cursor: pointer;
          background: linear-gradient(135deg, #ec4899 0%, #a855f7 55%, #6366f1 100%);
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1);
          animation: irisFabPulse 3s ease-in-out infinite;
          outline: none;
        }
        .iris-fab:hover  { transform: scale(1.1) rotate(5deg); animation: none; box-shadow: 0 12px 40px rgba(236,72,153,0.55); }
        .iris-fab:active { transform: scale(0.94); }

        .iris-fab-badge {
          position: absolute; top: 3px; right: 3px;
          width: 15px; height: 15px; border-radius: 50%;
          background: #f43f5e; border: 2px solid #0d0816;
          animation: irisBadgePop 1.4s ease-in-out infinite;
        }

        /* ── Panel ── */
        .iris-panel {
          position: fixed; bottom: 104px; right: 28px; z-index: 9997;
          width: 385px; max-width: calc(100vw - 28px);
          height: 580px; max-height: calc(100vh - 140px);
          border-radius: 28px;
          display: flex; flex-direction: column; overflow: hidden;
          background: #0d0816;
          border: 1px solid rgba(236,72,153,0.2);
          box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03) inset;
          transform-origin: bottom right;
          transition: opacity 0.3s cubic-bezier(.22,1,.36,1), transform 0.3s cubic-bezier(.22,1,.36,1);
        }
        .iris-panel--open   { opacity: 1; transform: scale(1) translateY(0); pointer-events: all; }
        .iris-panel--closed { opacity: 0; transform: scale(0.88) translateY(16px); pointer-events: none; }

        /* ── Header ── */
        .iris-header {
          padding: 16px 18px;
          background: linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(99,102,241,0.08) 100%);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: space-between;
          position: relative; overflow: hidden;
        }
        .iris-header::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(236,72,153,0.04), transparent);
          background-size: 200% 100%;
          animation: irisShimmer 4s linear infinite;
        }
        .iris-header-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem; font-weight: 600;
          background: linear-gradient(135deg, #f9a8d4, #e879f9, #a5b4fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          letter-spacing: 0.04em;
        }
        .iris-header-sub {
          font-size: 0.7rem; color: #9b84b8; letter-spacing: 0.05em;
          margin-top: 1px; font-weight: 300;
        }
        .iris-online {
          width: 7px; height: 7px; border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 6px #34d399;
          display: inline-block; margin-left: 6px; vertical-align: middle;
        }
        .iris-icon-btn {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.06);
          color: #9b84b8; border-radius: 8px;
          width: 30px; height: 30px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; font-size: 0.75rem;
          margin-left: 6px;
        }
        .iris-icon-btn:hover { background: rgba(236,72,153,0.15); color: #f9a8d4; border-color: rgba(236,72,153,0.3); }

        /* ── Messages ── */
        .iris-messages {
          flex: 1; overflow-y: auto; padding: 18px 16px 8px;
          scroll-behavior: smooth;
        }
        .iris-messages::-webkit-scrollbar { width: 4px; }
        .iris-messages::-webkit-scrollbar-track { background: transparent; }
        .iris-messages::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.25); border-radius: 4px; }

        /* ── Chips ── */
        .iris-chips {
          padding: 4px 14px 12px;
          display: flex; flex-wrap: wrap; gap: 7px;
          flex-shrink: 0;
        }
        .iris-chip {
          background: rgba(236,72,153,0.08);
          border: 1px solid rgba(236,72,153,0.2);
          color: #f9a8d4; border-radius: 20px;
          padding: 5px 12px; font-size: 0.765rem;
          cursor: pointer; transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .iris-chip:hover { background: rgba(236,72,153,0.18); border-color: rgba(236,72,153,0.5); transform: translateY(-1px); }
        .iris-chip:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        /* ── Divider ── */
        .iris-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(236,72,153,0.15), transparent);
          flex-shrink: 0;
          margin: 0 16px;
        }

        /* ── Input ── */
        .iris-input-row {
          display: flex; align-items: flex-end; gap: 9px;
          padding: 12px 14px 16px;
          background: rgba(0,0,0,0.2);
          flex-shrink: 0;
        }
        .iris-textarea {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(236,72,153,0.18);
          border-radius: 16px; padding: 10px 14px;
          color: #f0e8ff; font-size: 0.855rem;
          font-family: 'DM Sans', sans-serif;
          outline: none; resize: none;
          max-height: 96px; line-height: 1.55;
          transition: border-color 0.2s, background 0.2s;
        }
        .iris-textarea::placeholder { color: #5d4a7a; }
        .iris-textarea:focus {
          border-color: rgba(236,72,153,0.45);
          background: rgba(236,72,153,0.04);
        }
        .iris-send {
          width: 42px; height: 42px; border-radius: 14px; border: none;
          cursor: pointer; flex-shrink: 0;
          background: linear-gradient(135deg, #ec4899, #a855f7);
          color: white; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(236,72,153,0.35);
        }
        .iris-send:hover:not(:disabled) { transform: scale(1.06); box-shadow: 0 6px 22px rgba(236,72,153,0.5); }
        .iris-send:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .iris-fab  { bottom: 20px; right: 16px; }
          .iris-panel {
            right: 0; left: 0; bottom: 0; width: 100vw; max-width: 100vw;
            height: 88vh; max-height: 88vh;
            border-radius: 28px 28px 0 0;
          }
        }
      `}</style>

      <div className="iris-root">
        {/* ── FAB ── */}
        <button
          className="iris-fab"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close Iris chat" : "Open Iris style assistant"}
        >
          {hasNew && !open && <div className="iris-fab-badge" />}
          {open ? (
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <span style={{ fontSize: 22, lineHeight: 1 }}>✦</span>
          )}
        </button>

        {/* ── Panel ── */}
        <div className={`iris-panel ${open ? "iris-panel--open" : "iris-panel--closed"}`}>

          {/* Header */}
          <div className="iris-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "linear-gradient(135deg, #ec4899, #a855f7, #6366f1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, boxShadow: "0 4px 14px rgba(168,85,247,0.4)",
                flexShrink: 0,
              }}>
                ✦
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className="iris-header-name">Iris</span>
                  <span className="iris-online" />
                </div>
                <div className="iris-header-sub">Color Insight · Style Assistant</div>
              </div>
            </div>
            <div style={{ display: "flex", position: "relative", zIndex: 1 }}>
              <button className="iris-icon-btn" onClick={clearChat} title="Clear chat">🗑</button>
              <button className="iris-icon-btn" onClick={() => setOpen(false)} title="Close">✕</button>
            </div>
          </div>

          {/* Messages */}
          <div className="iris-messages">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick Chips */}
          {showChips && (
            <div className="iris-chips">
              {QUICK_CHIPS.map((c) => (
                <button
                  key={c.label}
                  className="iris-chip"
                  onClick={() => sendMessage(c.msg)}
                  disabled={loading}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          <div className="iris-divider" />

          {/* Input */}
          <div className="iris-input-row">
            <textarea
              ref={inputRef}
              className="iris-textarea"
              placeholder="Ask Iris about your style…"
              value={input}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              className="iris-send"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Send"
            >
              {loading ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path strokeLinecap="round"
                    d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                    style={{ animation: "irisSpinLoader 1s linear infinite", transformOrigin: "center" }}
                  />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ColorInsightChatbot;
