# AUDIT PENYIMPANAN DATA LARAS: LOKAL ATAU SUPABASE?

**Tanggal Audit:** 22 Oktober 2026  
**Auditor:** Antigravity AI Coding Assistant  
**Metode:** Audit statis kode sumber (AST/Grep) & Penelusuran Alur Eksekusi Runtime (Strictly Read-Only).

---

## 1. Tabel Ringkasan Audit Kategori Data

| Kategori | Tersimpan di Mana Persisnya | Bukti (File:Baris) | Bertahan setelah Redeploy? |
| :--- | :--- | :--- | :---: |
| **1. Sesi & Soal GameFlowBuilder** (`GameSession`/`GameQuestion`) | **Dual (Lokal + File Server + Supabase jika tabel ada)**<br>• Client: `localStorage["laras_game_sessions_v2"]` & `localStorage["laras_server_sessions_cache"]`<br>• Server: File JSON `laras_content_store.json`<br>• Database: Tabel `public.content_sessions` (Upstream) | • Client: [`sessionStore.ts:77,145,186,217`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/components/game-engine/sessionStore.ts#L77)<br>• Pemanggil Builder: [`GameFlowBuilder.tsx:271`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/admin/GameFlowBuilder.tsx#L271)<br>• API Route: [`/api/content/sessions/route.ts:49-75`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/api/content/sessions/route.ts#L49-L75)<br>• Server Store & Supabase: [`serverContent.ts:27,232,237-251`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/lib/content/serverContent.ts#L27) | **TIDAK** *(kondisi saat ini karena DDL remote Supabase belum dieksekusi)* / **YA** *(jika DDL `schema.sql` sudah di-run di remote Supabase)* |
| **2. Entri Korpus & Status Verifikasi Admin** | **Dual (Lokal + File Server + Supabase jika tabel ada)**<br>• Client: `localStorage["laras_cms_entries"]`<br>• Server: File JSON `laras_content_store.json`<br>• Database: Tabel `public.content_entries` (Upstream) | • Client: [`admin/page.tsx:133,216,292,342`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/admin/page.tsx#L133)<br>• API Route: [`/api/content/entries/route.ts:55-60`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/api/content/entries/route.ts#L55-L60) & [`[id]/route.ts:41-47`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/api/content/entries/%5Bid%5D/route.ts#L41-L47)<br>• Server Store & Supabase: [`serverContent.ts:27,369,373-385`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/lib/content/serverContent.ts#L27) | **TIDAK** *(kondisi saat ini karena DDL remote Supabase belum dieksekusi)* / **YA** *(jika DDL `schema.sql` sudah di-run di remote Supabase)* |
| **3. Akun Pengguna & Sesi Login (Auth)** | **Lokal Server / Stateless Cookie (Bukan Supabase)**<br>• Akun Seed: Hardcoded di kode (`SEED_USERS`)<br>• Akun Dinamis: File JSON server `laras_auth_store.json`<br>• Sesi Login: Stateless signed cookie HMAC-SHA256 (`laras_session`) + flag client `localStorage["laras_logged_in"]` | • Akun Seed: [`serverAuth.ts:36-49`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/auth/serverAuth.ts#L36-L49)<br>• Akun Register Dinamis: [`serverAuth.ts:22,76-92,97-102`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/auth/serverAuth.ts#L22)<br>• Token Sesi Cookie: [`sessionToken.ts:39-65`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/lib/auth/sessionToken.ts#L39-L65)<br>• Login Route: [`/api/auth/login/route.ts:40-49`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/api/auth/login/route.ts#L40-L49)<br>• Client Flag: [`auth/page.tsx:64,114`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/auth/page.tsx#L64) | **YA** untuk Akun Seed (`demo@gmail.com` / `admin@laras.id`) & Sesi Login Cookie.<br>**TIDAK** untuk Akun yang mendaftar baru via Register di production serverless. |
| **4. Progres Belajar (XP, Hearts, Streak, Badge, Selesai)** | **Dual (Client LocalStorage + File Server + Supabase jika tabel ada)**<br>• Client: `localStorage["laras.progress.${email}"]` & queue `localStorage["laras.progress.unsynced.${email}"]`<br>• Server: File JSON `laras_user_progress.json`<br>• Database: Tabel `public.user_progress` (Upstream) | • Client Key & Save: [`progress.ts:16-17,125,131-136`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/dashboard/progress.ts#L16)<br>• Pemanggil Latihan: [`latihan/[lessonId]/page.tsx:103-113`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/dashboard/latihan/%5BlessonId%5D/page.tsx#L103-L113)<br>• Pemanggil Culture Conn: [`culture-connection/page.tsx:82-89`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/dashboard/culture-connection/page.tsx#L82-L89)<br>• Server Store & Supabase: [`/api/progress/route.ts:23,196,199-209`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/api/progress/route.ts#L23) | **TIDAK** *(kondisi saat ini karena DDL remote Supabase belum dieksekusi)* / **YA** *(jika DDL `schema.sql` sudah di-run di remote Supabase)* |

---

## 2. Rincian Teknis per Kategori

### Kategori 1: Sesi/Konten dari GameFlowBuilder (`GameSession` / `GameQuestion`)
- **Disimpan di mana persisnya:**
  1. **Client Browser:** `localStorage` key `"laras_game_sessions_v2"` (draft/lokal) dan `"laras_server_sessions_cache"` (sesi published hasil sinkronisasi server).
  2. **Server Filesystem:** File JSON `laras_content_store.json` (pada path root proyek) melalui memory map `memorySessions`.
  3. **Supabase Database:** Ditujukan ke tabel `public.content_sessions`.
- **Lewat fungsi apa:**
  - Client: `saveSingleSessionToServer(activeSession, sessionStatus)` di `src/app/components/game-engine/sessionStore.ts:212` yang dipanggil tombol *Simpan Alur Sesi* di `src/app/admin/GameFlowBuilder.tsx:271`.
  - Server Route: `POST /api/content/sessions` di `src/app/api/content/sessions/route.ts:49`.
  - Backend Storage: `upsertContentSession(...)` di `src/lib/content/serverContent.ts:202-257`.
- **Apakah bertahan setelah refresh?**  
  **YA.** Bertahan karena langsung tersimpan di `localStorage["laras_game_sessions_v2"]` dan dibaca sinkron oleh `getStoredSessions()` (`sessionStore.ts:95`).
- **Apakah bertahan setelah ganti browser?**  
  - Di Localhost: **YA** (server API membaca dari `laras_content_store.json`).
  - Di Vercel Production: **TIDAK** saat ini, karena tabel `content_sessions` di Supabase belum dibuat, sehingga filesystem serverless bersifat ephemeral.
- **Apakah bertahan setelah redeploy?**  
  - Saat ini: **TIDAK** (jika di Vercel serverless, filesystem lokal akan di-reset setiap deployment baru).
  - Jika SQL DDL dijalankan di Supabase: **YA**.

---

### Kategori 2: Entri Korpus & Status Verifikasi di Admin
- **Disimpan di mana persisnya:**
  1. **Client Browser:** `localStorage` key `"laras_cms_entries"`.
  2. **Server Filesystem:** File JSON `laras_content_store.json` (bagian `entries`) melalui in-memory map `memoryEntries`.
  3. **Supabase Database:** Ditujukan ke tabel `public.content_entries`.
- **Lewat fungsi apa:**
  - Tambah entri: `handleAddEntry` di `src/app/admin/page.tsx:270-315` menulis ke `localStorage["laras_cms_entries"]` lalu `POST /api/content/entries`.
  - Update status verifikasi (*verified*, *pending*, *disputed*, *draft*): `handleUpdateStatus` di `src/app/admin/page.tsx:317-348` memperbarui state dan menulis ke `localStorage["laras_cms_entries"]` (via `useEffect` baris 216) serta memanggil `PUT /api/content/entries/[id]`.
  - Server Route: `src/app/api/content/entries/route.ts:35` dan `src/app/api/content/entries/[id]/route.ts:16`.
  - Backend Storage: `upsertContentEntry(...)` di `src/lib/content/serverContent.ts:348-390`.
- **Apakah bertahan setelah refresh?**  
  **YA.** Bertahan via `localStorage["laras_cms_entries"]` dan dibaca saat mounting (`admin/page.tsx:175-180`).
- **Apakah bertahan setelah ganti browser?**  
  - Di Localhost: **YA** (sinkron dari `laras_content_store.json` via `/api/content/entries?all=1`).
  - Di Vercel Production: **TIDAK** saat ini (karena serverless filesystem terisolasi antar instance dan tabel Supabase belum ada).
- **Apakah bertahan setelah redeploy?**  
  - Saat ini: **TIDAK**.
  - Jika SQL DDL dijalankan di Supabase: **YA**.

---

### Kategori 3: Akun Pengguna & Sesi Login (Auth)
- **Disimpan di mana persisnya:**
  1. **Akun Bawaan (Seed Users):** Tersimpan di kode program (in-memory hardcoded dictionary `SEED_USERS` di `src/app/auth/serverAuth.ts:36-49`):
     - `demo@gmail.com` (password: `demo123`, role: user biasa)
     - `admin@laras.id` (password: `admin123`, role: admin)
  2. **Akun Pengguna Baru (Dynamic Registration):** Tersimpan di memory map `users` dan dicadangkan ke file JSON `laras_auth_store.json` di server (`src/app/auth/serverAuth.ts:22,52,76-92`). **TIDAK ADA tabel `users` di Supabase.**
  3. **Sesi Login Pengguna:** Disimpan dalam HTTP Cookie browser bernama `"laras_session"` berstatus `HttpOnly; Path=/; SameSite=Lax` (`src/app/api/auth/login/route.ts:40-49`). Token sesi berupa **HMAC-SHA256 Stateless Signed Token** (`src/lib/auth/sessionToken.ts:39-65`) yang ditandatangani menggunakan `SUPABASE_SERVICE_ROLE_KEY`. Di client juga terdapat penanda UI `localStorage["laras_logged_in"] = "true"` (`src/app/auth/page.tsx:64,114`).
- **Lewat fungsi apa:**
  - Login: `POST /api/auth/login` memanggil `getUserByEmail(email)` (`src/app/auth/serverAuth.ts:104`) lalu `createSessionForUser(user)` (`src/app/auth/serverAuth.ts:117`).
  - Validasi Sesi: `getSession(sessionId)` (`src/app/auth/serverAuth.ts:137`) yang memverifikasi signature secara sinkron via `verifySessionTokenSync(token)` (`src/lib/auth/sessionToken.ts:67-95`).
- **Apakah bertahan setelah refresh?**  
  **YA.** Cookie `laras_session` bertahan di browser hingga masa kedaluwarsa 7 hari.
- **Apakah bertahan setelah ganti browser?**  
  - Akun Seed (`demo@gmail.com` & `admin@laras.id`): **YA**, dapat login di browser mana pun.
  - Sesi Login Aktif: **TIDAK**, cookie terikat pada browser masing-masing pengguna.
  - Akun Register Baru: Di localhost **YA**, di Vercel serverless **TIDAK** (karena `laras_auth_store.json` tidak dibagikan antar instance serverless).
- **Apakah bertahan setelah redeploy?**  
  - Akun Seed: **YA** (selalu tersedia di kode).
  - Sesi Login Cookie: **YA**! Karena token sesi bersifat stateless kriptografis (HMAC-SHA256) menggunakan kunci server yang konsisten, server hasil redeploy dapat langsung memvalidasi token tanpa memerlukan sesi di database/memori.
  - Akun Register Baru: **TIDAK** di serverless Vercel.

---

## 3. Khusus Progres: Penelusuran Jalur Tulis End-to-End

### A. Apakah `/api/progress` Benar-Benar Dipanggil dari Client Saat Pelajaran Selesai?
**YA, 100% TERBUKTI DIPANGGIL.**

**Jalur Pemanggilan (Trace):**
1. **Titik Pemicu 1 (Selesai Latihan 5 Soal):**  
   Di [`src/app/dashboard/latihan/[lessonId]/page.tsx:100-115`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/dashboard/latihan/%5BlessonId%5D/page.tsx#L100-L115), fungsi `finishSession()` mengeksekusi:
   ```ts
   recordLessonSession(sessionEmail, {
     lessonId: lesson.id,
     answered: "lesson-session",
     score: Math.round((correctCount / totalExercises) * 100),
     xpEarned: lessonXp,
     bonusXp: 0,
     totalExercises,
     correctExercises: correctCount,
     heartsRemaining: hearts,
     completedAt: new Date().toISOString(),
   });
   ```
2. **Titik Pemicu 2 (Selesai Culture Connection Studio):**  
   Di [`src/app/dashboard/culture-connection/page.tsx:80-95`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/dashboard/culture-connection/page.tsx#L80-L95), fungsi `handleClaim()` mengeksekusi:
   ```ts
   recordLessonResult(sessionEmail, {
     lessonId: 4,
     answered: "culture-connection",
     correct: harmony >= 5,
     score: harmony * 20,
     xp: 30,
     completedAt: new Date().toISOString(),
   });
   ```
3. **Penyimpanan Lokal & Trigger HTTP PUT:**  
   Di [`src/app/dashboard/progress.ts:260-314`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/dashboard/progress.ts#L260-L314) (`recordLessonSession`) dan baris 211-258 (`recordLessonResult`), keduanya menghitung akumulasi metrik anti-regresi lalu memanggil `saveProgress(email, next)` di baris 121.
4. **Eksekusi HTTP Client:**  
   Di [`src/app/dashboard/progress.ts:124-171`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/dashboard/progress.ts#L124-L171):
   - Baris 125: Menulis instan ke `window.localStorage.setItem("laras.progress." + email, ...)`.
   - Baris 131-136: Mengirim request HTTP `PUT /api/progress` dengan header `credentials: "include"` dan body `{ email, progress }`.
   - Baris 143-150: Jika menerima `401 Unauthorized`, memanggil `/api/auth/session` untuk refresh cookie lalu melakukan *auto-retry* 1x.
   - Baris 165, 169: Jika respons gagal/offline, payload dicadangkan ke antrean `localStorage["laras.progress.unsynced." + email]`.

---

### B. Apakah Upsert ke Tabel `user_progress` Benar-Benar Jalan atau Fallback Diam-Diam?
**JAWABAN JUJUR KODE:**
1. **Di Lapisan Route Server (`src/app/api/progress/route.ts:163-212`):**
   - Route benar-benar mencoba memanggil Supabase:
     ```ts
     const { error } = await createAdminClient().from("user_progress").upsert(
       { email, progress: mergedProgress, updated_at: new Date().toISOString() },
       { onConflict: "email" }
     );
     ```
     *(Bukti: [`src/app/api/progress/route.ts:199-202`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/api/progress/route.ts#L199-L202))*
2. **Keberadaan Fallback Diam-Diam:**
   - **YA, ADA FALLBACK:**
     - Sebelum mencoba Supabase, server **selalu** menyimpan salinan progres ke file lokal `laras_user_progress.json` via `saveLocalProgress(email, mergedProgress)` di [`src/app/api/progress/route.ts:196`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/api/progress/route.ts#L196).
     - Jika panggilan Supabase mengembalikan error atau melempar exception, error tersebut **ditangkap (swallowed)** oleh `console.warn` di [`src/app/api/progress/route.ts:205, 208`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/src/app/api/progress/route.ts#L205) dan route tetap mengembalikan HTTP 200 `{ ok: true, progress: mergedProgress }` (`baris 211`).
3. **Kondisi Database Remote Saat Ini:**
   - Kueri langsung ke proyek Supabase remote menghasilkan error:
     `"Could not find the table 'public.user_progress' in the schema cache"`.
   - **Artinya saat ini:** Pemanggilan Supabase gagal di tingkat database karena tabel belum ada di remote DB. Namun berkat arsitektur fallback:
     - Klien tidak mengalami crash / error merah.
     - Progres tetap tersimpan di `localStorage` browser pengguna dan di file server `laras_user_progress.json`.
     - Begitu skrip SQL dijalankan di database Supabase, fungsi upsert tersebut akan langsung menulis ke tabel Supabase tanpa perlu perubahan kode lagi.

---

## 4. Isi dan Analisis `supabase/schema.sql`

Isi lengkap file [`supabase/schema.sql:1-48`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/supabase/schema.sql#L1-L48) mendefinisikan **3 tabel**:

### 1. Tabel `public.user_progress` (Baris 1-12)
```sql
create table if not exists public.user_progress (
  email text primary key,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.user_progress enable row level security;
revoke all on table public.user_progress from anon, authenticated;
create index if not exists user_progress_updated_at_idx on public.user_progress (updated_at desc);
```
- **Fungsi:** Menyimpan progres belajar murid (XP, hearts, streak, completedLessons, badges) dalam bentuk JSONB terindeks.

### 2. Tabel `public.content_sessions` (Baris 14-33)
```sql
create table if not exists public.content_sessions (
  id text primary key,
  title text not null,
  payload jsonb not null,
  status text not null default 'published' check (status in ('draft', 'published')),
  version int not null default 1,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists content_sessions_status_idx on public.content_sessions (status);
create index if not exists content_sessions_updated_at_idx on public.content_sessions (updated_at desc);
alter table public.content_sessions enable row level security;
revoke all on table public.content_sessions from anon, authenticated;
```
- **Fungsi:** Menyimpan modul/sesi dan soal hasil racikan kurator di GameFlowBuilder.

### 3. Tabel `public.content_entries` (Baris 35-48)
```sql
create table if not exists public.content_entries (
  id text primary key,
  kind text not null,
  payload jsonb not null,
  status text not null default 'published' check (status in ('draft', 'published')),
  updated_at timestamptz not null default now()
);
create index if not exists content_entries_status_idx on public.content_entries (status);
alter table public.content_entries enable row level security;
revoke all on table public.content_entries from anon, authenticated;
```
- **Fungsi:** Menyimpan data kamus/korpus kebudayaan CMS beserta status verifikasinya.

---

### Jawaban Pertanyaan Schema: Apakah Ada Tabel untuk Konten, Sesi, atau Akun Selain `user_progress`?
1. **Untuk Konten & Sesi:**  
   **ADA.** `supabase/schema.sql` telah menyiapkan tabel `public.content_sessions` (untuk sesi/soal GameFlowBuilder) dan `public.content_entries` (untuk korpus kebudayaan & verifikasi CMS).
2. **Untuk Akun Pengguna / Auth:**  
   **TIDAK ADA.** Di dalam `supabase/schema.sql` **sama sekali tidak ada tabel `users` atau `accounts`**. Sistem autentikasi LARAS sepenuhnya ditangani secara lokal menggunakan akun seed hardcoded (`SEED_USERS`) dan token stateless HMAC-SHA256 (`src/app/auth/serverAuth.ts`).

---

## 5. Kesimpulan Akhir Auditor

1. **Apakah data saat ini tersimpan lokal atau di Supabase?**
   - Secara kode, sistem mengadopsi pola **Hybrid Cloud-First with Local Resilience**. Kode telah mengimplementasikan pemanggilan Supabase untuk progres, sesi konten, dan korpus.
   - Namun secara runtime di database remote saat ini, **data fisik masih bertumpu pada Lokal (`localStorage` browser + File JSON server)** karena file `supabase/schema.sql` belum dieksekusi di instance Supabase target.
2. **Langkah yang Diperlukan agar 100% Persisten di Supabase:**
   - Cukup jalankan perintah SQL dari [`supabase/schema.sql`](file:///d:/Daren%20Punya%20Barang/Kegiatan%20Rafi/Lomba%20MUNAS/nusantara/supabase/schema.sql) di **SQL Editor Dashboard Supabase**.
   - Tidak perlu mengubah 1 baris kode pun di Next.js karena logika upsert dan read-nya sudah siap dan aktif memanggil tabel-tabel tersebut.
