# LAPORAN AUDIT PROGRES KESELURUHAN SISTEM LARAS

**Tanggal Audit:** 22 Oktober 2026  
**Auditor Teknis:** Auditor Independen AI (DeepMind Antigravity)  
**Tujuan Evaluasi:** Penilaian kesiapan teknis aplikasi LARAS (Munas IX PERMIKOMNAS) — Audit Baca & Uji Jalan Runtime (Strictly Read-Only, No Modifications).

---

## 1. Ringkasan Progres

| Area Sistem | Perkiraan % Jadi | Status | Bukti Terkuat (File:Baris / Hasil Uji) |
| :--- | :---: | :---: | :--- |
| **Game Engine** | **70%** | **SETENGAH** | Engine me-render 6 jenis soal (`CulturalGameEngine.tsx:388-849`), namun adapter menggugurkan multi-step skenario (`lessonAdapter.ts:149`), hotspot tanpa image URL (`lessonAdapter.ts:138`), dan callback `onComplete` tidak dipasang di rute dinamis (`belajar/[lessonId]/page.tsx:26-29`). |
| **Builder / CMS** | **65%** | **SETENGAH** | UI authoring interaktif berjalan lancar (`GameFlowBuilder.tsx:51-925`), live preview di phone frame berfungsi, namun data **hanya disimpan ke `localStorage`** (`sessionStore.ts:105`), tidak terhubung ke API/Supabase/file backend, dan tidak pernah dimuat ke roadmap murid. |
| **Auth & Gerbang Admin** | **95%** | **JADI** | Autentikasi file store (`serverAuth.ts:1-152`) berfungsi penuh. Uji runtime: `POST /api/auth/login` demo berhasil (`200 OK`), akses demo ke `/admin` tertolak (`307 Redirect` ke `/auth?redirect=%2Fadmin`), login admin berhasil dan membuka `/admin` (`200 OK`). Tombol logout UI tersedia di 3 lokasi (`DuolingoSidebar.tsx:36`, `profil/page.tsx:46`, `pengaturan/page.tsx:22`). |
| **Progres & Gamifikasi** | **60%** | **SETENGAH** | Hati, XP, streak, dan 1 badge ("Pionir Salam") terhitung rapi di lokal (`progress.ts:115-193`). Namun koneksi Supabase gagal total saat runtime (`TypeError: fetch failed` / status `500` pada `/api/progress`), dan badge bab 2 & 3 tidak memiliki kode unlock. |
| **Konten Budaya** | **85%** | **JADI** | 3 lesson di `lessons.ts` (15 butir soal) lengkap dengan prompt, kunci jawaban, dan penjelasan budaya (`why`). Data rujukan adat (`source`) lengkap. File rekaman audio fisik belum ada di storage, namun engine memiliki gracefully-handled fallback (tidak crash bila audio kosong/error). |
| **Halaman Dashboard** | **85%** | **JADI** | 12 rute dashboard terkompilasi dan dapat diakses. Halaman arcade, evaluasi, culture connection, dan paspor bukan pajangan mati melainkan komponen interaktif yang berfungsi dengan kalkulasi skor masing-masing. |
| **Build & Kompilasi** | **100%** | **JADI** | Perintah `npm run build` sukses 100% (Next.js 16.3.6 Turbopack, 23/23 static/dynamic routes terkompilasi bersih tanpa error TypeScript). |

---

## 2. Temuan per Bagian

### BAGIAN A — GAME ENGINE (Fokus Utama)

#### A1. GameFlowBuilder — Uji Realita Rantai Penuh
* **Status:** **SETENGAH (Klasifikasi: B — Authoring Lengkap tapi Hasil Tidak Terkonsumsi Player)**
* **Bukti Kode:**
  1. **Lokasi Penyimpanan:** Builder menyimpan paket sesi pelajaran ke `localStorage` browser di bawah key `"laras_game_sessions_v2"` melalui fungsi `saveSingleSession(activeSession)` (`src/app/admin/GameFlowBuilder.tsx:233`, merujuk ke `src/app/components/game-engine/sessionStore.ts:71,105`). Tidak ada pemanggilan API route (`fetch`), tidak ada penyimpanan ke Supabase, dan tidak ada penulisan ke file JSON/TS.
  2. **Titik Putus Sambungan Builder → Player:**
     - `src/app/dashboard/page.tsx:21-28`: Array `pathNodes` bersifat statis hardcoded 6 node yang hanya mengarah ke `/dashboard/latihan/1`, `/dashboard/latihan/2`, `/dashboard/latihan/3`, `/dashboard/paspor`, dan `/dashboard/culture-connection`. Tidak pernah membaca `getStoredSessions()`.
     - `src/app/dashboard/belajar/page.tsx:32-38`: Array `lessons` statis hardcoded 5 node yang hanya mengarah ke rute latihan konvensional.
     - `src/app/dashboard/belajar/[lessonId]/page.tsx:18-29`: Membaca `getStoredSessions()`, tetapi rute ini adalah **rute yatim (orphan route)** tanpa satu pun tautan masuk dari UI navigasi aplikasi.
     - Sambungan terputus fatal kedua: di `src/app/dashboard/belajar/[lessonId]/page.tsx:26-29`, komponen `CulturalGameEngine` dipanggil **tanpa menyertakan prop `onComplete`**. Akibatnya, saat pemain menuntaskan sesi builder, tidak ada pencatatan progres (`recordLessonSession` tidak dipanggil), XP tidak bertambah, dan roadmap tidak terbuka.

