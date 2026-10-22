# LAPORAN PENGUJIAN QA MENYELURUH (END-TO-END) APLIKASI LARAS

Tanggal Pengujian Awal: 21 Oktober 2026  
Status Pembaruan: **Fix 7 Selesai & Terverifikasi (21 Oktober 2026)**  
Lingkungan Uji: Production Server (`http://localhost:3100`), Next.js 16.3.6, React 19.2.8, Tailwind CSS v4  

---

## 1. Tabel Hasil Pengujian (A1 – F3)

| Kode | Hasil | Bukti / Catatan Singkat |
| :--- | :--- | :--- |
| **A1** | **LOLOS** | Registrasi akun baru di `/auth` (nama, email, password) berhasil disimpan dan langsung mengautentikasi pengguna ke sesi belajar. |
| **A2** | **LOLOS** | Login akun baru berhasil diarahkan ke `/dashboard`, nama akun dan inisial pengguna tampil pada profil. |
| **A3** | **LOLOS** | *(Fix 7)* Tombol **Keluar** (Logout) telah ditambahkan di 3 tempat (Sidebar, Halaman Profil, dan Halaman Pengaturan). Mengklik tombol ini memanggil `POST /api/auth/logout`, mengakhiri sesi, dan mengarahkan ke `/auth`. Akses kembali ke `/dashboard` diblokir oleh middleware. |
| **A4** | **LOLOS** | Login menggunakan kredensial demo (`demo@gmail.com` / `demo123`) berhasil dan langsung masuk ke `/dashboard`. |
| **A5** | **LOLOS** | Login demo dengan password keliru ditolak oleh sistem dan memunculkan pesan error "Email atau password salah". |
| **A6** | **LOLOS** | Halaman `/dashboard` di-refresh (F5) saat login, sesi tetap aktif dan data progress pengguna tidak hilang. |
| **B1** | **LOLOS** | Mengakses `/admin` tanpa login otomatis dialihkan oleh middleware ke `/auth?redirect=/admin`. |
| **B2** | **LOLOS** | Mengakses `/admin` saat login sebagai akun demo (`demo@gmail.com`) ditolak oleh middleware dan dialihkan kembali ke `/auth?redirect=/admin`. |
| **B3** | **LOLOS** | Login sebagai kurator/admin (`admin@laras.id` / `admin123`) berhasil membuka halaman CMS `/admin` (Seksi Ringkasan, Korpus, dan Builder). |
| **C1** | **LOLOS** | *(Fix 7)* Peta jalur/roadmap pada dashboard menampilkan label yang presisi sesuai `src/lib/lessons.ts`: Node 2 berjudul **"Kenali Baju Nggembe"** (*Pelajaran 2 • Busana adat*) dan Node 4 berjudul **"Skenario Souraja"** (*Pelajaran 3 • Rumah adat*). |
| **C2** | **LOLOS** | Membuka Lesson 1 (`/dashboard/latihan/1`) menampilkan kartu sumber budaya (SourceCard) berlabel `"Draft — dalam proses validasi"` dengan kode registrasi `SULTENG-BBS-2024/KL-01` dan lembaga penjamin adat. |
| **C3** | **LOLOS** | Seluruh 5 soal pada Lesson 1 berhasil dijawab hingga tuntas: `tabe-choice` (choice - pilihan ganda), `tabe-fact` (truefalse - mitos/fakta), `tabe-match` (match - pasangan istilah), `tabe-order` (order - urutan bertamu), dan `tabe-scenario` (scenario - dialog bertamu bertingkat). Feedback visual benar/salah beserta penjelasan etika budaya selalu muncul setelah tombol "Periksa". |
| **C4** | **LOLOS** | Menjawab satu soal dengan sengaja salah langsung mengurangi indikator hati/lives dari 3/3 menjadi 2/3 di bilah atas. |
| **C5** | **LOLOS** | Lesson 1 diselesaikan sampai layar `/dashboard/evaluasi?lesson=1`, perolehan XP (+20 XP) bertambah ke profil, Lesson 1 bertanda centang selesai, dan Lesson 2 terbuka (unlocked). |
| **C6** | **LOLOS** | Halaman dashboard di-refresh (F5), status penyelesaian Lesson 1 dan pembukaan Lesson 2 beserta total XP tetap tersimpan secara persisten. |
| **C7** | **LOLOS** | Lesson 2 (`/dashboard/latihan/2` mencakup soal hotspot Baju Nggembe & Buya Sabe) dan Lesson 3 (`/dashboard/latihan/3` skenario Souraja) dapat dibuka, dimainkan, dan diselesaikan hingga tuntas. |
| **D1** | **LOLOS** | Mengakses `/dashboard/latihan` memuat modul `CulturalGameEngine` yang menyajikan data materi kebudayaan asli (Salam & Adab Tabe Kaili Ledo, bukan teks dummy acak). |
| **D2** | **LOLOS** | Sesi latihan dimainkan sampai akhir, memunculkan layar ringkasan sesi ("Sesi Selesai!") lengkap dengan raihan XP (+30 XP), akurasi (100%), dan streak hari. |
| **D3** | **LOLOS** | Kartu sumber budaya di dalam layar ringkasan game engine tampil dengan badge penanda **DATA DEMO**, mencantumkan kode `SULTENG-BBS-2024/KL-01` dan narahubung lembaga adat. |
| **E1** | **LOLOS** | Seksi Ringkasan CMS menampilkan 4 kartu statistik: Total Entri Budaya, Menunggu Verifikasi, Entri Draft, dan Sesi Game; nilai statistik valid dan sinkron. |
| **E2** | **LOLOS** | Pada tab Builder, fitur "Sesi Baru" berhasil membuat sesi (`SES-CUSTOM-0742`), menambah dan mengedit soal, lalu tombol "Simpan Alur Sesi" menyimpannya ke daftar sesi. |
| **E3** | **LOLOS** | Tombol "Export JSON" berhasil memicu pengunduhan berkas konfigurasi sesi JSON (`SES-CUSTOM-0742.json`). |
| **E4** | **LOLOS** | Tombol "Uji Coba Game" membuka modal interaktif simulasi engine permainan dalam bingkai pratinjau dan dapat ditutup kembali dengan lancar. |
| **E5** | **LOLOS** | Halaman CMS di-refresh (F5), sesi baru hasil pembuatan pada E2 tetap tersimpan di penyimpanan lokal dan tersedia di dropdown sesi. |
| **E6** | **LOLOS** | Pada tab Verifikasi Korpus, pencarian kata kunci ("Tabe") menyaring tabel secara instan, dan pergantian filter status menyaring baris data dengan tepat. |
| **E7** | **LOLOS** | Membuka detail entri budaya, mengubah status verifikasinya menjadi "Sahkan (Verified)", lalu me-refresh halaman (F5) membuktikan status baru tersimpan secara persisten di penyimpanan. |
| **E8** | **LOLOS** | *(Fix 7)* Form modal "+ Tambah Entri Budaya" kini menggunakan `noValidate`, tombol submit di dalam form, pembersihan whitespace, dan penyimpanan sinkron ke `localStorage`. Pengisian entri baru (misal: "Guma Kaili") dan satu kali klik "Simpan sebagai Draft" langsung menutup modal dan menampilkan entri baru di tabel korpus. |
| **F1** | **LOLOS** | Halaman depan (landing) tampil normal dan responsif. Logo Munas IX Permikomnas (`/logo/logo-munas-landscape.png`) tampil jernih di bagian footer tanpa ada broken image. |
| **F2** | **LOLOS** | Seluruh 12 rute utama (`/`, `/auth`, `/onboarding`, `/dashboard`, `/dashboard/arcade`, `/dashboard/paspor`, `/dashboard/profil`, `/dashboard/pengaturan`, `/dashboard/belajar`, `/dashboard/culture-connection`, `/dashboard/latihan`, `/dashboard/latihan/1`) merespons dengan status HTTP 200 tanpa halaman 404 maupun 500 error. |
| **F3** | **LOLOS** | Pengujian pada viewport ponsel (390 x 844 px) menunjukkan tata letak landing page dan dashboard tertata rapi, teks mudah dibaca, navigasi bawah berfungsi baik, dan tidak ada tumpang tindih elemen. |

