# Audit & Gap Analysis LARAS

Tanggal audit: 1 Oktober 2026  
Scope: `src/app`, `src/lib`, middleware, API auth, konfigurasi, aset, dan prototype Mobile/Web.

## 1. Executive Summary

1. Production build berhasil, tetapi lint gagal dengan 6 error dan 27 warning.
2. LARAS saat ini lebih dekat ke prototype UI interaktif daripada learning game dengan persistence nyata.
3. Arcade adalah fitur paling fungsional: quiz, timer, lives, combo, score, dan game-over berjalan lokal.
4. Lesson utama belum memiliki source of truth untuk jawaban, XP, progress, streak, badge, atau unlock.
5. Auth API tersedia, tetapi memakai file JSON lokal, SHA-256 tanpa salt, dan tidak cocok untuk deployment serverless.
6. Fallback auth berbasis `localStorage` tidak dikenali middleware karena middleware hanya membaca cookie.
7. `/admin` tidak dilindungi autentikasi maupun role authorization.
8. Banyak gambar memakai hotlink eksternal dan tidak ada file audio nyata.
9. Culture Connection terlihat interaktif, tetapi tahap dan skor sudah ditentukan sejak awal.
10. Fokus deadline harus pada satu demo flow yang stabil, bukan pembangunan backend besar.

## 2. Feature Audit

| Fitur | Lokasi | Status | Kondisi |
|---|---|---|---|
| Landing page | `src/app/page.tsx` | 🟡 PARTIAL | UI lengkap; audio hanya simulasi state. |
| Onboarding 5 langkah | `src/app/onboarding/page.tsx` | 🟡 PARTIAL | Interest/pace hanya state lokal. |
| Login/register | `src/app/auth/page.tsx` | 🟡 PARTIAL | API tersedia; fallback dan Google login bermasalah. |
| Session | `src/app/api/auth/session/route.ts` | 🟡 PARTIAL | Cookie bekerja lokal; persistence production tidak aman. |
| Middleware dashboard | `src/middleware.ts` | 🟡 PARTIAL | Hanya melindungi `/dashboard`, bukan `/admin`. |
| Dashboard learning path | `src/app/dashboard/page.tsx` | 🟠 DUMMY | Node, XP, streak, hearts, dan progress hard-coded. |
| Learning path | `src/app/dashboard/belajar/page.tsx` | 🟡 PARTIAL | Lesson locked masih memiliki link aktif. |
| Lesson bahasa | `src/app/dashboard/latihan/page.tsx` | 🟡 PARTIAL | Pilihan dapat diklik, tetapi feedback benar selalu tampil. |
| Lesson busana | `src/app/dashboard/latihan/busana/page.tsx` | 🟡 PARTIAL | Hotspot lokal; tidak ada validasi hasil. |
| Evaluasi | `src/app/dashboard/evaluasi/page.tsx` | 🟠 DUMMY | Hasil, jawaban, lives, XP, dan feedback statis. |
| Halaman selesai | `src/app/dashboard/selesai/page.tsx` | 🟠 DUMMY | Tidak menerima hasil lesson. |
| Culture Connection | `src/app/dashboard/culture-connection/page.tsx` | 🟠 DUMMY | Tidak ada keputusan nyata; skor selalu sempurna. |
| Arcade | `src/app/dashboard/arcade/page.tsx` | 🟡 PARTIAL | Gameplay lokal berjalan; high score hilang saat refresh. |
| XP/level/streak/hearts | Dashboard dan TopBar | 🟠 DUMMY | Tidak dihitung atau disimpan lintas halaman. |
| Achievement | `src/app/dashboard/paspor/page.tsx` | 🟠 DUMMY | Badge berasal dari array statis. |
| Passport | `src/app/dashboard/paspor/page.tsx` | 🟠 DUMMY | Tidak ada unlock/reward persistence. |
| Profile | `src/app/dashboard/profil/page.tsx` | 🟠 DUMMY | Selalu menampilkan Rani Maharani dan angka fixture. |
| Settings | `src/app/dashboard/pengaturan/page.tsx` | 🟡 PARTIAL | Toggle lokal; tidak disimpan atau diterapkan. |
| Admin CMS | `src/app/admin/page.tsx` | 🟡 PARTIAL | Filter/add/update lokal; tidak ada backend/protection. |
| Supabase | `src/lib/supabase/` | ⚪ MISSING | Helper ada, tetapi belum dipakai sebagai jalur data utama. |
| Audio | Seluruh app | 🟠 DUMMY | Tidak ditemukan audio file, `<audio>`, atau `new Audio()`. |
| Database/persistence | Seluruh app | ⚪ MISSING | Progress dan konten tidak menggunakan database. |

