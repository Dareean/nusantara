# Audit & Gap Analysis LARAS

Tanggal audit: 1 Oktober 2026  
Scope: `src/app`, `src/lib`, middleware, API auth, konfigurasi, aset, dan prototype Mobile/Web.

## 1. Executive Summary

1. Production build berhasil dan lint tidak memiliki error; warning tersisa terutama terkait `<img>`, middleware, dan timer Arcade.
2. Auth demo memakai session cookie custom; progress sudah memiliki API Supabase dengan fallback cache lokal.
3. Learning path, XP, streak, badge, hearts, lesson ID, dan unlock sudah memiliki fondasi state bersama.
4. Lesson bahasa sudah berubah menjadi interactive cultural mission, tetapi belum menjadi lesson session multi-exercise penuh.
5. Lesson busana sudah memakai eksplorasi hotspot dan keputusan kontekstual.
6. Culture Connection sudah memiliki tiga keputusan aktif dan reward yang terkunci sampai skenario selesai.
7. Arcade tetap menjadi mode challenge cepat dengan timer, lives, combo, dan lore.
8. Supabase sudah terhubung di level kode, tetapi migration `supabase/schema.sql` harus dijalankan agar persistence remote aktif.
9. Auth utama masih custom file-based, bukan Supabase Auth, sehingga belum production-ready untuk Vercel.
10. Prioritas berikutnya adalah mengubah setiap node lesson menjadi beberapa exercise dengan hearts per sesi.

## 2. Feature Audit

| Fitur | Lokasi | Status | Kondisi |
|---|---|---|---|
| Landing page | `src/app/page.tsx` | 🟡 PARTIAL | UI lengkap; audio hanya simulasi state. |
| Onboarding 5 langkah | `src/app/onboarding/page.tsx` | 🟡 PARTIAL | Interest/pace hanya state lokal. |
| Login/register | `src/app/auth/page.tsx` | 🟡 PARTIAL | API tersedia; fallback dan Google login bermasalah. |
| Session | `src/app/api/auth/session/route.ts` | 🟡 PARTIAL | Cookie bekerja lokal; persistence production tidak aman. |
| Middleware dashboard | `src/middleware.ts` | 🟡 PARTIAL | Hanya melindungi `/dashboard`, bukan `/admin`. |
| Dashboard learning path | `src/app/dashboard/page.tsx` | 🟡 PARTIAL | Node, XP, streak, hearts, dan unlock membaca progress store; beberapa copy quest masih fixture. |
| Learning path | `src/app/dashboard/belajar/page.tsx` | 🟡 PARTIAL | Locked node sudah nonaktif; lesson masih perlu session multi-exercise. |
| Lesson bahasa | `src/app/dashboard/latihan/page.tsx` | 🟡 PARTIAL | Sudah menjadi misi 3 tahap dengan aksi, reaksi, reputasi, dan reward; belum multi-exercise 5-8 item dengan hearts per item. |
| Lesson busana | `src/app/dashboard/latihan/busana/page.tsx` | 🟡 PARTIAL | Hotspot dan keputusan busana sudah interaktif; masih satu keputusan utama, belum rangkaian exercise. |
| Evaluasi | `src/app/dashboard/evaluasi/page.tsx` | 🟡 PARTIAL | Membaca hasil lesson aktual; masih berupa halaman debrief dengan beberapa copy evaluasi lama. |
| Halaman selesai | `src/app/dashboard/selesai/page.tsx` | 🟡 PARTIAL | Membaca XP/streak/progress hasil terakhir, tetapi copy ringkasan masih sebagian statis. |
| Culture Connection | `src/app/dashboard/culture-connection/page.tsx` | 🟡 PARTIAL | Tiga keputusan aktif, harmony score, dan reward gating sudah ada; beberapa panel lore masih statis. |
| Arcade | `src/app/dashboard/arcade/page.tsx` | 🟡 PARTIAL | Challenge cepat dengan timer, lives, combo, dan lore; high score belum tersimpan ke progress utama. |
| XP/level/streak/hearts | Dashboard dan TopBar | 🟡 PARTIAL | XP/streak/hearts tersimpan melalui progress store; hearts belum dikelola per exercise dalam satu lesson session. |
| Achievement | `src/app/dashboard/paspor/page.tsx` | 🟡 PARTIAL | Badge membaca progress store, tetapi katalog badge masih array statis. |
| Passport | `src/app/dashboard/paspor/page.tsx` | 🟡 PARTIAL | Reward lesson tersimpan di progress store; katalog dan cap masih fixture. |
| Profile | `src/app/dashboard/profil/page.tsx` | 🟡 PARTIAL | Nama dan statistik membaca session/progress; beberapa track masih fixture. |
| Settings | `src/app/dashboard/pengaturan/page.tsx` | 🟡 PARTIAL | Toggle lokal; tidak disimpan atau diterapkan. |
| Admin CMS | `src/app/admin/page.tsx` | 🟡 PARTIAL | Filter/add/update lokal; tidak ada backend/protection. |
| Supabase | `src/lib/supabase/`, `src/app/api/progress/route.ts` | 🟡 PARTIAL | Progress API sudah memakai Supabase; auth dan konten belum. |
| Audio | Seluruh app | 🟠 DUMMY | Tidak ditemukan audio file, `<audio>`, atau `new Audio()`. |
| Database/persistence | `src/app/api/progress/route.ts`, `supabase/schema.sql` | 🟡 PARTIAL | API Supabase dan tabel progress sudah disiapkan; migration belum dapat dianggap aktif sebelum dijalankan di dashboard Supabase. |