---

## 2. Status Perbaikan Bug (Fix 7)

### Bug 1: Ketiadaan Tombol Logout pada Antarmuka Pengguna (UI)
- **Status**: **TERATASI (RESOLVED)**
- **Implementasi**:
  1. Menambahkan kartu akun pengguna beserta tombol "Keluar" (dengan ikon `LogOut`) pada bagian bawah sidebar dashboard (`src/app/components/DuolingoSidebar.tsx`).
  2. Menambahkan tombol "Keluar" pada header profil (`src/app/dashboard/profil/page.tsx`).
  3. Menambahkan kartu "Akun & Sesi" dengan tombol "Keluar" pada halaman pengaturan (`src/app/dashboard/pengaturan/page.tsx`).
  Semua tombol hanya muncul saat sesi terautentikasi dan mengeksekusi `POST /api/auth/logout` lalu me-redirect ke `/auth`.

### Bug 2: Inkonsistensi Label Roadmap Terhadap Isi Modul Pelajaran
- **Status**: **TERATASI (RESOLVED)**
- **Implementasi**:
  Memperbaiki konfigurasi `pathNodes` pada `src/app/dashboard/page.tsx`:
  - Node 2 (href `/dashboard/latihan/2`): `title: "Kenali Baju Nggembe"`, `subtitle: "Pelajaran 2 • Busana adat"`.
  - Node 4 (href `/dashboard/latihan/3`): `title: "Skenario Souraja"`, `subtitle: "Pelajaran 3 • Rumah adat"`.

