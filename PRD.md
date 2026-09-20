# PRD — NUSANTARA: BEFORE IT'S GONE

**Digital Cultural Transmission Platform**
Versi: 1.0 | Untuk: Lomba Aplikasi Berbasis Web Nasional (Munas IX Unima), via seleksi internal HMTI
Deadline upload karya: **1–2 Oktober 2026**

---

## 1. Ringkasan Eksekutif

Nusantara: Before It's Gone bukan arsip budaya digital. Ini adalah platform yang memindahkan pengetahuan budaya dari **pemilik pengetahuan (cultural holder)** ke **generasi berikutnya**, melalui alur terstruktur: **Memory → Knowledge → Learning → Practice → Transfer → Continuity**.

> Tagline: **"Don't just preserve culture. Pass it on."**
> ("Jangan hanya menyimpan budaya. Teruskan.")

**USP:** Website budaya lain menyimpan konten. Kami menyimpan *kemampuan untuk meneruskan* pengetahuan itu ke orang berikutnya.

---

## 2. Masalah

1. Sebagian besar pengetahuan budaya (teknik kerajinan, bahasa, musik, ritual, resep, filosofi) hanya hidup di ingatan dan keterampilan segelintir orang — tidak tercatat di buku maupun internet.
2. Ketika knowledge holder meninggal atau tidak lagi bisa mengajar, pengetahuan itu hilang bersamanya — bukan hanya orangnya.
3. Solusi yang ada (dokumentasi video, artikel, museum digital) hanya menjawab "apa yang dilakukan", bukan "bagaimana melakukannya, mengapa, dan siapa yang bisa mengajarkannya sekarang".
4. Generasi muda yang tertarik belajar budaya tidak tahu harus belajar dari siapa atau bagaimana memulai.

## 3. Positioning

| Website budaya biasa | Nusantara: Before It's Gone |
|---|---|
| Content → Read → Watch → Leave | Capture → Structure → Learn → Practice → Transfer → Continue |
| Unit nilai: **konten tersimpan** | Unit nilai: **pengetahuan diwariskan** |
| "Apa itu budaya ini?" | "Apa yang harus diwariskan agar budaya ini tetap hidup?" |

## 4. Target Pengguna

### Primary — Learner (Gen Z / mahasiswa, 18–25)
Tertarik budaya, melek teknologi, tapi tidak punya akses ke orang yang benar-benar menguasai pengetahuan budaya.
Pain point: *"Saya ingin belajar, tapi tidak tahu dari siapa atau bagaimana memulai."*

### Secondary — Cultural Holder
Pengrajin, seniman, tetua adat, penutur bahasa daerah, maestro musik, pembuat makanan tradisional, pelaku ritual.
Pain point: *"Bagaimana pengetahuan saya bisa diteruskan?"*

### Tertiary — Cultural Organization
Komunitas budaya, sanggar, sekolah, kampus, museum, pemerintah daerah.
Pain point: *"Knowledge mana yang paling butuh perhatian, dan apa yang harus dilakukan?"*

## 5. Model Ekosistem

```
CULTURAL HOLDER --(knowledge)--> PLATFORM --(learning)--> NEXT GENERATION
                         ^
                         | monitor/support
                   ORGANIZATION
```

Loop pewarisan: `MASTER → APPRENTICE → LEARNER → PRACTICE → VERIFICATION → NEW CULTURAL CARRIER`

## 6. Fitur Produk

### 6.1 Fitur Inti MVP (wajib untuk kompetisi)

| # | Fitur | Fungsi |
|---|---|---|
| 1 | **Knowledge DNA** | Memecah satu budaya menjadi struktur: Technique, Knowledge, Meaning, Story, People, Variations |
| 2 | **Knowledge at Risk** | Menampilkan skor risiko kepunahan tiap knowledge (jumlah praktisi, apprentice, % dokumentasi) |
| 3 | **Capture Memory** | Wawancara terpandu (guided interview questions) yang mengubah cerita lisan mentah menjadi Knowledge DNA terstruktur (dibantu AI) |
| 4 | **Teach Me** | Mengubah satu knowledge menjadi learning path bertahap dengan progress tracking |
| 5 | **Find My Mentor** | Matching learner dengan cultural holder berdasarkan expertise, lokasi, bahasa, level, availability |
| 6 | **Knowledge Lineage** | Visualisasi silsilah pewarisan pengetahuan dari generasi ke generasi, termasuk posisi user saat ini |
| 7 | **Become the Next** | Status progression: Learner → Apprentice → (verifikasi) → New Cultural Carrier |

### 6.2 Supporting System (MVP, versi ringan)

- **Cultural Risk Radar** — dashboard agregat: jumlah knowledge per level risiko (Critical/High/Warning/Healthy)
- **Cultural Consent** — kontrol akses per knowledge yang diset oleh holder/komunitas: Public / Community Only / Apprentice Only / Restricted / Do Not Document