#### A2. Siklus Konten End-to-End (Uji Runtime)
* **Status:** **SETENGAH (Rantai Putus di Konsumsi Roadmap Murid)**
* **Hasil Uji Runtime Mandiri (via Browser Subagent & Script):**
  1. **Langkah 1 (Login Admin):** Akses `http://localhost:3000/auth` dengan akun `admin@laras.id` / `admin123`. Berhasil masuk (`200 OK`) dan diarahkan ke `/admin`.
  2. **Langkah 2 (Buat Lesson Uji):** Membuka tab *Penyusun Alur & Soal* (`GameFlowBuilder`). Menekan tombol `+ Sesi Baru`, membuat sesi baru `SES-CUSTOM-xxxx`. Mengubah judul menjadi `"Uji Audit Sesi Budaya"`. Menekan tombol `Simpan Alur Sesi`. Notifikasi toast muncul: *"Alur Game Berhasil Disimpan & Siap Dimainkan!"* (`GameFlowBuilder.tsx:268-271`).
  3. **Langkah 3 (Uji Live Preview):** Menekan `Uji Coba Game`. Modal simulasi ponsel terbuka. Memilih jawaban salah pada pertanyaan instrumen dan menekan `Periksa`. Feedback langsung muncul di drawer bawah: *"Kurang Tepat (-1 Nyawa)"* disertai lore kurator, dan hati berkurang dari 3 menjadi 2 (`CulturalGameEngine.tsx:887-900`).
  4. **Langkah 4 (Logout & Login Demo):** Logout admin, login menggunakan akun murid `demo@gmail.com` / `demo123`.
  5. **Langkah 5 (Cek Roadmap & Belajar):**
     - Membuka `/dashboard`: Lesson `"Uji Audit Sesi Budaya"` **TIDAK MUNCUL**. Yang tampil hanya 3 lesson bawaan (`Salam & Adab Tabe`, `Kenali Baju Nggembe`, `Skenario Souraja`).
     - Membuka `/dashboard/belajar`: Lesson baru **TIDAK MUNCUL**.
  6. **Titik Berhenti:** Siklus konten baru terhenti di `localStorage` admin lokal. Konten tidak dapat diakses oleh murid secara alami melalui UI navigasi roadmap.

