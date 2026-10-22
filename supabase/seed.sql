-- ==============================================================================
-- DATA SEED AWAL (DUMMY DATA MIGRASI KE SUPABASE) - LARAS NUSANTARA
-- Jalankan skrip ini di SQL Editor Supabase setelah schema.sql selesai dieksekusi.
-- ==============================================================================

-- 1. SEED SOAL ARCADE (arcade_questions)
insert into public.arcade_questions (id, question, hint, category, options, correct_index, lore)
values
(
  1,
  'Apa arti dari salam kehormatan ''Tabe'' dalam bahasa Kaili?',
  'Diucapkan sambil membungkukkan badan saat lewat atau menyapa.',
  'Kosakata',
  '["Permisi / Maaf", "Terima Kasih", "Selamat Jalan", "Apa Kabar"]'::jsonb,
  0,
  '''Tabe'' adalah sapaan etika tertinggi suku Kaili saat melintas di depan sesepuh atau meminta izin.'
),
(
  2,
  'Busana ''Baju Nggembe'' khas wanita Kaili memiliki bentuk potongan apa?',
  'Bentuk segi empat longgar tanpa kancing penutup depan.',
  'Busana',
  '["Segi Empat Longgar", "Kebaya Ketat", "Gamis Bertingkat", "Rompi Berlapis"]'::jsonb,
  0,
  'Baju Nggembe berbentuk segi empat dengan lengan melebar, melambangkan keleluasaan budi pekerti wanita Kaili.'
),
(
  3,
  'Kain tenun Donggala sutra yang dihiasi benang emas disebut...',
  'Ditenun dengan alat ATBM khas Banawa.',
  'Busana',
  '["Buya Sabe", "Kain Cual", "Ulos Batak", "Songket Palembang"]'::jsonb,
  0,
  'Buya Sabe adalah kain tenun sutra Donggala bermotif Subi atau Kombu yang menjadi kebanggaan mahar dan upacara adat.'
),
(
  4,
  'Istilah perhiasan kalung kuningan wanita Kaili di wilayah Sigi disebut apa?',
  'Di Donggala disebut Dali, di Sigi memiliki nama lain.',
  'Busana',
  '["Sampa", "Salonde", "Pompapanto", "Jimat Tara"]'::jsonb,
  0,
  'Sampa adalah kalung susun kuningan bermotif matahari yang melambangkan kehangatan dan derajat sosial sang mempelai.'
),
(
  5,
  'Nilai luhur gotong royong dan kebersamaan masyarakat Kaili dikenal dengan istilah...',
  'Falsafah hidup hidup rukun dan tolong-menolong.',
  'Kosakata',
  '["Sintuvu", "Maroso", "Mapalus", "Masagena"]'::jsonb,
  0,
  '''Sintuvu'' adalah fondasi adat Kaili yang berarti kesatuan hati, gotong royong, dan saling menopang dalam duka maupun sukacita.'
),
(
  6,
  'Apa perbedaan dialek Ledo dan Tara dalam menyebut kata ''Tidak''?',
  'Nama sub-etnis Kaili dinamai dari kata ''Tidak'' yang digunakan.',
  'Fonetik Dialek',
  '["Ledo menyebut ''Ledo'', Tara menyebut ''Tara''", "Keduanya menggunakan kata ''Ndada''", "Ledo menyebut ''De''e'', Tara menyebut ''Bia''", "Sama sekali tidak ada perbedaan kosakata"]'::jsonb,
  0,
  'Suku Kaili memiliki keunikan linguistik: nama sub-suku (Ledo, Tara, Da''a, Rai, Ija) diambil dari varian kata negasi ''Tidak'' masing-masing.'
)
on conflict (id) do update set
  question = excluded.question,
  hint = excluded.hint,
  category = excluded.category,
  options = excluded.options,
  correct_index = excluded.correct_index,
  lore = excluded.lore;

-- Reset sequence id arcade_questions jika diperlukan
select setval('arcade_questions_id_seq', (select max(id) from public.arcade_questions));


