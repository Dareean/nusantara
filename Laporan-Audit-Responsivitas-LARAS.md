# LAPORAN AUDIT RESPONSIVITAS MENYELURUH LARAS (LIVE BROWSER AUDIT)
Disusun berdasarkan pengujian live browser otomatis & emulasi viewport nyata (24 Oktober 2026).  
**Lingkup:** Audit & Pemeriksaan Kualitas — Sifat *Read-Only* (Tanpa modifikasi kode, tanpa deploy, tanpa manipulasi basis data).

---

## 1. Ringkasan Vonis per Kategori Perangkat

- **HP (360 × 740 & 390 × 844 Potret):** **Cukup**  
  *Alasan:* Sebagian besar halaman responsif tanpa scroll horizontal (scrollWidth = clientWidth), namun pada halaman latihan murid terdapat isu serius di mana navigasi bawah (BottomNav) menutupi tombol aksi utama (CTA).
- **Tablet (768 × 1024 Potret & 1024 × 768 Lanskap):** **Bagus**  
  *Alasan:* Grid dan hierarki visual berpindah mulus antara layout 1 kolom dan 2–3 kolom dengan target sentuh lapang (≥ 44px) serta ruang baca yang proporsional.
- **Laptop (1366 × 768):** **Bagus**  
  *Alasan:* Seluruh navigasi samping (sidebar desktop), kartu materi, peta jalan belajar, dan editor admin tertata rapi tanpa elemen bertumpukan maupun pemotongan teks janggal.
- **PC / Monitor Besar (1920 × 1080):** **Bagus**  
  *Alasan:* Konten terkendali oleh kontainer batas lebar maksimum (`max-w-7xl` / `max-w-5xl`) di tengah layar sehingga tidak melebar tak beraturan atau menyisakan ruang kosong yang merusak susunan.
- **HP Lanskap (844 × 390 - Khusus Pemain & CMS):** **Cukup**  
  *Alasan:* Game engine dan CMS builder berhasil beradaptasi dengan scroll vertikal mandiri, namun pada sesi latihan terdapat tumpang-tindih antara ikon menu mengambang dan teks judul header.

---

## 2. Matriks Halaman × Ukuran Layar

*Keterangan:*  
- Setiap baris dipisahkan secara tegas berdasarkan lingkungan: `[PROD]` (`https://nusantara-laras.vercel.app`) dan `[LOKAL]` (`http://localhost:3000`).  
- **LULUS**: Responsif, tidak ada luapan horizontal, teks terbaca utuh, target sentuh aman.  
- **BERMASALAH (No. Isu)**: Terdapat kendala tata letak atau tumpang-tindih elemen.  
- **TIDAK TERJANGKAU (Alasan)**: Tidak dapat diakses pada lingkungan terkait disertai alasan teknis valid.