### 6.3 Fitur Lanjutan (post-MVP / roadmap, tidak wajib untuk deadline lomba)

- Knowledge Gap (visualisasi % kelengkapan tiap dimensi Knowledge DNA per budaya)
- Why? (context engine: environment → need → solution → practice → tradition → philosophy)
- Cultural Connection (graph antar-budaya yang saling terhubung)
- Culture Lab (eksperimen aplikasi budaya ke konteks modern, dengan atribusi wajib ke sumber asli)
- Cultural Continuity Index (indikator agregat per knowledge)

## 7. User Journey Utama

1. Masuk homepage → lihat **Knowledge at Risk** yang menonjol
2. Temukan knowledge spesifik (mis. Tenun Sekomandi)
3. Buka **Knowledge DNA** → pelajari technique, meaning, story, people, variations
4. Lihat status risiko: **CRITICAL** — hanya 2 praktisi tersisa
5. Klik **Teach Me** → mulai learning path
6. Klik **Find My Mentor** → terhubung dengan cultural holder
7. Berstatus **Apprentice** → praktik → diverifikasi
8. Berstatus **New Cultural Carrier** → risiko knowledge tersebut turun

## 8. Success Metrics (bukan vanity metrics)

- Jumlah knowledge terdokumentasi
- Jumlah cultural holder terhubung
- Jumlah active learner
- Jumlah apprentice terbentuk
- Jumlah knowledge berhasil ditransfer (apprentice → verified carrier)
- Jumlah knowledge yang skor risikonya menurun setelah ada dokumentasi/apprentice

## 9. Lingkup MVP untuk Lomba (Batasan Realistis)

Mengingat deadline ~1-2 Oktober 2026, MVP difokuskan pada **1 studi kasus budaya lengkap** (end-to-end) plus beberapa knowledge tambahan sebagai bukti skalabilitas:

**Harus ada (demo-able end-to-end):**
- Landing page dengan narasi "What if tomorrow, nobody remembers how?"
- Knowledge at Risk feed (minimal 5–8 knowledge, data bisa seed manual)
- 1 Knowledge DNA lengkap dengan semua sub-struktur
- Capture Memory flow (form wawancara terpandu, boleh tanpa AI live — bisa template pertanyaan + hasil terstruktur sebagai contoh)
- Teach Me learning path dengan progress tracker (2/5 complete, dsb.)
- Find My Mentor (matching sederhana, boleh rule-based dulu, bukan wajib ML)
- Knowledge Lineage timeline visual
- Become the Next status flow (Learner → Apprentice → Verified)
- Cultural Consent toggle di level knowledge

**Boleh disederhanakan:**
- AI structuring di Capture Memory bisa memakai satu panggilan LLM sederhana (prompt terstruktur) alih-alih pipeline kompleks
- Matching mentor boleh scoring manual/heuristik, bukan algoritma canggih
- Autentikasi bisa disederhanakan (mis. role: Learner / Holder / Admin)

**Tidak wajib untuk lomba:** Knowledge Gap analytics penuh, Culture Lab, Cultural Connection graph — cukup disebut di presentasi sebagai roadmap.

## 10. Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend/DB:** PostgreSQL via Supabase (auth, storage untuk video/audio wawancara, row-level security untuk Cultural Consent)
- **AI:** LLM (structured output/JSON) untuk mengubah transkrip wawancara mentah menjadi Knowledge DNA
- **Hosting:** Vercel (wajib di-hosting sesuai ketentuan lomba)
- **Media:** Supabase Storage untuk video/audio interview capture

## 11. Ketentuan Lomba (Constraint Non-Negosiabel)

- Aplikasi berbasis web, wajib di-hosting (live URL saat submit)
- Boleh dikembangkan maksimal 1 tahun terakhir; belum pernah dilombakan sebelumnya
- Upload karya: sekitar 1–2 Oktober 2026
- Presentasi ke juri harus menyampaikan pesan inti: *"Budaya tidak hilang saat tidak terdokumentasi. Budaya hilang saat tidak ada lagi yang mampu meneruskannya."*

## 12. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Waktu sangat mepet ke deadline | Fokus 1 studi kasus end-to-end lengkap, bukan lebar tapi dangkal |
| Data budaya nyata sulit dikumpulkan cepat | Gunakan data riil dari 1-2 narasumber yang sudah dikenal tim + seed data tambahan yang jujur ditandai "contoh" |
| AI structuring rumit dibangun dari nol | Gunakan prompt LLM tunggal dengan skema JSON tetap (lihat agent.md) |
| Juri menilai sebagai "museum digital biasa" | Presentasi harus menonjolkan loop Capture→Structure→Learn→Practice→Transfer, bukan sekadar galeri konten |