## 3. Critical Problems

### P0: Harus diperbaiki sebelum demo

- **Google login bukan OAuth.** Tombol sekarang memberi pesan bahwa OAuth belum tersedia; belum ada provider/callback.
- **`/admin` terbuka.** Matcher middleware hanya `/dashboard/:path*`.
- **Credential dan session token ada di repository.** `laras_auth_store.json` berisi password hash dan session ID.
- **File-based auth tidak cocok untuk Vercel/serverless.** `serverAuth.ts` menulis ke filesystem lokal.
- **Password hashing lemah.** Password memakai SHA-256 langsung tanpa salt/KDF.
- **Satu node belum menjadi lesson session multi-exercise.** Lesson bahasa sudah memiliki tiga tahap misi, tetapi belum beberapa tipe exercise dalam satu materi.
- **Hearts belum dipotong per jawaban salah.** Hearts belum dikelola di level exercise dalam satu sesi.
- **Evaluasi masih memiliki sisa framing quiz.** Halaman sudah membaca hasil aktual, tetapi beberapa label dan panel masih bernuansa kunci jawaban.

### P1: Sangat disarankan

- XP, streak, level, progress, badge, dan unlock sudah tersimpan melalui progress store; hearts belum memiliki lifecycle per exercise.
- Dashboard, profile, passport, dan halaman selesai sudah membaca progress bersama, tetapi beberapa copy/quest masih fixture.
- Culture Connection sudah menjadi decision game, tetapi beberapa panel lore masih statis.
- Audio button hanya mengubah ikon dan teks.
- Tombol lupa password tidak memiliki handler.
- Lesson locked masih dapat diakses melalui link.
- `toggleAudio` evaluasi mengembalikan state yang salah.
- Progress width dinamis di profile tidak aman untuk Tailwind build.

## 4. Dummy / Hard-coded Features

| Data | Lokasi | Dampak | Perlu sebelum demo? |
|---|---|---|---|
| Copy quest, materi, dan label profile | Dashboard/profile/selesai | Beberapa teks masih fixture meski metrik utama sudah dinamis. | P1 |
| Katalog achievement | `src/app/dashboard/paspor/page.tsx` | Daftar badge masih array statis; status unlock sudah membaca progress. | P1 |
| Panel lore Culture Connection | `src/app/dashboard/culture-connection/page.tsx` | Sebagian informasi masih ditampilkan sebagai presentasi statis. | P1 |
| Hearts `3/3` | Lesson bahasa/busana | Belum mewakili hearts per exercise session. | P0 |
| Admin entries | `src/app/admin/page.tsx` | CMS hilang setelah refresh. | Tidak untuk demo publik |
| Audio native | Lesson/Culture Connection | Tombol tidak memutar audio. | Tidak, labeli sebagai preview |
| Gambar eksternal | Banyak page | Demo rentan gagal jika hotlink mati. | Aset utama ya |

Dummy yang masih acceptable untuk demo: satu user demo, daftar konten awal, dan question bank kecil, selama labelnya jelas dan gameplay inti benar-benar menghitung hasil. Satu node yang hanya berisi satu keputusan tanpa rangkaian exercise belum sesuai konsep learning path.

## 5. Gameplay Loop

**Status: PARTIAL, fondasi berjalan tetapi belum menjadi lesson multi-exercise.**

Alur yang tersedia:

`Landing -> Onboarding -> Dashboard -> Lesson -> Answer -> Evaluasi -> Selesai`

Yang berjalan:

