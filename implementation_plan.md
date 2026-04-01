# SOFTWARE DESIGN DOCUMENT (SDD)
**Nama Proyek:** Immersive Interactive Gallery  
**Versi Dokumen:** 1.1.0 (Mobile-First & Full-Stack Edition)  
**Status:** Draf Diskusi Tim (Menunggu Persetujuan Eksekusi)

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen
Dokumen ini mendefinisikan arsitektur sistem, spesifikasi interaksi antarmuka (UI/UX) dengan pendekatan mutlak **Mobile-First**, dan transisi teknis dari perancangan hingga implementasi untuk Immersive Interactive Gallery. Dokumen ini bertindak sebagai "sumber kebenaran tunggal" (*Single Source of Truth*) bagi tim agar eksekusi fitur animasi tingkat lanjut berjalan mulus tanpa mengorbankan performa.

### 1.2 Cakupan Proyek
Sistem ini memecah pengembangan aplikasi web performa tinggi menjadi dua lapisan utama (*Frontend* dan *Backend*), memastikan pengalaman visual imersif di perangkat mobile maupun desktop, dan manajemen pengiriman data resolusi tinggi yang terstruktur.

---

## 2. Prinsip Desain UI/UX (Mobile-First Paradigm)

Pendekatan *Mobile-First* berarti menempatkan interaksi perangkat sentuh (layar kecil) sebagai acuan dasar (*baseline*), kemudian melakukan peningkatan progresif (*progressive enhancement*) untuk desktop.

> [!IMPORTANT]
> **Aturan Emas Interaksi Mobile:** Di perangkat *touch-screen*, tidak ada state *Hover*. Semua animasi kompleks yang dipicu oleh kursor/hover di Desktop wajib dipetakan menjadi interaksi *Tap/Click* dengan umpan balik (*feedback*) visual maksimum 100ms.

*   **Navigasi Berbasis Sentuhan (Swipe & Tap):** Penggunaan elemen yang ramah terhadap usapan jari (*swipeable*) untuk galeri, meminimalisir tombol kecil.
*   **Vertical Stacking (Penumpukan Vertikal):** Elemen *Dynamic Hover Ecosystem* (seperti tab/akordion) tidak akan dideretkan menyamping pada layar di bawah 768px, melainkan ditumpuk dari atas ke bawah.
*   **Aksesibilitas Area Sentuh (Touch Targets):** Setiap elemen pemicu (thumbnail, ikon) wajib memiliki ukuran minimal **48x48 CSS piksel** (WCAG).

---

## 3. Arsitektur Sistem & Tech Stack

Sistem dipisah menjadi dua lapisan independen yang berkomunikasi melalui API terstruktur.

### 3.1 Lapisan Frontend (Client & Animation)
*   **Core Framework:** Next.js (App Router) – Rendering mutakhir untuk optimasi SEO, pemisahan *Server Components* dan *Client Components* (mengurangi beban JavaScript di HP pengguna).
*   **Animation Engine:**
    *   **Framer Motion:** Menangani *Shared Element Transition*, menciptakan ilusi kartu thumbnail yang membesar mulus menjadi *Hero Image* di halaman Detail (via properti `layoutId`).
    *   **GSAP & Lenis:** Ditujukan khusus untuk pengguna tablet/desktop untuk skrol paralaks (*smooth scroll*) yang mewah. Pada perangkat mobile, efek ini akan dikurangi (*graceful degradation*) agar tidak membebani baterai.
*   **State Management:** Zustand – Menyimpan state antarmuka yang ringan (misalnya: status tab mana yang sedang ditekan).
*   **Styling:** Tailwind CSS – Murni gaya fungsional (*utility-first*).

### 3.2 Lapisan Backend (Content Delivery & API)
*   **Headless CMS:** Sanity.io (Sangat direkomendasikan karena kapabilitas *Edge Image Transformation*-nya yang superior) atau Strapi.
*   **API Layer:** Next.js Route Handlers (Folder `app/api/`) – Sebagai proksi (*middleware*) yang mengatur dan memvalidasi tipe (TypeScript) kembalian JSON dari CMS ke Frontend.
*   **Image Processing & CDN:** Mengandalkan integrasi *next/image* dengan layanan Vercel Edge Cache atau CDN CMS untuk me-render format paling efisien (WebP/AVIF) dengan cropping otomatis sesaat sebelum disajikan ke user.

---

## 4. Pembagian Fase Eksekusi

Proyek akan dijalankan dengan metode *Agile* menjadi dua fase yang runut.

