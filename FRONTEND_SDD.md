# FRONTEND IMPLEMENTATION GUIDE (SDD)
**Proyek:** Immersive Interactive Gallery  
**Fase:** Eksekusi Tahap 2 (Frontend & UI/UX Integration)  
**Dokumen Target:** Frontend Engineering Team  
**Status:** FINAL - *Strict Implementation Guidelines*

---

## 1. Executive Summary & Core Paradigm

Dokumen ini adalah spesifikasi arsitektur (*Software Design Document*) khusus untuk tim Frontend. Backend telah selesai dibangun dan siap dikonsumsi. Tugas tim Frontend adalah membangun antarmuka imersif, interaktif, dan berkinerja tinggi tanpa kompromi.

> [!WARNING]
> **Paradigma Mutlak: Mobile-First & Zero-Hover di Perangkat Sentuh**
> Mulailah *coding* dari resolusi 320px. **DILARANG KERAS** menggunakan interaksi *hover* (seperti `onMouseEnter`) yang mengubah *state* DOM pada perangkat *mobile*. Semua interaksi *mobile* harus dipetakan ke *Tap/Click*. Interaksi *hover* mewah hanya boleh dieksekusi setelah *breakpoint* `md:` (Tailwind 768px).

---

## 2. Tech Stack & Ekosistem Terpilih

Tim diwajibkan menggunakan ekosistem berikut. Dilarang memasukkan *library* pihak ketiga tambahan yang mencemari *bundle size* tanpa persetujuan *Tech Lead*.

*   **Core:** Next.js 15 (App Router, Server & Client Components)
*   **Styling:** Tailwind CSS (Utility-first)
*   **State Management:** Zustand (Untuk mengelola *state* UI global, misal: *active gallery ID*)
*   **Layout Animations:** Framer Motion (Eksklusif untuk perpindahan rute dan eksekusi `layoutId`)
*   **Scroll & Parallax:** GSAP & Lenis (Untuk membajak *scroll* menjadi mulus dan melakukan komputasi paralaks berbasis *ScrollTrigger*)

---

## 3. Integrasi Backend & Konsumsi Data

Sistem *Backend* (Route Handlers) sudah menghasilkan tipe data JSON mutakhir.
*   **Endpoint Global:** `GET /api/gallery?page=1&limit=10`
*   **Endpoint Detail:** `GET /api/gallery/[slug]`
*   **Antarmuka Tipe (TypeScript):** Gunakan dan *import* dari `src/types/index.ts`.

> [!IMPORTANT]
> Backend telah mengirim properti kritikal berupa object `dimensions` (width, height, aspectRatio) dan boolean `isLCP` pada setiap objek array. Frontend **WAJIB** mengekstrak parameter ini dan memasukkannya ke komponen `next/image` untuk mencegah *Cumulative Layout Shift* (CLS). Jika data berstatus `isLCP: true`, komponen `<Image priority={true} />` wajib diaktifkan.

---

## 4. Spesifikasi Fisik & Arsitektur Komponen

Struktur folder Frontend akan dipusatkan di `src/components/` dengan metodologi *Atomic-ish*:
1.  **`ui/`**: Komponen mikro (*Button, ParallaxImage, SmoothScrollWrapper, HoverAccordion*).
2.  **`layout/`**: Pembungkus makro global (*Navbar, Footer, ModalOverlay*).
3.  **`sections/`**: Blok raksasa pembentuk halaman (*GalleryGrid, HeroSection, InteractiveTabs*).

---

## 5. Pedoman Rekayasa Animasi (Animation Engineering)

Kunci ekselensi proyek ini terletak pada 60FPS (*Frames per Second*) transisi yang ditawarkan. Tim Frontend harus mematuhi tiga lapis aturan di baewah:

### 5.1 Shared Element Transition (Framer Motion)
Saat pengguna menekan thumbnail di `/`, gambar tersebut harus "terbang" dan melebar menjadi gambar *Hero* di rute `/gallery/[slug]`.
*   **Instruksi:** Gunakan `<motion.img layoutId={"gallery-image-" + id} />` di kedua komponen (Grid & Hero) agar Framer Motion tahu itu adalah elemen yang sama.
*   **Kewajiban Performa:** Anda HANYA BOLEH membiarkan Framer menganimasikan kalkulasi `transform` (GPU-accelerated). Jangan pernah merancang CSS yang membuat animasi memodifikasi properti `width` atau `height` pada elemen yang sedang bertransisi, karena akan memicu *CPU Layout Thrashing*.

### 5.2 Immersive Smooth Scroll (Lenis + GSAP)
Terapkan Lenis pada `layout.tsx` atau komponen *wrapper* teratas agar fungsi gulir (*scroll*) di Desktop terasa mewah.
*   **Paralaks GSAP:** Elemen `<ParallaxImage>` wajib memiliki pembungkus dengan CSS `overflow: hidden`. Gambar `<motion.img>` di dalamnya akan diatur `scale: 1.1`, dan terikat komputasi *ScrollTrigger* `.to(y: "...")` dengan nilai kecepatan yang dipasok langsung dari respons Backend (`interaction.parallaxSpeed`).
*   **Degradasi Seluler:** Jika `window.innerWidth < 768px`, matikan atau kecilkan nilai paralaks GSAP secara signifikan agar baterai ponsel pengguna tidak terkuras terbakar (*Graceful Degradation*).

### 5.3 Dynamic Hover Ecosystem
*   Untuk komponen seperti akordion tab gambar ganda:
    *   **Desktop:** Gunakan `onMouseEnter` / `onMouseLeave` untuk memindahkan kelas CSS aktif.
    *   **Mobile:** Gunakan `onClick` dan susun elemen secara vertikal, bukan menyamping, untuk menghindari *clipping* teks.

---

## 6. Audit & Performa Aksesibilitas

Sebagai pengembang kelas dunia, aksesibilitas tidak boleh dikorbankan demi estetik.

*   **훅 (Hook) Deteksi Aksesibilitas:** Buat *custom hook* `useReducedMotion()`. Jika `window.matchMedia('(prefers-reduced-motion: reduce)')` bernilai true, SELURUH durasi animasi Framer Motion dan efek paralaks GSAP wajib diganti menjadi instan (`duration: 0` atau nonaktif kodenya).
*   **Manajemen Memori DOM:** Gambar di-*render* secara *lazy* secara bawaan kecuali yang ditandai `isLCP`. Untuk elemen panjang ke bawah, pertimbangkan virualisasi (opsional) atau matikan *listener* GSAP pada elemen yang sudah terlalu jauh tertinggal di atas *viewport viewport*.

---
**PENGESAHAN:**
Silakan pelajari pedoman teknis ini. Dengan diterimanya dokumen ini, proses fase Integrasi *Frontend* resmi dimulai. Jika ada kebingungan logika status antara Zustand dan Transisi rute Next.js, jadwalkan sesi tinjauan dengan *Tech Lead* atau *Architect*.