## 3. Critical Problems

### P0: Harus diperbaiki sebelum demo

- **Auth fallback tidak kompatibel dengan middleware.** `authClient.ts` menyimpan sesi ke `localStorage`, sementara `middleware.ts` hanya membaca cookie `laras_session`. Login dapat terlihat berhasil lalu diarahkan kembali ke `/auth`.
- **Google login bukan OAuth.** Tombol hanya melakukan `router.push('/dashboard')` tanpa session.
- **`/admin` terbuka.** Matcher middleware hanya `/dashboard/:path*`.
- **Credential dan session token ada di repository.** `laras_auth_store.json` berisi password hash dan session ID.
- **File-based auth tidak cocok untuk Vercel/serverless.** `serverAuth.ts` menulis ke filesystem lokal.
- **Password hashing lemah.** Password memakai SHA-256 langsung tanpa salt/KDF.
- **Lesson tidak menghitung jawaban.** Pada `latihan/page.tsx`, pilihan hanya menentukan route.
- **Evaluasi dapat dibuka langsung dan selalu selesai.** Hasil tidak berasal dari jawaban lesson.

### P1: Sangat disarankan

- XP, streak, hearts, level, progress, badge, dan unlock tidak tersimpan.
- Dashboard, profile, passport, dan halaman selesai menampilkan angka berbeda.
- Culture Connection bukan decision game; semua tahap langsung berstatus selesai.
- Audio button hanya mengubah ikon dan teks.
- Tombol lupa password tidak memiliki handler.
- Lesson locked masih dapat diakses melalui link.
- `toggleAudio` evaluasi mengembalikan state yang salah.
- Progress width dinamis di profile tidak aman untuk Tailwind build.

## 4. Dummy / Hard-coded Features

| Data | Lokasi | Dampak | Perlu sebelum demo? |
|---|---|---|---|
| Nama `Rani Maharani` | `src/app/dashboard/profil/page.tsx` | Profile tidak mewakili user login. | Ya |
| XP `480` | TopBar/profile/dashboard | XP tidak berubah setelah lesson. | Ya |
| Streak `5/6/7 hari` | Dashboard/evaluasi/selesai | Data antar halaman tidak konsisten. | Ya |
| Level `3` | Profile/passport | Tidak ada perhitungan level. | Ya |
| Status path | `src/app/dashboard/page.tsx` | Unlock tidak berdasarkan progress. | Ya |
| Feedback “Tepat Sekali” | `src/app/dashboard/latihan/page.tsx` | Jawaban salah tetap terlihat benar. | Ya |
| Hasil evaluasi dan `+20 XP` | `src/app/dashboard/evaluasi/page.tsx` | Tidak berasal dari jawaban user. | Ya |
| Skor Culture Connection `10/10` | `src/app/dashboard/culture-connection/page.tsx` | Tidak ada consequence/scoring. | Ya |
| Achievement | `src/app/dashboard/paspor/page.tsx` | Badge selalu terlihat unlocked. | Ya |
| Admin entries | `src/app/admin/page.tsx` | CMS hilang setelah refresh. | Tidak untuk demo publik |
| Audio native | Lesson/Culture Connection | Tombol tidak memutar audio. | Tidak, labeli sebagai preview |
| Gambar eksternal | Banyak page | Demo rentan gagal jika hotlink mati. | Aset utama ya |

