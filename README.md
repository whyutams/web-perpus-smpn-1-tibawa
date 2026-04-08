<div align="center">

# 🎓 MBKM UNG Web Platform
### Portofolio Kelompok MBKM

Platform digital resmi untuk kelompok mahasiswa **Merdeka Belajar Kampus Merdeka (MBKM)** 

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E?style=for-the-badge&logo=supabase)

</div>

## 🛠️ Tech Stack

### Core
| Teknologi | Versi | Kegunaan |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.1.6 | Framework utama (App Router) |
| [TypeScript](https://typescriptlang.org) | 5.x | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | 3.x | Styling |
| [Supabase](https://supabase.com) | 2.x | Auth, Database, Storage |

### UI & Animasi
| Teknologi | Kegunaan |
|---|---|
| [AOS](https://michalsnik.github.io/aos/) | Animasi utama |
| [Framer Motion](https://www.framer.com/motion/) | Animasi tambahan |
| [Lenis](https://lenis.darkroom.engineering/) | Smooth scrolling |
| [Lucide React](https://lucide.dev/) | Icon library |

### Editor & Lainnya
| Teknologi | Kegunaan |
|---|---|
| [TipTap](https://tiptap.dev/) | Rich text editor untuk blog |
| [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | Utility class management |

## 🚀 Cara Memulai

### Prasyarat

Pastikan sudah menginstal:
- [Node.js](https://nodejs.org) versi **18.x** atau lebih baru
- [npm](https://www.npmjs.com/) atau package manager lainnya
- Akun [Supabase](https://supabase.com) (gratis)

### 1. Clone Repositori

```bash
git clone https://github.com/whyutams/mbkm-ung-web.git
cd mbkm-ung-web
```

### 2. Install Dependensi

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Buat file `.env.local` di root proyek:

```env
# Supabase
# Dapatkan dari: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.


## 📜 Scripts

| Command | Kegunaan |
|---|---|
| `npm run dev` | Jalankan development server |
| `npm run host` | Jalankan development server via local network |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan production server |
| `npm run lint` | Cek kode dengan ESLint |

---

<div align="center">

Selamat Mencoba ✨

</div>