- User dapat berpindah antar halaman.
- User dapat memilih aksi kontekstual.
- Lesson bahasa memiliki tiga tahap misi.
- Lesson busana memiliki hotspot dan pilihan konteks.
- Culture Connection memiliki tiga keputusan aktif.
- Arcade memiliki timer, lives, combo, score, game-over, victory, dan lore.
- Animasi, feedback visual, dan navigasi dasar tersedia.

Yang belum berjalan:

- Satu node belum berisi beberapa exercise dengan tipe bervariasi.
- Hearts belum berkurang langsung saat exercise salah.
- XP belum diakumulasi per exercise yang benar.
- Evaluasi masih menjadi halaman debrief dengan sebagian copy statis.
- Progress remote baru aktif setelah migration Supabase dijalankan.
- High score Arcade belum masuk ke progress utama.

**Bottleneck:** belum ada `LessonSession` yang mengelola daftar exercise, index aktif, hearts, jawaban, feedback, XP per exercise, dan status selesai.

### Target gameplay yang benar

```text
Learning Path Node
-> Lesson Session
-> Exercise 1..N
-> Feedback per exercise
-> Heart berkurang jika salah
-> Game over jika hearts habis
-> Reward lesson jika semua exercise selesai
-> Unlock node berikutnya
```

## 6. Audit Culture Connection

Fitur ini sudah bergerak menjadi decision game, tetapi masih membutuhkan penyederhanaan agar semua keputusan terasa sebagai satu sesi permainan.

Bukti:

- Tiga keputusan sudah dapat dipilih user.
- Harmony score dihitung dari keputusan.
- Reward dikunci sampai tiga keputusan selesai.
- Beberapa panel tahap dan lore masih bersifat presentasi statis.

Perbaikan realistis:

1. Pertahankan tiga keputusan sebagai inti scenario.
2. Tampilkan consequence langsung setelah setiap keputusan.
3. Hubungkan harmony score dengan reward dan passport.
4. Kurangi panel statis yang mengulang informasi keputusan.
5. Jangan menjadikan Culture Connection sebagai pengganti lesson exercise utama.

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
- `npm run lint`: **berhasil tanpa error**, tersisa warning asset `<img>`, middleware, dan dependency timer Arcade.
- Middleware convention Next.js 16 terdeteksi deprecated dan disarankan migrasi ke proxy.
- Supabase helper memakai non-null assertion env tanpa runtime validation.
- Tidak ada script test atau typecheck terpisah.
- Backend progress API Supabase sudah tersedia di `src/app/api/progress/route.ts`; role model admin masih belum ada.
- Tidak ada rate limiting login.
- Cookie auth tidak menetapkan konfigurasi production eksplisit seperti `secure` dan `maxAge`.
- Hotlink gambar eksternal berisiko pada reliability, privasi, dan performance.
- Prototype HTML memakai Tailwind CDN, Google Fonts, Material Symbols, dan `href="#"`; prototype bukan implementation production.
- `Sidebar.tsx` tampak legacy/unused karena layout menggunakan `DuolingoSidebar`.

## 9. Missing Features

### Penting untuk demo

- Lesson session dengan 5-8 exercise per node.
- Exercise bervariasi: pilihan konteks, susun dialog, audio, gesture, dan scenario.
- Hearts berkurang setiap exercise salah.
- XP reward per exercise dan reward bonus saat lesson selesai.
- Game over/retry saat hearts habis.
- Unlock lesson berikutnya setelah seluruh session selesai.
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
| P0 | Auth production file-based | Sangat tinggi | Tinggi | Gunakan Supabase Auth sebelum deployment production; custom cookie cukup untuk demo. |
| P0 | `/admin` terbuka | Tinggi | Rendah | Tambahkan guard atau keluarkan admin dari demo. |
| P0 | Lesson belum multi-exercise | Sangat tinggi | Sedang | Buat `LessonSession` dengan exercise index dan tipe exercise. |
| P0 | Hearts belum per exercise | Tinggi | Rendah | Kurangi hearts setelah jawaban salah dan buat game over/retry. |
| P0 | Reward lesson belum per exercise | Tinggi | Sedang | Pisahkan XP exercise dari bonus completion. |
| P1 | Progress tidak tersinkron remote | Tinggi | Rendah | Jalankan migration Supabase dan uji API progress. |
| P1 | Culture Connection masih sebagian statis | Sedang | Rendah | Tampilkan consequence dinamis dan sederhanakan panel lore. |
| P1 | Katalog passport masih fixture | Tinggi | Rendah | Tampilkan cap berdasarkan reward lesson/scenario. |
| P1 | Copy/quest masih fixture | Sedang | Rendah | Sinkronkan seluruh label dengan progress aktual. |
| P1 | Audio palsu | Sedang | Rendah | Labeli sebagai preview atau hilangkan klaim. |
| P1 | Warning asset dan Arcade hook | Rendah | Rendah | Ganti `<img>` utama dengan `Image` dan rapikan dependency timer. |
| P2 | Hotlink image | Sedang | Sedang | Simpan aset utama lokal atau beri fallback. |
| P2 | Responsive polish | Sedang | Sedang | Uji mobile flow dan overflow. |
| P3 | Backend CMS penuh | Rendah | Tinggi | Tunda. |

