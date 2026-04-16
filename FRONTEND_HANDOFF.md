# 🎨 Frontend Developer Handoff: Sistem AI Curator

Pembaruan terbaru terhadap **The Visual Soul Engine** telah membawa fitur berat di sisi teknis (pemrosesan _Natural Language_, *Cloud Audio API*, dan pelacakan lintasan `activeSlug` via URL). 

Untuk mempermudah pekerjaan tim UI/UX, arsitek telah melakukan pemisahan *"Separation of Concerns"*. Anda kini dapat melakukan *styling*, *styling overhaul*, atau menambahkan fitur-fitur tata rupa animasi murni tanpa harus berurusan dengan kerumitan mesin *backend*.

---

## 1. Abstraksi UI (Dumb Components)

Berkas utama Anda adalah: **`src/components/ui/AICuratorChat.tsx`**.
Jangan khawatir melihat *file* ini. *File* ini sekarang telah dipangkas hingga menjadi wadah HTML (JSX) dan Framer Motion murni. Seluruh sistem interaksi dari komponen ini dikendalikan oleh *Custom Hook* terpusat.

**Apa yang bisa Anda lakukan di berkas ini?**
- Mengubah desain lebar bingkai (*width*, *height*).
- Menambah sistem partikel baru.
- Menyetel animasi transisi (`AnimatePresence`).
- Mempercantik antarmuka teks.

---

## 2. Abstraksi Logika (Smart Hooks)

Seluruh logika berat (*Backdoor Google TTS*, *fetch endpoint* `/api/chat`, antrean data respons, _auto-scrolling_ jendela, dan filter lintasan) kini disembunyikan dan diuraikan dengan sangat rapih di: 
**`src/hooks/useAICurator.ts`**

Tim Frontend tidak perlu menyentuh _file_ ini kecuali ingin mengubah format penyimpanan data *memory* si AI. Hook ini secara efisien melempar fungsi dan *state* siap pakai seperti:

```tsx
const {
    isOpen,          // bolean: Apakah jendela chat sedang terbuka
    setIsOpen,       // func: Membuka/menutup terminal
    input,           // string: Teks yang sedang diketik user
    setInput,        // func: setState untuk input
    loading,         // boolean: Transisi fetch sedang berjalan
    isAudioEnabled,  // boolean: Status tombol toggle suara dari user
    isSpeaking,      // boolean: Sensor mesin jika audio Cloud sedang disiarkan (Gunakan ini untuk mentriger animasi pendar cahaya)
    messages,        // array: Daftar lengkap riwayat chat (user & assistant)
    messagesEndRef,  // divRef: Target jangkar untuk fungsi scroll-to-bottom otomatis
    sendMessage,     // func: Fungsi submit API
    handleKeyDown,   // func: Pendeteksi tombol "Enter"
    toggleAudio      // func: Mesin sakelar audio 
} = useAICurator();
```

---

## 3. Prasyarat Pemutakhiran Lokal (Sangat Penting!)

Jika Anda baru men-*checkout* repositori ini, pastikan variabel `.env.local` Anda selaras dengan `.env.example` terbaru. Fitur AI kini memiliki kunci proteksi:

```bash
# Perhatian untuk Tim Frontend:
# Jika tidak punya akses ke akun Google Gemini tim dev, minta kuncinya ke Lead Engineer, 
# atau fitur pendaran teks AI akan terus mengeluarkan "Kesalahan Gelombang".
GEMINI_API_KEY="AIzaSy...xxx"
```

## 4. Tips Debugging Cepat
Jika Anda sedang men-desain *Chat Bubble* namun merasa lama saat harus menunggu AI mengetik dulu (misal internet lambat), Anda dapat "Membajak" sirkuit ini langsung dalam `useAICurator.ts`.
Carilah fungsi `sendMessage`, lalu matikan sementara blok `fetch(...)` dan timpa variabelnya menggunakan *Mock Data* langsung agar UI Anda muncul instan selama sesi *editing* CSS. 
```javascript
  // Contoh Bypass khusus frontend test:
  // const res = await fetch("/api/chat"...);
  const responseText = "Ini ketikan super cepat lokal untuk tes UI desain partikel kita yang baru."
  setMessages((prev) => [...prev, { role: "assistant", content: responseText }]);
  speakText(responseText);
```

> **Catatan Lead:** Ingat, seluruh animasi gerak pendar *"Breath"* si Bola Pijar dan Indikator Perekaman terkait secara absolut dengan properti `isSpeaking` dari `hooks` kita! Manfaatkan status ini semaksimal mungkin untuk menciptakan antarmuka yang sangat responsif.