#### A3. Enam Tipe Soal di CulturalGameEngine
* **Status:** **SETENGAH**
* **Bukti Pemetaan & Eksekusi:**
  1. **Choice (Pilihan Ganda):**
     - *types.ts:* Terdaftar sebagai `"multiple_choice"` (`types.ts:9`).
     - *Render:* Di-render di `CulturalGameEngine.tsx:535-570` (teks) atau `457-530` (visual).
     - *Penilaian:* Bekerja (`CulturalGameEngine.tsx:115-124`), mencocokkan `chosenOption.isCorrect`.
     - *Feedback:* Tampil di bottom drawer (hijau jika benar, merah jika salah, baris 854-902).
     - *Pemakaian:* Terpakai di Lesson 1 (`tabe-choice`).
  2. **True/False (Benar/Salah):**
     - *types.ts:* **Tidak terdaftar langsung sebagai `"truefalse"`**. Diubah oleh adapter menjadi `type: "multiple_choice"` dengan opsi `["Benar", "Salah"]` (`lessonAdapter.ts:66-87`).
     - *Render & Penilaian & Feedback:* Mengikuti alur multiple choice, berfungsi normal.
     - *Pemakaian:* Terpakai di Lesson 1 (`tabe-fact`), Lesson 2 (`nggembe-fact`), Lesson 3 (`souraja-fact`).
  3. **Match (Pasangan):**
     - *types.ts:* Terdaftar sebagai `"matching"` (`types.ts:6`).
     - *Render:* Di-render di `CulturalGameEngine.tsx:712-782` (dua kolom: istilah vs makna).
     - *Penilaian:* Bekerja interaktif (`CulturalGameEngine.tsx:166-182`). Mengklik kiri lalu kanan mencocokkan ID. Jika benar menjadi hijau (`bg-[#d7f7c2]`). *Catatan:* Jika salah klik, hati langsung berkurang seketika (-1 nyawa) tanpa menunggu tombol periksa.
     - *Feedback:* Tampil di bottom drawer saat seluruh pasangan lengkap (`CulturalGameEngine.tsx:99-111`).
     - *Pemakaian:* Terpakai di Lesson 1 (`tabe-match`), Lesson 2 (`nggembe-match`), Lesson 3 (`souraja-match`).
  4. **Order (Susun Urutan):**
     - *types.ts:* Terdaftar sebagai `"word_builder"` (`types.ts:5`).
     - *Render:* Di-render di `CulturalGameEngine.tsx:647-707` (area slot bertarget dan deretan kartu kata acak).
     - *Penilaian:* Bekerja (`CulturalGameEngine.tsx:83-96`), membandingkan `chosenWordTiles.join(" ")` dengan `targetSentence.join(" ")`.
     - *Feedback:* Tampil di bottom drawer.
     - *Pemakaian:* Terpakai di Lesson 1 (`tabe-order`), Lesson 2 (`nggembe-order`).
  5. **Hotspot (Titik Artefak Gambar):**
     - *types.ts:* Terdaftar sebagai `"hotspot"` (`types.ts:8`) dan `"visual"` (`types.ts:3`).
     - *Render:* Di-render di `CulturalGameEngine.tsx:457-530`. Menampilkan pin nomor posisi `top` & `left`.
     - *Penilaian:* Bekerja, namun terdapat keganjilan UX: **menekan pin hotspot di gambar tidak memilih jawaban**. Pemain wajib menekan tombol opsi teks di kolom sebelah kanan (`CulturalGameEngine.tsx:114, 507-528`).
     - *Kelemahan Konten:* Pada `lessonAdapter.ts:121-144`, field `imageUrl` tidak disetel (undefined), sehingga di engine muncul kotak bertuliskan `[Gambar Objek]`.
     - *Pemakaian:* Di builder dipakai pada preset Lalove & Souraja; di lesson bawaan terpakai pada Lesson 2 (`nggembe-hotspot`) dan Lesson 3 (`souraja-hotspot`).
  6. **Scenario (Simulasi Keputusan):**
     - *types.ts:* Terdaftar sebagai `"roleplay"` (`types.ts:7`).
     - *Render:* Di-render di `CulturalGameEngine.tsx:787-849` (avatar NPC tetua, dialog bubble adat, dan opsi tanggapan sopan).
     - *Penilaian & Feedback:* Bekerja menggunakan evaluasi multiple choice (`CulturalGameEngine.tsx:114-124`).
     - *Kelemahan:* `lessonAdapter.ts:149-157` **memotong skenario menjadi 1 langkah saja** (`data.steps?.[0]`), menggugurkan langkah 2 dan 3 yang ada di `lessons.ts`.
     - *Pemakaian:* Terpakai di Lesson 1 (`tabe-scenario`) dan Lesson 3 (`souraja-scenario`).

#### A4. lessonAdapter & Ketergantungan MockData
* **Status:** **SETENGAH**
* **Field yang Gugur / Tidak Terpetakan:**
  1. `scenario.steps`: Multi-langkah (3 langkah) dipotong paksa hanya menjadi langkah pertama `steps[0]` (`src/app/components/game-engine/lessonAdapter.ts:149-157`). Langkah 2 dan 3 serta `passingScore` gugur.
  2. `hotspot.coordinates`: Koordinat asli tidak ada di `lessons.ts`, sehingga adapter mengarang koordinat buatan modulo (`top: idx % 2 === 0 ? "25%" : "55%"`, baris 128-129).
  3. `hotspot.imageUrl`: Gugur/kosong (`lessonAdapter.ts:121-144`), menyebabkan visual objek berstatus fallback kosong.
  4. `lesson.badge`: Tidak diteruskan ke `GameSession` (`lessonAdapter.ts:195-206`).
  5. `question.xp`: Bobot XP per butir soal diabaikan oleh engine; engine hanya menggunakan total `lesson.rewardXp` di akhir sesi.