## 11. Pembagian Tim

### Person 1 — Core / Game Logic

**Task:** satukan login cookie API, buat `LessonSession` multi-exercise, kelola hearts per jawaban, hitung XP per exercise dan bonus completion, simpan progress, tampilkan progress di dashboard/profile/passport, dan buka lesson berikutnya.

**File:** `auth/page.tsx`, `auth/authClient.ts`, `dashboard/latihan/page.tsx`, `dashboard/evaluasi/page.tsx`, `dashboard/page.tsx`.

**Definition of Done:** user dapat login, menyelesaikan 5-8 exercise dalam satu lesson, kehilangan heart jika salah, game over jika hearts habis, memperoleh XP berdasarkan performa, melihat hasil, refresh, dan melihat progress yang sama.

### Person 2 — Content / Culture Gameplay

**Task:** pertahankan Culture Connection sebagai scenario tiga keputusan, tambahkan consequence nyata, rapikan konten busana/lore, dan tandai klaim budaya yang perlu verifikasi.

**File:** `dashboard/culture-connection/page.tsx`, `dashboard/latihan/busana/page.tsx`, `dashboard/selesai/page.tsx`, `admin/page.tsx`.

**Definition of Done:** user membuat tiga keputusan berurutan, melihat consequence setiap langkah, menerima harmony score sesuai pilihan, dan memperoleh reward setelah skenario selesai.

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
5. `/dashboard/latihan` — selesaikan satu session berisi beberapa exercise.
6. `/dashboard/evaluasi` — tampilkan refleksi hasil session dan XP.
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
- [ ] Satu lesson berisi beberapa exercise dengan tipe bervariasi.
- [ ] Jawaban benar dan salah menghasilkan feedback berbeda.
- [ ] Jawaban salah mengurangi satu heart.
- [ ] Hearts habis menghasilkan game over/retry.
- [ ] XP exercise dan bonus completion dihitung tepat.
- [ ] Progress berubah di dashboard.
- [ ] Passport hanya membuka badge setelah reward.
- [ ] Culture Connection menerima tiga input user.
- [ ] Skor Culture Connection mengikuti harmony score.
- [ ] Refresh tidak menghapus progress demo.
- [ ] Tidak ada CTA utama yang dead-end.
- [ ] Gambar utama tampil atau memiliki fallback.
- [ ] Mobile flow tidak overflow.
- [ ] `npm run build` berhasil.
- [ ] `npm run lint` tidak memiliki error.
- [ ] Tidak ada session token baru yang ikut dikomit.
- [ ] Klaim budaya yang belum diverifikasi sudah diberi label atau dihapus.

## 15. Top 10 Things To Fix First

1. Buat `LessonSession` dengan 5-8 exercise dalam satu node.
2. Tambahkan hearts loss, game over, dan retry.
3. Hitung XP per exercise dan bonus completion satu kali.
4. Simpan hasil session secara atomic ke progress/Supabase.
5. Pastikan unlock node berikutnya hanya setelah session selesai.
6. Hubungkan hasil session ke evaluasi, selesai, dan passport.
7. Pertahankan Culture Connection sebagai scenario tiga keputusan dengan consequence.
8. Sinkronkan dashboard, profile, TopBar, dan passport.
9. Jalankan migration Supabase dan uji persistence lintas refresh/session.
10. Uji seluruh demo flow desktop/mobile dengan hearts dan retry.

## Kesimpulan

Untuk deadline berikutnya, tim sebaiknya fokus pada **lesson session multi-exercise, hearts dan retry, XP per exercise, persistence Supabase, serta Culture Connection yang menerima keputusan user**.

Jangan mengerjakan **AI, multiplayer, realtime leaderboard, CMS backend penuh, migrasi arsitektur besar, atau ekspansi seluruh budaya Nusantara** sebelum core lesson loop selesai.