Dummy yang masih acceptable untuk demo: satu user demo, daftar konten awal, dan question bank kecil, selama labelnya jelas dan gameplay inti benar-benar menghitung hasil.

## 5. Gameplay Loop

**Status: PARTIAL, mendekati BROKEN untuk lesson utama.**

Alur yang tersedia:

`Landing -> Onboarding -> Dashboard -> Lesson -> Answer -> Evaluasi -> Selesai`

Yang berjalan:

- User dapat berpindah antar halaman.
- User dapat memilih opsi.
- Arcade memiliki loop game lokal yang nyata.
- Animasi, feedback visual, dan navigasi dasar tersedia.

Yang belum berjalan:

- Jawaban tidak dipersist.
- Score tidak dihitung dari jawaban.
- XP, progress, streak, dan achievement tidak berubah.
- Passport tidak menerima reward nyata.
- Refresh menghapus state gameplay.
- Lesson berikutnya tidak benar-benar terbuka berdasarkan penyelesaian.

**Bottleneck:** belum ada satu objek progress/session lesson sebagai sumber kebenaran bersama.

## 6. Audit Culture Connection

Fitur ini masih lebih menyerupai presentation page daripada game.

Bukti:

- Tiga tahap langsung ditandai “Selesai”.
- Skor `10/10` dan harmoni `100%` sudah ditentukan.
- Tombol klaim hanya menunggu timeout lalu redirect ke passport.
- Tidak ada pilihan user, jawaban, consequence, atau skor dinamis.

Perbaikan realistis:

1. Tambahkan tiga pilihan keputusan sederhana.
2. Simpan pilihan dalam state satu sesi.
3. Berikan skor berbeda, misalnya `0`, `5`, atau `10`.
4. Tampilkan consequence pendek untuk setiap pilihan.
5. Tampilkan reward hanya setelah seluruh tahap selesai.
6. Gunakan hasil tersebut untuk halaman selesai/passport selama sesi demo.

Tidak perlu AI, branching narrative kompleks, multiplayer, atau backend scenario engine.

## 7. UX/UI Improvements

- Feedback jawaban muncul setelah tombol “Periksa jawaban”, bukan selalu tampil.
- Bedakan CTA “Periksa”, “Lanjut”, dan “Selesai”.
- Locked lesson harus disabled atau menjelaskan cara unlock.
- Reward harus muncul sebagai momen terpisah setelah keberhasilan.
- Dashboard harus menampilkan hasil terbaru dari session demo.
- Mobile navigation perlu menyediakan akses ke lesson aktif atau Culture Connection.
- Tambahkan loading/error state untuk gambar eksternal.
- Jangan menampilkan klaim “terverifikasi” tanpa bukti/backend.
- Ganti `alert` auth dengan inline error.
- Uji overflow teks panjang pada evaluasi dan Culture Connection.

## 8. Technical / Architecture Issues

- `npm run build`: **berhasil**.
- `npm run lint`: **gagal**, 6 error dan 27 warning.
- Error lint utama berasal dari penggunaan `any` pada auth route dan `authClient`.
- Arcade memiliki warning `useEffect` dengan dependency yang hilang.
- Middleware convention Next.js 16 terdeteksi deprecated dan disarankan migrasi ke proxy.
- Supabase helper memakai non-null assertion env tanpa runtime validation.
- Tidak ada script test atau typecheck terpisah.
- Tidak ada backend progress API atau role model admin.
- Tidak ada rate limiting login.
- Cookie auth tidak menetapkan konfigurasi production eksplisit seperti `secure` dan `maxAge`.
- Hotlink gambar eksternal berisiko pada reliability, privasi, dan performance.
- Prototype HTML memakai Tailwind CDN, Google Fonts, Material Symbols, dan `href="#"`; prototype bukan implementation production.
- `Sidebar.tsx` tampak legacy/unused karena layout menggunakan `DuolingoSidebar`.

