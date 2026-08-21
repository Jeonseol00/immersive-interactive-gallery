"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export function useAICurator() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ttsQueue = useRef<string[]>([]);
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  
  const pathname = usePathname();
  const isSpecificArtwork = pathname.startsWith("/gallery/") && pathname.split("/").length === 3;
  const activeSlug = isSpecificArtwork ? pathname.split("/").pop() : null;

  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: activeSlug 
        ? "Saya dapat merasakan resonansi dari karya ini. Ada esensi yang tersembunyi yang ingin Anda ketahui?" 
        : "Energi penciptaan memenuhi dimensi ini. Saya adalah kurator Anda. Apa visi yang ingin Anda jelajahi?"
    },
  ]);

  // Handle automatic scrolling to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean up audio on unmount or close
  useEffect(() => {
    if (!isOpen) {
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current = null;
      }
      ttsQueue.current = [];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSpeaking(false);
    }
  }, [isOpen]);

  const processTTSQueue = () => {
    if (ttsQueue.current.length === 0) {
      setIsSpeaking(false);
      return;
    }
    const textChunk = ttsQueue.current.shift();
    if (!textChunk) return;
    
    setIsSpeaking(true);
    // Google Translate Audio API Backdoor - No Key Required, 100% OS bypass
    const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(textChunk)}&tl=id&client=tw-ob`;
    const audio = new Audio(url);
    currentAudio.current = audio;
    
    audio.onended = () => {
      processTTSQueue();
    };
    audio.onerror = () => {
      processTTSQueue(); // skip broken chunks silently
    };
    
    audio.play().catch(() => {
      setIsSpeaking(false);
    });
  };

  const speakText = (text: string) => {
    if (!isAudioEnabled) return;
    
    // Stop ongoing audio
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current = null;
    }
    
    // Bersihkan karakter markdown agar tidak dibacakan spesifik oleh TTS
    const cleanText = text.replace(/[*_#`[\]()]/g, "");
    
    // Google TTS punya batas karakter ~200. Potong berdasarkan titik/tanda baca.
    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    ttsQueue.current = sentences.map(s => s.trim()).filter(s => s.length > 0);
    
    processTTSQueue();
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          activeSlug: activeSlug
        }),
      });

      const data = await res.json();
      const responseText = data.response || "Kesalahan gelombang.";
      setMessages((prev) => [...prev, { role: "assistant", content: responseText }]);
      speakText(responseText);
    } catch {
      const errorMsg = "Koneksi transenden kita sedikit terganggu. Bisakah Anda mengulangi niat tersebut?";
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
      speakText(errorMsg);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleAudio = () => {
    const newState = !isAudioEnabled;
    setIsAudioEnabled(newState);
    if (!newState) {
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current = null;
      }
      ttsQueue.current = [];
      setIsSpeaking(false);
    } else {
      // Pre-load authorization audio silent trick
      const testAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
      testAudio.play().catch(()=> {}); 
    }
  };

  return {
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
  };
}