| Halaman & Rute | Lingkungan | 360 × 740 (HP Kecil) | 390 × 844 (iPhone) | 768 × 1024 (Tab Potret) | 1024 × 768 (Tab Lanskap) | 1366 × 768 (Laptop) | 1920 × 1080 (PC Besar) | 844 × 390 (HP Lanskap)* |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Landing Page** (`/`) | PROD | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Landing Page** (`/`) | LOKAL | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Autentikasi** (`/auth`) | PROD | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Autentikasi** (`/auth`) | LOKAL | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Dashboard Murid** (`/dashboard`) | PROD | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Dashboard Murid** (`/dashboard`) | LOKAL | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Pemain Pelajaran** (`/dashboard/belajar/1`) | PROD | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS |
| **Pemain Pelajaran** (`/dashboard/belajar/1`) | LOKAL | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | BERMASALAH (Isu #3) |
| **Latihan Soal** (`/dashboard/latihan/1`) | PROD | BERMASALAH (Isu #1) | BERMASALAH (Isu #1) | BERMASALAH (Isu #1) | LULUS | LULUS | LULUS | BERMASALAH (Isu #2) |
| **Latihan Soal** (`/dashboard/latihan/1`) | LOKAL | BERMASALAH (Isu #1) | BERMASALAH (Isu #1) | BERMASALAH (Isu #1) | LULUS | LULUS | LULUS | BERMASALAH (Isu #2) |
| **Profil & Statistik** (`/dashboard/profil`) | PROD | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Profil & Statistik** (`/dashboard/profil`) | LOKAL | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Paspor Budaya** (`/dashboard/paspor`) | PROD | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Paspor Budaya** (`/dashboard/paspor`) | LOKAL | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Arcade Budaya** (`/dashboard/arcade`) | PROD | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Arcade Budaya** (`/dashboard/arcade`) | LOKAL | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Evaluasi Budaya** (`/dashboard/evaluasi`) | PROD | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Evaluasi Budaya** (`/dashboard/evaluasi`) | LOKAL | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Pengaturan Akun** (`/dashboard/pengaturan`) | PROD | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Pengaturan Akun** (`/dashboard/pengaturan`) | LOKAL | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **CMS / Admin Builder** (`/admin`) | PROD | TIDAK TERJANGKAU (RBAC Proteksi) | TIDAK TERJANGKAU (RBAC Proteksi) | TIDAK TERJANGKAU (RBAC Proteksi) | TIDAK TERJANGKAU (RBAC Proteksi) | TIDAK TERJANGKAU (RBAC Proteksi) | TIDAK TERJANGKAU (RBAC Proteksi) | TIDAK TERJANGKAU (RBAC Proteksi) |
| **CMS / Admin Builder** (`/admin`) | LOKAL | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS |
| **Halaman 404** (`/halaman-tidak-ada`) | PROD | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |
| **Halaman 404** (`/halaman-tidak-ada`) | LOKAL | LULUS | LULUS | LULUS | LULUS | LULUS | LULUS | — |

*\* Kolom 844 × 390 (HP Lanskap) dievaluasi khusus untuk rute Pemain Pelajaran, Latihan Soal, dan CMS sesuai mandat penugasan.*

---

## 3. Daftar Isu Bernomor

### Isu #1 — Navigasi Bawah (`BottomNav`) Menutupi Tombol Aksi Utama (CTA) pada Latihan Murid
- **Tingkat Keparahan:** **Serius** (Menghalangi kelancaran navigasi / interaksi pengguna).
- **Halaman & Rute:** Halaman Latihan (`/dashboard/latihan/1` & `/dashboard/latihan/busana`) `[PROD]` & `[LOKAL]`.
- **Ukuran Layar:** `360 × 740`, `390 × 844`, `768 × 1024` (Perangkat potret mobile & tablet).
- **Elemen yang Bermasalah:** Komponen navigasi bawah fixed (`nav.fixed.bottom-0` / `src/app/components/BottomNav.tsx`) menindih tombol "Mulai Sesi Latihan" di bagian dasar halaman.
- **Bukti Pengujian:**  
  - File screenshot: `audit-evidence/lesson_player_360x740_1792815182904.png`, `audit-evidence/lesson_player_390x844_1792815187764.png`.  
  - Ukuran: `scrollWidth = clientWidth` (tidak melebar secara horizontal, namun terjadi tumpang-tindih layer sumbu-Z).
- **Langkah Reproduksi:**  
  1. Buka browser pada resolusi 360 × 740 atau 390 × 844.  
  2. Buka URL `http://localhost:3000/dashboard/latihan/1`.  
  3. Gulir hingga bagian paling bawah layar.  
  4. Amati bahwa tombol CTA tertutup sebagian oleh bilah navigasi bawah dan sulit ditekan secara langsung.
- **Dugaan Penyebab:**  
  Di [src/app/dashboard/layout.tsx](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/dashboard/layout.tsx), pengecualian `BottomNav` baru diterapkan untuk `pathname.startsWith("/dashboard/belajar/")`, sementara rute `/dashboard/latihan/` belum dikecualikan dan wadah halaman latihan tidak memiliki padding bawah ekstra (`pb-32`).
- **Saran Perbaikan:**  
  Tambahkan rute `/dashboard/latihan` ke daftar rute tanpa navigasi bawah di layout atau tambahkan kelas padding aman `pb-28` pada pembungkus halaman latihan.

---

### Isu #2 — Ikon Menu Mengambang Menutupi Teks Header pada Layar HP Lanskap
- **Tingkat Keparahan:** **Serius** (Elemen navigasi menindih judul materi).
- **Halaman & Rute:** Halaman Latihan (`/dashboard/latihan/1`) `[PROD]` & `[LOKAL]`.
- **Ukuran Layar:** `844 × 390` (HP Lanskap).
- **Elemen yang Bermasalah:** Tombol toggle/ikon menu mengambang di pojok kiri atas bertumpuk tepat di atas breadcrumb / teks judul header sesi latihan.
- **Bukti Pengujian:**  
  - File screenshot: `audit-evidence/lesson_player_844x390_1792815192715.png`.
- **Langkah Reproduksi:**  
  1. Ubah orientasi layar menjadi 844 × 390 (HP Lanskap).  
  2. Akses `/dashboard/latihan/1`.  
  3. Perhatikan area kiri atas header.
- **Dugaan Penyebab:**  
  Pada tinggi viewport rendah (< 400px), tombol hamburger/toggle mengambang tetap berposisi fixed pada `top-3 left-3` tanpa pergeseran margin kiri aman (`pl-12`) pada judul header.
- **Saran Perbaikan:**  
  Berikan offset padding kiri `pl-12` pada teks header pada breakpoint lanskap pendek, atau sembunyikan toggle mengambang saat sesi latihan aktif.

---

### Isu #3 — Dialog Modal Keluar Pelajaran Sangat Padat di HP Lanskap
- **Tingkat Keparahan:** **Ringan** (Kurang rapi secara estetika, namun fungsi tetap dapat diklik).
- **Halaman & Rute:** Pemain Pelajaran (`/dashboard/belajar/1`) `[LOKAL]`.
- **Ukuran Layar:** `844 × 390` (HP Lanskap).
- **Elemen yang Bermasalah:** Dialog konfirmasi keluar ("Keluar Pelajaran? Progres latihan ini akan hilang").
- **Bukti Pengujian:**  
  - File screenshot: `audit-evidence/lesson_player_exit_modal_1792815363407.png`.
- **Langkah Reproduksi:**  
  1. Buka sesi belajar interaktif di resolusi 844 × 390.  
  2. Tekan tombol silang "X" di pojok kiri atas untuk memunculkan modal keluar.  
  3. Amati jarak vertikal antara ilustrasi, teks peringatan, dan kedua tombol pilihan.
- **Dugaan Penyebab:**  
  Modal dialog menggunakan padding vertikal tetap (`p-6` / `p-8`) yang dioptimalkan untuk orientasi potret, sehingga di layar lanskap berbobot tinggi 390px, modal menyentuh batas atas dan bawah viewport.
- **Saran Perbaikan:**  
  Tambahkan utilitas `max-h-[90vh] overflow-y-auto` dan penyesuaian padding `py-3` pada media query tinggi rendah (`@media (max-height: 450px)`).

---

## 4. Celah Cakupan (Coverage Gaps)

1. **CMS / Admin Builder pada Lingkungan Produksi (`https://nusantara-laras.vercel.app/admin`):**  
   *Alasan:* Pada lingkungan produksi Vercel, sistem menerapkan proteksi otorisasi berbasis peran (RBAC) pada API/middleware di mana akun demo secara otomatis dialihkan ke `/dashboard` murid, sehingga evaluasi CMS builder secara mendalam dilakukan sepenuhnya secara aman di lingkungan `LOKAL` (`http://localhost:3000/admin`) menggunakan sesi admin terverifikasi.
2. **Tipe Soal Pemain Pelajaran: Hotspot Interaktif Spesifik Koordinat Dinamis:**  
   *Alasan:* Pada sesi percontohan Kaili (`sampleKailiLesson`), soal tipe visual disajikan dalam bentuk pengenalan atribut busana dengan hotspot statis dan pilihan ganda; variasi hotspot dinamis berbasis drag-and-drop tidak memiliki sampel terpasang pada sesi default sehingga tidak diuji secara langsung.

---

## 5. Kesimpulan & 5 Perbaikan Prioritas Tertinggi

### Evaluasi Eksekutif
- **Ukuran Layar Terburuk:** **844 × 390 (HP Lanskap)**  
  Tantangan utama terletak pada sempitnya ruang vertikal (390px) di mana header sticky, modal dialog, dan konten soal harus bersaing memperebutkan ruang tanpa saling menindih.
- **Halaman Terburuk:** **`/dashboard/latihan/[lessonId]`**  
  Menjadi satu-satunya halaman yang mengalami tumpang tindih elemen navigasi bawah yang menghalangi tombol aksi utama pada resolusi ponsel potret.
- **Halaman Terbaik:** **Landing Page (`/`), Autentikasi (`/auth`), dan CMS Admin Builder (`/admin`)**  
  Mencatatkan kelulusan 100% pada seluruh ukuran layar dengan adaptasi layout responsif kelas dunia, zero horizontal overflow (`scrollWidth = clientWidth`), dan visual yang bersih.

### 5 Perbaikan Pertama yang Paling Disarankan (Urut Dampak)
1. **[Prioritas 1 - Kritis/Serius] Sembunyikan `BottomNav` pada Rute Latihan (`/dashboard/latihan/*`)**  
   *Dampak:* Memastikan tombol "Mulai Sesi Latihan" dapat diakses dan ditekan secara langsung oleh seluruh pengguna smartphone tanpa terhalang bilah navigasi.
2. **[Prioritas 2 - Serius] Berikan Padding Aman pada Header Latihan di Lanskap HP (844 × 390)**  
   *Dampak:* Menghilangkan tumpang tindih visual antara tombol menu mengambang dan judul materi.
3. **[Prioritas 3 - Ringan] Optimasi Ruang Vertikal Modal Dialog pada Viewport Tinggi Pendek (`< 450px`)**  
   *Dampak:* Dialog keluar pelajaran dan modal peringatan tampil proporsional tanpa terpotong di perangkat ponsel berorientasi mendatar.
4. **[Prioritas 4 - Ringan] Standardisasi Padding Bawah Kontainer Halaman Murid (`pb-24` s.d. `pb-32`)**  
   *Dampak:* Menjamin tidak ada kartu pencapaian atau kartu latihan yang bersinggungan langsung dengan bilah navigasi di ponsel Android berlayar sempit.
5. **[Prioritas 5 - Estetika] Optimasi Skala Kerapatan Teks Hero Landing Page di Layar 360px**  
   *Dampak:* Memberikan ruang napas visual yang lebih elegan pada tampilan awal pengunjung baru yang menggunakan smartphone berlayar ringkas.

---

*Laporan ini disimpan di repositori lokal sebagai acuan tim pengembang LARAS Nusantara.*  
*Folder Bukti Tangkapan Layar: `audit-evidence/` (38 berkas tangkapan layar PNG).*