* **Jalur Player dan `mockData.ts`:**
  - `mockData.ts` diimpor di `src/app/dashboard/belajar/[lessonId]/page.tsx:6` sebagai inisialisasi state awal: `useState<GameSession>(sampleKailiLesson)` (baris 15).
  - Juga diimpor di `sessionStore.ts:2,69` sebagai bagian dari `DEFAULT_SESSIONS` untuk men-seed `localStorage`.
  - **Sifat:** Bukan sisa mati total, melainkan data fallback (default session) yang aktif terpanggil jika rute dinamis dibuka tanpa parameter yang cocok.

#### A5. sessionStore & Gamifikasi
* **Status:** **SETENGAH**
* **Aturan Main yang Benar-Benar Terimplementasi:**
  1. **Hati (Hearts):**
     - Berkurang 1 setiap menjawab salah (`CulturalGameEngine.tsx:123`, `latihan/[lessonId]/page.tsx:167`).
     - Habis (0 hati): Muncul layar Game Over *"Nyawa Kamu Habis!"* (`CulturalGameEngine.tsx:207-240`, `latihan/[lessonId]/page.tsx:235-238`).
     - Isi ulang: **Tidak ada sistem isi ulang berkala (timer/regen)**. Hati hanya terisi ulang penuh menjadi 3 saat pemain menekan tombol *"Coba Lagi"* untuk mengulang sesi dari awal.
  2. **XP (Experience Points):**
     - Pada `latihan/[lessonId]/page.tsx:102-113`: XP per soal (5 XP × jumlah benar) + Bonus XP lesson (Lesson 1: +20 XP, Lesson 2: +25 XP, Lesson 3: +30 XP).
     - Pada `culture-connection/page.tsx:88`: Memberikan +30 XP jika skor harmoni >= 5.
     - Sesi yang sudah pernah selesai (`alreadyCompleted`) tidak memberikan XP dobel (`progress.ts:179`).
  3. **Streak (Hari Beruntun):**
     - Berbasis tanggal kalender `YYYY-MM-DD` (`progress.ts:118-127, 153-163`).
     - Belajar di hari yang sama: streak tetap. Belajar persis di hari berikutnya (`yesterdayKey`): streak bertambah +1. Selang lebih dari 1 hari: streak reset kembali ke 1.
  4. **Badge:**
     - **Hanya ada 1 kondisi unlock yang aktif di kode:** Menyelesaikan Lesson 1 membuka badge `"Pionir Salam"` (`progress.ts:141, 186`).
     - Badge lain seperti `"Penjaga Busana"` dan `"Tamu Sopan"` terdaftar di `lessons.ts:76, 190, 272`, namun **tidak memiliki logika penambahan ke array `userProgress.badges`** di dalam `progress.ts`.
  5. **Persistensi & Konflik Data:**
     - Progres disimpan di `localStorage` (`laras.progress.{email}`) dan dikirim via `PUT /api/progress` ke Supabase (`progress.ts:76-88`).
     - **Temuan Uji Runtime:** Permintaan ke `/api/progress` menghasilkan error `500 { error: 'TypeError: fetch failed' }` karena backend gagal terhubung ke instance Supabase.
     - **Risiko Data:** `loadProgress()` dirancang mengutamakan remote data jika Supabase aktif (`progress.ts:98-108`). Jika di masa depan Supabase aktif dengan data kosong atau usang, data lokal pemain berisiko tertimpa data remote yang lebih rendah (tidak ada mekanisme merge/max XP).

---

## 3. Rantai Builder → Player

### Putusan A1 & Titik Putus
> **Putusan:** Arsitektur authoring GameFlowBuilder dan arsitektur konsumsi pemain berada pada **dua jalur terpisah yang belum tersambung (Disconnected Pipelines)**. GameFlowBuilder berfungsi baik sebagai alat perancang lokal (authoring tool) dengan fitur ekspor JSON dan preview ponsel, tetapi karyanya **tidak pernah mengalir ke dashboard murid**.