-- 2. SEED ENTRI KURASI BUDAYA (cultural_entries)
insert into public.cultural_entries (id, term, type, category, ipa, chapter, module, source, informant, status, gating, thumbnail, icon)
values
(
  'ENT-001',
  'Tabe',
  'Bahasa',
  'Sapaan Hormat',
  '/ta.be/',
  'Bab 1: Sapaan Harian',
  'Modul 1.2: Tata Krama Bertamu',
  'Dewan Adat Kaili & Balai Bahasa Sulteng',
  'Magau Palu • Reg: BBS-2023-A01',
  'verified',
  'published',
  null,
  'forum'
),
(
  'ENT-002',
  'Baju Nggembe',
  'Busana',
  'Blus Upacara Wanita',
  null,
  'Bab 3: Ragam Busana',
  'Modul 3.1: Anatomi Baju Nggembe',
  'Museum Negeri Sulawesi Tengah',
  'No. Registrasi: 1984/CL-02 • Kurator: Hj. Siti Rahma',
  'verified',
  'published',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDj2iA59wILAhgAw8HMAnmW9QdcqFfX57-hJxYVwmDa_TIIWaSw-Kc4eFO1rMzFSmUSWaCsR1mc9aG9AJN89VtVyZUXli2LW4NjVz3ml-5uq6E744sPk8UgPKxuJphS95np5CSgkykg5fgy3_LgLXvhj3CMceZH2EGLapdsSBHrbHSm9m9oAxEaEgaUxuV8LZqHldRPHobtxIN-TmnBfXDHI9TU7nC_212k-oXusVst0GcUGaQ4ma_Ysw',
  null
),
(
  'ENT-003',
  'Buya Sabe (Kain Subi)',
  'Kriya',
  'Tenun Sutra Donggala',
  null,
  'Bab 3: Ragam Busana',
  'Modul 3.3: Motif Tenun & Filosofi',
  'Sentra Tenun Banawa Donggala',
  'Ibu Masdiana (Penemu Motif Subi 1978)',
  'verified',
  'published',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC6SMOqiqdgy9jy0GKWVKDYKpLIIR8vpAH6cCdG2xUvlPd7kqApdh7wkPc1Xh6ceQ6FGr_t2IBREowE7IJXBuYWhiMG5CltqdAk0tPathcRH6_zaaG_M-mTqZLwgrSLCNPnqoXbVCzQw5qsnz5VNDlpgsWW9Ppt3UC398BAzyGGbl3hndvSZppnRz2ds0ECQssa_YUJuDSige6OCD9Ls_FZtRq0g3N9GjWN5mTEOpJ03oas0toLFlH-7Q',
  null
),
(
  'ENT-004',
  'Nalompa Mai Kami',
  'Bahasa',
  'Frasa Penyambutan (Kaili Tara)',
  null,
  'Bab 5: Upacara Adat',
  'Modul 5.1: Sambutan Tamu Kehormatan',
  'Tetua Adat Biromaru: Bpk. H. Rusdi',
  'Lampiran Audio #AUD-991 • 12 Feb 2025',
  'pending',
  'published',
  null,
  null
),
(
  'ENT-005',
  'Sampa / Dali Kuningan',
  'Perhiasan',
  'Kalung Adat Kaili',
  null,
  'Bab 4: Tata Rias & Hiasan Adat',
  'Modul 4.2: Aksesoris Pengantin Putri',
  'Dewan Kebudayaan Sigi & LAK Donggala',
  'Perbedaan terminologi penamaan daerah',
  'disputed',
  'educational_note',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA99tfPQRBVVtMXXGtMtlKHgSxSjzzIEGUQGQbCarbRHI1jOaWURL5jr78aETTdEhKke8meFtOLrl9X0gx8vyxYCiS_yWrOeXkOUZ1l6z-OZ9K_9GFLXs0kDKCI-H__0pXaAtrjs16Xh5R8JEJlxgMqWV9yn9Zs-IQGuEuCZYhHdOEtTgzumKJOZvzIf5Og5pyYLmjHu-GWCGUjVZ-gm5-qoCX3Gifqgzkkpof_6fw2F7JHtuIPKb9Nzw',
  null
),
(
  'ENT-006',
  'Kore-Kore (Syair Ratapan)',
  'Sastra Lisan',
  'Suku Kaili Da''a',
  null,
  'Bab 7: Sastra Tutur',
  'Modul 7.4: Tradisi Nyanyian Duka',
  'Peneliti Etnografi Independen (Taweli)',
  'Belum melampirkan izin tetua adat',
  'draft',
  'blocked',
  null,
  'draft'
)
on conflict (id) do update set
  term = excluded.term,
  type = excluded.type,
  category = excluded.category,
  ipa = excluded.ipa,
  chapter = excluded.chapter,
  module = excluded.module,
  source = excluded.source,
  informant = excluded.informant,
  status = excluded.status,
  gating = excluded.gating,
  thumbnail = excluded.thumbnail,
  icon = excluded.icon;