## 9. Missing Features

### Penting untuk demo

- Progress lesson minimal dalam satu sesi.
- Validasi jawaban benar/salah.
- XP reward dari hasil.
- Unlock lesson berikutnya.
- Reward passport setelah lesson/scenario.
- Auth demo flow yang konsisten.
- Proteksi `/admin`, atau jangan tampilkan admin.
- Error state gambar dan auth.
- Satu sumber data demo untuk XP, streak, dan profile.

### Tunda

- Realtime leaderboard.
- AI tutor.
- Multiplayer.
- Full CMS backend.
- Semua wilayah Nusantara.
- Sistem achievement kompleks.
- Audio recording pipeline.
- Analytics dashboard.
- Migrasi penuh ke arsitektur production-grade.

## 10. Priority Matrix

| Priority | Problem | Impact | Effort | Recommendation |
|---|---|---:|---:|---|
| P0 | Auth redirect/fallback | Sangat tinggi | Rendah | Gunakan satu jalur login cookie untuk demo. |
| P0 | `/admin` terbuka | Tinggi | Rendah | Tambahkan guard atau keluarkan admin dari demo. |
| P0 | Lesson tidak menghitung jawaban | Sangat tinggi | Sedang | Buat satu lesson flow dengan score nyata. |
| P0 | Progress tidak berubah | Sangat tinggi | Sedang | Pakai session/localStorage terstruktur untuk demo. |
| P0 | Culture Connection statis | Tinggi | Sedang | Tambahkan tiga keputusan dan consequence. |
| P1 | Passport selalu penuh | Tinggi | Rendah | Tampilkan badge setelah reward diklaim. |
| P1 | Profile hard-coded | Sedang | Rendah | Baca user dan stats dari session. |
| P1 | Audio palsu | Sedang | Rendah | Labeli sebagai preview atau hilangkan klaim. |
| P1 | Lint gagal | Sedang | Rendah | Perbaiki enam error sebelum final build. |
| P2 | Hotlink image | Sedang | Sedang | Simpan aset utama lokal atau beri fallback. |
| P2 | Responsive polish | Sedang | Sedang | Uji mobile flow dan overflow. |
| P3 | Backend CMS penuh | Rendah | Tinggi | Tunda. |

## 11. Pembagian Tim

### Person 1 — Core / Game Logic

**Task:** satukan login cookie API, buat state lesson, hitung score/XP, simpan progress demo, tampilkan progress di dashboard/profile/passport, dan buka lesson berikutnya.

**File:** `auth/page.tsx`, `auth/authClient.ts`, `dashboard/latihan/page.tsx`, `dashboard/evaluasi/page.tsx`, `dashboard/page.tsx`.

**Definition of Done:** user dapat login, menjawab lesson, memperoleh XP, melihat hasil, refresh, dan melihat progress yang sama.

### Person 2 — Content / Culture Gameplay

**Task:** ubah Culture Connection menjadi tiga keputusan, tambahkan consequence, rapikan terminologi, dan tandai klaim budaya yang perlu verifikasi.

**File:** `dashboard/culture-connection/page.tsx`, `dashboard/latihan/busana/page.tsx`, `dashboard/selesai/page.tsx`, `admin/page.tsx`.

**Definition of Done:** user membuat keputusan, melihat consequence, menerima skor sesuai pilihan, dan memperoleh reward setelah skenario selesai.

### Person 3 — UI / Polish / QA

**Task:** perbaiki lint errors, uji mobile/desktop, perbaiki locked CTA, error state, overflow, fallback gambar, proteksi/sembunyikan admin, dan siapkan regression checklist.

**File:** `components/BottomNav.tsx`, `components/DuolingoSidebar.tsx`, `dashboard/profil/page.tsx`, `middleware.ts`, auth API routes.