**Titik Putus Rantai (File & Baris):**
1. **Titik Putus 1 — Penyimpanan Terisolasi:** `src/app/admin/GameFlowBuilder.tsx:233` memanggil `saveSingleSession()`, yang di `src/app/components/game-engine/sessionStore.ts:105` hanya menulis ke `window.localStorage["laras_game_sessions_v2"]`. Tidak ada sinkronisasi ke server atau basis data pusat.
2. **Titik Putus 2 — Roadmap Statis:** `src/app/dashboard/page.tsx:21-28` mendefinisikan rute belajar menggunakan konstanta array statis `pathNodes` (`/dashboard/latihan/1`, `/2`, `/3`). Roadmap sama sekali tidak mengimpor atau membaca `sessionStore.ts`.
3. **Titik Putus 3 — Rute Belajar Murid Mengabaikan Engine:** Tombol mulai belajar di roadmap membuka `src/app/dashboard/latihan/[lessonId]/page.tsx`, yang menjalankan loop pertanyaan custom sederhana berbasis `lessons.ts`, bukan `CulturalGameEngine.tsx`.
4. **Titik Putus 4 — Putusnya Pencatatan Progres:** Pada rute yang memang memuat `CulturalGameEngine` (`src/app/dashboard/belajar/[lessonId]/page.tsx:26-30`), komponen dipanggil tanpa menyertakan handler `onComplete`. Sesi selesai tidak menghasilkan catatan progres ke `progress.ts`.

---

## 4. BAGIAN B — SISTEM DI LUAR ENGINE

### B1. Inventaris Semua Route / Halaman di `src/app/`

| No | Path Rute | Status | Bukti File:Baris & Keterangan |
| :---: | :--- | :---: | :--- |
| 1 | `/` (Landing Page) | **JADI** | `src/app/page.tsx:1-400` — Hero animasi Motion, floating badges, simulasi audio Tabe, bento grid fitur, CTA aktif ke `/auth` dan `/onboarding`. |
| 2 | `/auth` | **JADI** | `src/app/auth/page.tsx:1-368` — Form login/register lokal, validasi form, penanganan error, integrasi cookie sesi `laras_session`. |
| 3 | `/onboarding` | **JADI** | `src/app/onboarding/page.tsx:1-699` — Wizard 5 tahap interaktif (fokus minat, pemilihan etnis Kaili, target ritme harian, konfirmasi profil). |
| 4 | `/admin` | **SETENGAH** | `src/app/admin/page.tsx:1-1335` — Proteksi middleware bekerja; tab Ringkasan, Builder, dan Korpus interaktif; namun korpus baru hanya tersimpan di `localStorage` (`laras_cms_entries`, baris 133). |
| 5 | `/dashboard` (Roadmap) | **JADI** | `src/app/dashboard/page.tsx:1-135` — Roadmap 6 node, indikator status aktif/terkunci, bar XP harian, widget streak dan hearts reaktif. |
| 6 | `/dashboard/belajar` | **SETENGAH** | `src/app/dashboard/belajar/page.tsx:1-177` — Visualisasi jalur kurva SVG rapi dengan 5 node statis, mengarah ke latihan 1-3 dan paspor. |
| 7 | `/dashboard/belajar/[lessonId]` | **SETENGAH** | `src/app/dashboard/belajar/[lessonId]/page.tsx:1-32` — Membuka `CulturalGameEngine` dinamis, namun tidak memiliki tautan masuk di UI dan tidak mencatat progres (`onComplete` tidak ada). |
| 8 | `/dashboard/latihan` | **SETENGAH** | `src/app/dashboard/latihan/page.tsx:1-17` — Memuat lesson 1 lewat adapter ke `CulturalGameEngine`, namun tidak memiliki prop `onComplete` untuk penyimpanan progres. |
| 9 | `/dashboard/latihan/[lessonId]` | **JADI** | `src/app/dashboard/latihan/[lessonId]/page.tsx:1-240` — Runner latihan murid sesungguhnya; mendukung 5 soal, nyawa, repetisi soal salah, XP kalkulasi, dan penyimpanan progres. |
| 10 | `/dashboard/latihan/busana` | **JADI** | `src/app/dashboard/latihan/busana/page.tsx:1-15` — Rute redirect otomatis menuju `/dashboard/latihan/2`. |
| 11 | `/dashboard/arcade` | **JADI** | `src/app/dashboard/arcade/page.tsx:1-557` — **Fungsi Nyata**: Kuis kilat 6 soal berwaktu 15 detik, combo multiplier hingga 3.0x, sistem 3 nyawa, buka lore adat saat benar. *(Catatan: XP arcade tidak diakumulasikan ke XP profil global).* |
| 12 | `/dashboard/evaluasi` | **JADI** | `src/app/dashboard/evaluasi/page.tsx:1-390` — **Fungsi Nyata**: Menampilkan hasil evaluasi sesi terakhir dari `progress.lastLesson`, telaah diplomasi tutur, adab Kaili, dan pemutar audio Tabe. |
| 13 | `/dashboard/culture-connection` | **JADI** | `src/app/dashboard/culture-connection/page.tsx:1-565` — **Fungsi Nyata**: Skenario 3 keputusan bertamu di Souraja, meteran harmoni, menyimpan reward +30 XP ke `recordLessonResult` (`lessonId: 4`) dan membuka paspor. |
| 14 | `/dashboard/paspor` | **JADI** | `src/app/dashboard/paspor/page.tsx:1-139` — **Fungsi Nyata**: Membaca progres murid dari `loadProgress`, menampilkan level, total XP, quest selesai, dan status keterbukaan 4 lencana adat. |
| 15 | `/dashboard/profil` | **JADI** | `src/app/dashboard/profil/page.tsx:1-179` — Profil pembelajar dinamis, status XP, level, streak, rekap achievement, dan tombol logout. |
| 16 | `/dashboard/pengaturan` | **SETENGAH** | `src/app/dashboard/pengaturan/page.tsx:1-115` — Info akun dan tombol logout bekerja; namun sakelar target harian, push notif, dan autoplay hanya state lokal tanpa persistensi. |
| 17 | `/dashboard/selesai` | **JADI** | `src/app/dashboard/selesai/page.tsx:1-308` — Layar selebrasi kelulusan modul, kartu metrik XP, kalender ritme 7 hari, dan tombol audio pengucapan. |