-- 3. SEED MODUL BELAJAR (lessons)
insert into public.lessons (id, slug, title, subtitle, region, intro, reward_xp, badge, source, questions)
values
(
  1,
  'salam-adab-tabe',
  'Salam & Adab Tabe',
  'Belajar membuka percakapan dengan hormat',
  'Kaili Ledo • Lembah Palu',
  'Tabe adalah cara meminta ruang dan menunjukkan hormat sebelum melangkah atau berbicara.',
  20,
  'Pionir Salam',
  '{"institution": "Dewan Adat Kaili (LAK) & Balai Pelestarian Kebudayaan Wilayah XVIII", "informant": "Tokoh Adat Kaili Ledo (Lembah Palu)", "registrationCode": "SULTENG-BBS-2024/KL-01", "verifiedDate": "Oktober 2024", "summary": "Materi etika tutur dan salam santun Tabe didasarkan pada tata krama pergaulan masyarakat Kaili Ledo.", "status": "Draft — dalam proses validasi"}'::jsonb,
  '[
    {
      "id": "tabe-choice",
      "type": "choice",
      "prompt": "Kamu melewati tetua di beranda. Apa tindakan yang paling sesuai?",
      "data": {
        "options": [
          { "id": "tabe", "label": "Mengucapkan Tabe sambil menunduk" },
          { "id": "walk", "label": "Langsung lewat tanpa menyapa" },
          { "id": "wave", "label": "Melambaikan tangan dari jauh" }
        ],
        "answer": "tabe"
      },
      "why": "Tabe menyampaikan permisi dan hormat, terutama saat melewati orang yang dituakan.",
      "xp": 5
    },
    {
      "id": "tabe-fact",
      "type": "truefalse",
      "prompt": "Mitos atau fakta? Tabe hanya digunakan untuk mengucapkan selamat tinggal.",
      "data": { "statement": "Tabe hanya digunakan untuk mengucapkan selamat tinggal.", "answer": false },
      "why": "Tabe dapat digunakan untuk meminta izin, menyapa, atau melewati seseorang dengan hormat.",
      "xp": 5
    },
    {
      "id": "tabe-match",
      "type": "match",
      "prompt": "Pasangkan ungkapan dengan konteksnya.",
      "data": {
        "pairs": [
          { "left": "Tabe", "right": "Permisi atau hormat" },
          { "left": "Pue", "right": "Tokoh yang dituakan" }
        ]
      },
      "why": "Memahami hubungan kata dan konteks membantu memilih sapaan yang tidak keliru.",
      "xp": 5
    },
    {
      "id": "tabe-order",
      "type": "order",
      "prompt": "Susun langkah bertamu yang santun.",
      "data": {
        "items": ["Menunggu ruang", "Mengucapkan Tabe", "Menyampaikan tujuan"],
        "answer": ["Menunggu ruang", "Mengucapkan Tabe", "Menyampaikan tujuan"]
      },
      "why": "Urutan yang tenang memberi ruang bagi tuan rumah sebelum percakapan dimulai.",
      "xp": 5
    },
    {
      "id": "tabe-scenario",
      "type": "scenario",
      "prompt": "Jalankan misi singkat bertamu ke Souraja.",
      "data": {
        "steps": [
          {
            "prompt": "Tetua sedang berbicara. Apa langkahmu?",
            "choices": [
              { "id": "wait", "label": "Menunggu di sisi tangga", "score": 1 },
              { "id": "tabe", "label": "Mengucapkan Tabe sambil menunduk", "score": 2 }
            ]
          },
          {
            "prompt": "Tetua menoleh. Bagaimana kamu membuka percakapan?",
            "choices": [
              { "id": "formal", "label": "Tabe pue, nalompa mai kami", "score": 2 },
              { "id": "casual", "label": "Halo, kami datang", "score": 1 }
            ]
          },
          {
            "prompt": "Kamu dipersilakan mendekat. Apa gesturemu?",
            "choices": [
              { "id": "lower", "label": "Menunduk ringan dengan tangan kanan merendah", "score": 2 },
              { "id": "wave", "label": "Melambaikan tangan dari jauh", "score": 0 }
            ]
          }
        ],
        "passingScore": 5
      },
      "why": "Adab bukan hanya kata, tetapi juga waktu, nada, dan gesture saat bertamu.",
      "xp": 5
    }
  ]'::jsonb
)
on conflict (id) do update set
  slug = excluded.slug,
  title = excluded.title,
  subtitle = excluded.subtitle,
  region = excluded.region,
  intro = excluded.intro,
  reward_xp = excluded.reward_xp,
  badge = excluded.badge,
  source = excluded.source,
  questions = excluded.questions;