### 🚀 Phase 1: Backend System & Data Foundation
Fase ini dikerjakan agar arsitektur aliran data kokoh terlebih dahulu.
1.  **Deployment CMS & Skema Data:** Setup Headless CMS dan menyusun struktur konten (menambahkan field unik khusus animasi seperti `parallaxSpeed` dan `isLCP`).
2.  **Pembuatan API & Typed Responses:** Membangun *endpoint* di `src/app/api/...` yang akan mengembalikan *array* JSON yang aman bagi tipe (Type-Safe).
3.  **Optimalisasi Pipeline Gambar:** Memastikan CDN mempublikasikan metadata gambar esensial (Lebar, Tinggi, Rasio Aspek) sehingga Frontend dapat melakukan komputasi pra-render untuk anti-CLS.

### 🎨 Phase 2: Frontend System & Mobile-First Integration
Fase integrasi visual yang menitikberatkan pada perangkat seluler.
1.  **Skeleton & Layouting (Mobile):** Membuat struktur kerangka `layout.tsx` dan halaman grid galeri khusus layar seluler menggunakan utilitas dasar Tailwind. Menarik *mock data* dari API.
2.  **State Dasar & Transisi:* Shared Element*:** Mengintegrasikan Zustand untuk melacak navigasi layar sentuh (*Tap*). Membangun *engine layoutId* Framer Motion agar thumbnail membesar presisi ke halaman Detail.
3.  **Desktop Enhancement (Immersive Scroll):** Mengaplikasikan *Lenis Smooth Scroll* dan pergerakan objek terikat `ScrollTrigger` GSAP spesifik untuk *viewport* besar (breakpoint `md:` dan `lg:`).
4.  **Polish (Performa & Aksesibilitas):** Menjalankan audit LCP (*Largest Contentful Paint*), mengaktikan *preloading* (`priority={true}`) pada setiap gambar Hero bagian atas, dan mengunci integrasi layar responsif (*reduce motion check*).

---

## 5. Struktur Data Konten (JSON Schema Final)

Sesuai evaluasi *Expert*, penambahan properti dimensi dan tag prioritas disuntikkan ke dalam respons API agar Next.js `<Image>` dapat menghindari *kolaps layout* (CLS).

```json
{
  "galleryItems": [
    {
      "id": "item-001",
      "title": "Neon Dystopia",
      "category": "Cyberpunk",
      "slug": "neon-dystopia",
      "images": {
        "thumbnail": "/images/neon-dystopia-thumb.webp",
        "fullResolution": "/images/neon-dystopia-full.webp",
        "altText": "Cityscape in neon colors during heavy rain",
        "dimensions": {
          "width": 1920,
          "height": 1080,
          "aspectRatio": "16/9"
        },
        "isLCP": true
      },
      "interactions": {
        "parallaxSpeed": 0.2,
        "accordionDescription": "Sebuah eksplorasi visual tentang kehidupan urban di masa depan yang padat."
      },
      "metadata": {
        "author": "Fikri",
        "createdAt": "2026-04-02T00:00:00Z"
      }
    }
  ]
}
```
> [!NOTE]
> Properti `"isLCP": true` wajib diloloskan oleh Backend. Frontend akan membaca ini untuk memicu *render prioritised loading* pada gambar yang berada di *Abode the Fold* (atas garis lipatan scroll).

---

## 6. Struktur Direktori Proyek (Full-Stack Edition)

Peta jalan folder agar tim (*Frontend* dan *Backend* proksi) dapat menaruh logikanya secara rapi:

```plaintext
immersive-gallery/
├── public/                 <- [Aset Statis Fallback]
├── src/
│   ├── app/
│   │   ├── api/            <- [BACKEND: Route Handlers / Proxy CMS]
│   │   │   └── gallery/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── gallery/[slug]/
│   ├── components/
│   │   ├── ui/             <- [FRONTEND: Atomic Components]
│   │   ├── layout/         <- [FRONTEND: Global Wrappers (Nav/Footer)]
│   │   └── sections/       <- [FRONTEND: Mobile-First Sections]
│   ├── lib/
│   │   ├── store.ts        <- [STATE: Zustand]
│   │   ├── api.ts          <- [FETCHING: Integrasi Endpoint API]
│   │   └── animations.ts   <- [ANIMASI: GSAP & Framer Utils]
│   └── types/
│       └── index.ts        <- [TYPING: Typescript Interface JSON]
├── next.config.js          <- [Pengaturan Remote Patterns Images]
└── tailwind.config.ts
```

## User Review Required

Tim, silakan baca SDD ini. Fokus krusial ada pada penerapan aturan "Tanpa-Hover" di seluler dan pembagian fase. Apakah Anda setuju format SDD ini menjadi acuan eksekusi kita berikutnya?