**Definition of Done:** lint tidak memiliki error, build berhasil, dan demo flow selesai di desktop serta mobile.

## 12. Do Not Touch

- Jangan rewrite seluruh project.
- Jangan migrasi penuh ke Supabase malam ini kecuali auth menghalangi demo.
- Jangan membangun realtime leaderboard, AI tutor, multiplayer, atau CMS backend penuh.
- Jangan membuat seluruh konten Nusantara.
- Jangan mengganti design system secara global.
- Jangan mengutak-atik Arcade selain perbaikan timer yang diperlukan.
- Jangan mengejar production readiness prototype HTML.
- Jangan menambah fitur di luar demo flow.

## 13. Demo Flow Teraman

1. `/` — tampilkan landing dan identitas LARAS.
2. `/auth` — gunakan akun demo dengan cookie yang sudah diuji.
3. `/onboarding` — lanjutkan dengan pilihan default.
4. `/dashboard` — tampilkan learning path.
5. `/dashboard/latihan` — jawab satu pertanyaan.
6. `/dashboard/evaluasi` — tampilkan feedback berdasarkan jawaban.
7. `/dashboard/selesai` — tampilkan XP dan progress.
8. `/dashboard/culture-connection` — mainkan tiga keputusan.
9. `/dashboard/paspor` — tampilkan badge baru.
10. `/dashboard/arcade` — gunakan sebagai bonus penutup.

Jangan menampilkan `/admin` sampai route tersebut dilindungi. Jangan menjadikan audio sebagai fitur utama. Jangan mengklaim persistence database atau verifikasi lembaga yang belum didukung implementation.

## 14. Final Demo Checklist

- [ ] Login berhasil tanpa redirect loop.
- [ ] Cookie session tersedia.
- [ ] `/dashboard` tidak dapat dibuka tanpa login.
- [ ] `/admin` protected atau tidak ditampilkan.
- [ ] Satu lesson dapat diselesaikan end-to-end.
- [ ] Jawaban benar dan salah menghasilkan feedback berbeda.
- [ ] XP berubah setelah lesson.
- [ ] Progress berubah di dashboard.
- [ ] Passport hanya membuka badge setelah reward.
- [ ] Culture Connection menerima input user.
- [ ] Skor Culture Connection tidak selalu `10/10`.
- [ ] Refresh tidak menghapus progress demo.
- [ ] Tidak ada CTA utama yang dead-end.
- [ ] Gambar utama tampil atau memiliki fallback.
- [ ] Mobile flow tidak overflow.
- [ ] `npm run build` berhasil.
- [ ] `npm run lint` tidak memiliki error.
- [ ] Tidak ada session token baru yang ikut dikomit.
- [ ] Klaim budaya yang belum diverifikasi sudah diberi label atau dihapus.

## 15. Top 10 Things To Fix First

1. Perbaiki login cookie dan hilangkan auth fallback yang menipu.
2. Lindungi `/admin` atau keluarkan dari demo.
3. Buat satu lesson benar-benar menghitung jawaban.
4. Buat feedback benar/salah berdasarkan input.
5. Simpan XP, progress, dan reward dalam satu session demo.
6. Hubungkan hasil lesson ke halaman selesai dan passport.
7. Ubah Culture Connection menjadi decision flow nyata.
8. Sinkronkan nama user dan statistik profile dengan session.
9. Perbaiki 6 lint errors.
10. Uji demo flow desktop/mobile dengan aset yang tersedia.

## Kesimpulan

Untuk deadline besok malam, tim sebaiknya fokus pada **auth flow yang konsisten, satu gameplay lesson end-to-end, persistence progress/XP minimal, dan Culture Connection yang menerima keputusan user**.

Jangan mengerjakan **AI, multiplayer, realtime leaderboard, CMS backend penuh, migrasi arsitektur besar, atau ekspansi seluruh budaya Nusantara**.