### B2. Auth & Gerbang Admin
* **Hasil Pengujian Runtime:**
  1. **Login & Register:** Keduanya berfungsi penuh melalui endpoint `POST /api/auth/login` dan `POST /api/auth/register` (`src/app/auth/serverAuth.ts:108-129`).
  2. **Tombol Logout UI:** Ditemukan tombol nyata yang dapat diklik user pada antarmuka:
     - `src/app/components/DuolingoSidebar.tsx:36` (Sidebar kiri desktop)
     - `src/app/dashboard/profil/page.tsx:83-89` (Halaman profil)
     - `src/app/dashboard/pengaturan/page.tsx:100-106` (Halaman pengaturan)
  3. **Proteksi Gerbang Admin:** Akun demo biasa (`demo@gmail.com`) yang mengakses `/admin` **berhasil dicegat dan ditolak oleh middleware** dengan status HTTP `307 Redirect` menuju `/auth?redirect=%2Fadmin` (`src/middleware.ts:45-50`). Akun admin (`admin@laras.id`) dapat membuka `/admin` dengan status HTTP `200 OK`.
  4. **Akun Seed Otomatis:** Terbukti otomatis dibuat saat inisialisasi server (`src/app/auth/serverAuth.ts:80-106` melalui `ensureDemoUser()` dan `ensureAdminUser()`).

### B3. Label Roadmap di `dashboard/page.tsx`
* **Temuan Ketidaksesuaian Node:**
  1. **Duplikasi Judul Node 4 dan Node 5:**
     - Node 4: Judul `"Skenario Souraja"`, Subtitle `"Pelajaran 3 • Rumah adat"`, Href `"/dashboard/latihan/3"` (`src/app/dashboard/page.tsx:25`).
     - Node 5: Judul `"Skenario Souraja"`, Subtitle `"Culture Connection"`, Href `"/dashboard/culture-connection"` (`src/app/dashboard/page.tsx:26`).
     - *Masalah:* Node 5 memiliki judul yang identik dengan Node 4 padahal konten di `/dashboard/culture-connection` adalah simulasi terpadu upacara pernikahan adat Kaili.
  2. **Lonjakan Status Node 3 (Peti Budaya):**
     - Di `src/app/dashboard/page.tsx:33`, status Node 3 ditentukan oleh `progress.completedLessons.includes(2) ? "completed" : "locked"`. Node ini tidak pernah berada pada status `"active"` (langsung melompat dari terkunci ke selesai).
  3. **Tautan Duplikat Paspor:** Node 3 (*Peti Budaya*) dan Node 6 (*Lencana Tamu Sopan*) sama-sama mengarah ke URL yang sama (`/dashboard/paspor`).

### B4. Konten & SourceCard
1. **Kelengkapan Soal di `lessons.ts`:**
   - Seluruh 15 butir pertanyaan pada ketiga lesson (5 soal per lesson) memiliki prompt yang jelas, pilihan jawaban/pasangan/urutan lengkap, kunci jawaban valid, dan penjelasan budaya (`why`) yang mendalam (`src/lib/lessons.ts:81-368`).
2. **Penampilan SourceCard:**
   - Komponen `SourceCard` tampil nyata di layar intro pelajaran (`src/app/dashboard/latihan/[lessonId]/page.tsx:231`) dan di bagian bawah ringkasan kelulusan engine (`src/app/components/game-engine/CulturalGameEngine.tsx:295-326`).
