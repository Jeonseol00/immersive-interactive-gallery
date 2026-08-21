"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAICurator } from "@/hooks/useAICurator";

export function AICuratorChat() {
  const {
    isOpen,
    setIsOpen,
    input,
    setInput,
    loading,
    isAudioEnabled,
    isSpeaking,
    messages,
    messagesEndRef,
    sendMessage,
    handleKeyDown,
    toggleAudio,
    pathname
  } = useAICurator();

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* Mystical Glowing Orb Trigger */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[9999] w-14 h-14 rounded-full flex items-center justify-center cursor-pointer p-0 border-0 outline-none mix-blend-screen overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Core Glow - Reacts to Speaking State */}
        <motion.div 
          animate={{ scale: isSpeaking ? [1, 1.4, 1] : [1, 1.2, 1], opacity: isSpeaking ? [0.8, 1, 0.8] : [0.6, 1, 0.6] }}
          transition={{ duration: isSpeaking ? 1 : 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-amber-500/80 blur-xl"
        />
        {/* Physical Sphere */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-amber-700 via-amber-400 to-white shadow-[inset_0_-2px_10px_rgba(255,255,255,0.8),0_0_20px_rgba(251,191,36,0.8)] border border-white/40"
        >
           {isOpen && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full backdrop-blur-sm">
                <div className="w-4 h-0.5 bg-white rounded-full -rotate-45 absolute" />
                <div className="w-4 h-0.5 bg-white rounded-full rotate-45 absolute" />
             </div>
           )}
        </motion.div>
      </motion.button>

      {/* Oracle Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-28 right-8 z-[9998] w-[400px] max-w-[calc(100vw-4rem)] h-[600px] max-h-[calc(100vh-10rem)] bg-neutral-950/40 backdrop-blur-3xl border border-white/5 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col overflow-hidden ring-1 ring-white/10"
          >
            {/* Ambient Lighting Override Top */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 shrink-0 relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  animate={{ scale: isSpeaking ? [1, 1.5, 1] : [1, 1.2, 1] }}
                  transition={{ duration: isSpeaking ? 0.8 : 2, repeat: Infinity }}
                  className="w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]" 
                />
                <div>
                  <h3 className="text-sm font-black text-white/90 uppercase tracking-[0.2em]">The Curator</h3>
                  <p className="text-[9px] text-amber-500/70 uppercase tracking-widest mt-0.5">
                    {isSpeaking ? "Voice Link Active" : "Neuromorphic Analytics"}
                  </p>
                </div>
              </div>

              {/* Audio Toggle Switch */}
              <button
                onClick={toggleAudio}
                className={`p-2 rounded-lg border transition-colors flex items-center gap-2 ${
                  isAudioEnabled 
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                    : "bg-white/5 border-white/10 text-neutral-500"
                }`}
                title="Toggle Oracle Voice"
              >
                {/* Minimalist Sound Wave Icon */}
                <div className="flex items-end gap-0.5 h-3">
                  <motion.div animate={{ height: (isSpeaking && isAudioEnabled) ? ["40%", "100%", "40%"] : "40%" }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.0 }} className="w-0.5 bg-current rounded-full" />
                  <motion.div animate={{ height: (isSpeaking && isAudioEnabled) ? ["60%", "100%", "60%"] : "80%" }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} className="w-0.5 bg-current rounded-full" />
                  <motion.div animate={{ height: (isSpeaking && isAudioEnabled) ? ["30%", "80%", "30%"] : "60%" }} transition={{ duration: 0.7, repeat: Infinity, delay: 0.2 }} className="w-0.5 bg-current rounded-full" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold">
                  Audio {isAudioEnabled ? "ON" : "OFF"}
                </span>
              </button>
            </div>

            {/* Messages Area */}
            <div 
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative z-10 no-scrollbar overscroll-contain"
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  key={i} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm leading-relaxed tracking-wide ${
                      msg.role === "user"
                        ? "bg-white/10 text-white rounded-br-sm border border-white/10 backdrop-blur-md"
                        : "text-neutral-300 font-serif text-[15px]"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-5 py-4 text-neutral-500 text-xs uppercase tracking-widest font-black flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-3 h-3 border border-amber-500/30 border-t-amber-500 rounded-full" />
                    Memproses Dimensi...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 relative z-10 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Utarakan pikiran Anda di sini..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-5 pr-12 py-4 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono placeholder:text-neutral-600"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/5 hover:bg-amber-500/20 text-neutral-400 hover:text-amber-500 flex items-center justify-center transition-colors disabled:opacity-30"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