### Bug 3: Modal Form Tambah Entri Budaya Memerlukan Submit yang Andal
- **Status**: **TERATASI (RESOLVED)**
- **Implementasi**:
  Pada `src/app/admin/page.tsx`:
  1. Menambahkan `noValidate` pada `<form onSubmit={handleAddEntry}>` dan menghapus `required` native HTML yang berpotensi menahan trigger form.
  2. Memastikan tombol submit bertipe `submit` dan berada di dalam form.
  3. Menyimpan entri baru secara sinkron ke state dan `localStorage`, serta mereset filter tab korpus ke `"all"` agar entri baru berstatus draft langsung tampak pada tabel.

---

## 3. Daftar Catatan Console Browser

Console browser tercatat sangat bersih dari crash JavaScript. Hanya terdapat catatan peringatan non-blocking berikut:
1. `The "middleware" file convention is deprecated. Please use "proxy" instead.` *(Next.js warning saat inisialisasi route matcher)*.
2. `Gagal memutar audio: NotAllowedError: play() failed because the user didn't interact with the document first.` *(Browser Autoplay Policy saat membuka kuis sebelum ada interaksi klik pada dokumen)*.

Tidak ada error fatal `500`, `Uncaught TypeError`, atau `Hydration mismatch`.

---

## 4. Kesimpulan Kesiapan Aplikasi

Setelah diterapkannya **Fix 7**, seluruh 26 kode skenario pengujian (A1 s/d F3) kini berstatus **100% LOLOS**. Aplikasi LARAS **SANGAT SIAP** untuk dikumpulkan ke ajang Munas IX Permikomnas 2026. Alur end-to-end dari autentikasi, logout, gamifikasi belajar budaya Sulawesi Tengah, engine game interaktif dengan badge DATA DEMO, serta CMS kurator adat (Ringkasan, Korpus, dan Game Flow Builder) berfungsi dengan performa andal, stabil, dan tampilan visual yang estetis.

---

## 5. Versi dan Durasi Hasil Build

- **Status Build**: **SUKSES (Exit Code 0)**
- **Durasi Build**: **8.1 detik** (Turbopack compile 2.3s, TypeScript 4.4s, Static generation 1.4s)
- **Versi Framework & Runtime**: Next.js `16.3.6`, React `19.2.8`, Tailwind CSS `v4`