3. **Pipeline Audio & Penanganan File Kosong:**
   - Di `CulturalGameEngine.tsx:62-76, 423`, pemutar audio hanya muncul jika properti `audioUrl` didefinisikan.
   - Di `latihan/[lessonId]/page.tsx:233`, pemutar dibungkus kondisi `currentQuestion.audioUrl`.
   - Kode dilengkapi penanganan error `audio.onerror` dan blok `try-catch`, sehingga ketiadaan file audio rekaman saat ini **tidak menimbulkan crash atau error blocking** pada jalannya kuis.

### B5. Build & Error Runtime
1. **Hasil Build Produksi (`npm run build`):**
   ```text
   > laras-nextjs@0.1.0 build
   > next build

   ▲ Next.js 16.3.6 (Turbopack)
   ✓ Compiled successfully in 10.0s
   ✓ Running TypeScript finished in 3.8s
   ✓ Generating static pages (23/23) in 1813ms
   Finalizing page optimization ...
   Exit code: 0
   ```
   *Catatan Peringatan Build:* Terdapat 1 deprecation warning: convention `middleware` dianjurkan migrasi ke `proxy` pada Next.js versi 16 (`src/middleware.ts`).
2. **Error Runtime Penting Selama Pengujian:**
   - `GET /api/progress` dan `PUT /api/progress` menghasilkan error `500 { error: 'TypeError: fetch failed' }` akibat kegagalan koneksi internal server ke host Supabase `upcczxjltqufyjmnzgeh.supabase.co`. Aplikasi secara aman mengalihkan persistensi ke fallback `localStorage`.

---

## 5. Daftar Fitur Setengah-Jadi

Diurutkan berdasarkan **Dampak ke Penilaian Juri** (Bobot: UI/UX 25%, Inovasi 20%, Kesesuaian Tema 20%, Kualitas Teknis 15%, Fungsionalitas 10%, Performa 10%) dikalikan **Perkiraan Usaha Menuntaskan**:

| Peringkat | Fitur / Komponen | Masalah Teknis Nyata | Dampak Penilaian Juri | Estimasi Usaha | Bukti File:Baris |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **1** | **Rantai Builder → Player (Penyambungan CMS ke Game Murid)** | Paket sesi buatan kurator tersimpan di `localStorage` admin dan tidak terkonsumsi di roadmap murid. Rute `belajar/[lessonId]` tidak memiliki `onComplete`. | **Sangat Tinggi** (Inovasi 20%, Fungsionalitas 10%, Teknis 15%) | **Sedang** | `GameFlowBuilder.tsx:233`, `belajar/[lessonId]/page.tsx:26` |
| **2** | **Koneksi Supabase Progres Murid** | Request ke `/api/progress` gagal (`500 TypeError: fetch failed`), sinkronisasi cloud mati; progres murid rentan hilang jika berganti browser. | **Tinggi** (Kualitas Teknis 15%, Fungsionalitas 10%) | **Kecil** | `src/app/api/progress/route.ts:20, 39` |
| **3** | **Sinkronisasi Korpus Budaya CMS Admin** | Penambahan entri budaya kurator di `/admin` hanya tersimpan di `localStorage` browser kurator (`laras_cms_entries`), tidak masuk database. | **Tinggi** (Inovasi 20%, Fungsionalitas 10%) | **Sedang** | `src/app/admin/page.tsx:135-180` |
| **4** | **Gambar Hotspot pada lessonAdapter** | Hotspot lesson bawaan tidak menyertakan gambar artefak (tampil `[Gambar Objek]`), dan koordinat di-generate secara modulo. | **Sedang** (UI/UX 25%, Kesesuaian Tema 20%) | **Kecil** | `lessonAdapter.ts:128-138` |
| **5** | **Duplikasi Label Roadmap Node 4 & 5** | Node 4 dan 5 sama-sama berjudul *"Skenario Souraja"* padahal Node 5 adalah tantangan pernikahan di Culture Connection Studio. | **Sedang** (UI/UX 25%, Kesesuaian Tema 20%) | **Sangat Kecil** | `src/app/dashboard/page.tsx:25-26` |
| **6** | **Pemotongan Multi-Step Skenario** | Skenario bertamu di Souraja pada `lessons.ts` memiliki 3 tahap keputusan, tetapi adapter hanya mengambil tahap ke-1. | **Sedang** (Kesesuaian Tema 20%, Fungsionalitas 10%) | **Sedang** | `lessonAdapter.ts:149-157` |
| **7** | **Logika Unlock Badge Otomatis** | Hanya badge *"Pionir Salam"* (Bab 1) yang memiliki kode unlock; badge Bab 2 & 3 tidak pernah tercatat di `userProgress.badges`. | **Sedang** (Gamifikasi & UX 25%) | **Kecil** | `progress.ts:141, 186` |
| **8** | **Integrasi XP Minigame Arcade** | Skor XP permainan di `/dashboard/arcade` tidak diakumulasikan ke saldo total XP profil pengguna. | **Rendah-Sedang** (Fungsionalitas 10%) | **Kecil** | `src/app/dashboard/arcade/page.tsx:174` |
| **9** | **Persistensi Toggle Pengaturan** | 3 sakelar preferensi di `/dashboard/pengaturan` kembali ke default saat berpindah halaman. | **Rendah** (UI/UX 25%) | **Sangat Kecil** | `src/app/dashboard/pengaturan/page.tsx:9-11` |

---

## 6. Putusan Akhir

### (a) Apa yang Realistis Dituntaskan HARI INI Sebelum Pengumpulan
Jika tim memiliki sisa waktu beberapa jam sebelum penutupan karya, berikut adalah perbaikan berdampak tinggi dengan risiko regresi terendah:
1. **Mengubah Judul Node 5 di Roadmap (`dashboard/page.tsx:26`):** Ubah dari `"Skenario Souraja"` menjadi `"Culture Connection: Upacara Adat"` agar juri tidak mengira ada tautan duplikat/salah label.
2. **Memasang `onComplete` di `dashboard/belajar/[lessonId]/page.tsx`:** Tambahkan fungsi penyimpan progres saat `CulturalGameEngine` tuntas agar rute engine dinamis ikut mencatat XP dan kelulusan pelajaran.
3. **Menambahkan Asset Gambar pada `lessonAdapter.ts`:** Masukkan URL gambar statis Baju Nggembe & Souraja ke mapping hotspot agar tidak menampilkan kotak kosong `[Gambar Objek]`.
4. **Menambahkan Kode Unlock Badge Bab 2 & Bab 3 di `progress.ts`:** Sisipkan pengecekan `result.lessonId === 2` (`"Penjaga Busana"`) dan `result.lessonId === 3` (`"Tamu Sopan"`).

### (b) Apa yang Harus Diakui Sebagai Demo / Placeholder Apa Adanya
1. **Perekaman Audio Penutur Asli Kaili:** Akui secara jujur bahwa aset rekaman suara penutur asli saat ini masih dalam tahap *proses kurasi dan digitalisasi lapangan bersama Balai Pelestarian Kebudayaan Wilayah XVIII*, sehingga UI audio player berfungsi sebagai pipeline demonstrasi kesiapan teknologi audio.
2. **GameFlowBuilder sebagai Modul Prototipe Kurator (CMS Standalone):** Jelaskan bahwa GameFlowBuilder didesain sebagai *authoring studio mandiri bagi dewan adat* yang dilengkapi fitur ekspor JSON (`.json`) dan live emulator preview, sementara integrasi sinkronisasi langsung ke murid dijadwalkan pada rilis versi multi-tenant berikutnya.
3. **Dukungan Budaya Luar Sulawesi Tengah:** Akui bahwa etnis Minangkabau dan Jawa Mataram pada halaman onboarding berstatus *Kajian Kurikulum (Coming Soon)* dengan fokus penuh lomba pada etnis Kaili (Sulawesi Tengah).

### (c) Risiko Terbesar Bila Karya Dikumpulkan dalam Kondisi Saat Ini
1. **Juri Mencoba Membuat Pelajaran di CMS lalu Membuka Akun Murid:** Jika juri bertindak sebagai kurator di `/admin`, membuat pelajaran baru, lalu berpindah ke akun murid dengan ekspektasi pelajaran tersebut muncul di roadmap, juri akan menganggap fitur builder *"pajangan tidak tersambung"*.
2. **Juri Menilai Konsistensi Data Lintas Perangkat:** Karena Supabase throwing error 500, jika juri menguji aplikasi di laptop A lalu login di laptop B, progres belajarnya tidak akan berpindah (tersisa di localStorage laptop A).
3. **Juri Memperhatikan Label Roadmap:** Dua node berturut-turut dengan teks persis sama (*"Skenario Souraja"*) akan langsung memicu kecurigaan bahwa halaman bab 3 belum selesai dikerjakan atau di-copy-paste secara terburu-buru.
