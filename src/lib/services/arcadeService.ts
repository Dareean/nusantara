export interface ArcadeQuestion {
  id: number;
  question: string;
  hint: string;
  category: "Kosakata" | "Busana" | "Fonetik Dialek";
  options: string[];
  correctIndex: number;
  lore: string;
}

export const DEFAULT_ARCADE_QUESTIONS: ArcadeQuestion[] = [
  {
    id: 1,
    question: "Apa arti dari salam kehormatan 'Tabe' dalam bahasa Kaili?",
    hint: "Diucapkan sambil membungkukkan badan saat lewat atau menyapa.",
    category: "Kosakata",
    options: ["Permisi / Maaf", "Terima Kasih", "Selamat Jalan", "Apa Kabar"],
    correctIndex: 0,
    lore: "'Tabe' adalah sapaan etika tertinggi suku Kaili saat melintas di depan sesepuh atau meminta izin.",
  },
  {
    id: 2,
    question: "Busana 'Baju Nggembe' khas wanita Kaili memiliki bentuk potongan apa?",
    hint: "Bentuk segi empat longgar tanpa kancing penutup depan.",
    category: "Busana",
    options: ["Segi Empat Longgar", "Kebaya Ketat", "Gamis Bertingkat", "Rompi Berlapis"],
    correctIndex: 0,
    lore: "Baju Nggembe berbentuk segi empat dengan lengan melebar, melambangkan keleluasaan budi pekerti wanita Kaili.",
  },
  {
    id: 3,
    question: "Kain tenun Donggala sutra yang dihiasi benang emas disebut...",
    hint: "Ditenun dengan alat ATBM khas Banawa.",
    category: "Busana",
    options: ["Buya Sabe", "Kain Cual", "Ulos Batak", "Songket Palembang"],
    correctIndex: 0,
    lore: "Buya Sabe adalah kain tenun sutra Donggala bermotif Subi atau Kombu yang menjadi kebanggaan mahar dan upacara adat.",
  },
  {
    id: 4,
    question: "Istilah perhiasan kalung kuningan wanita Kaili di wilayah Sigi disebut apa?",
    hint: "Di Donggala disebut Dali, di Sigi memiliki nama lain.",
    category: "Busana",
    options: ["Sampa", "Salonde", "Pompapanto", "Jimat Tara"],
    correctIndex: 0,
    lore: "Sampa adalah kalung susun kuningan bermotif matahari yang melambangkan kehangatan dan derajat sosial sang mempelai.",
  },
  {
    id: 5,
    question: "Nilai luhur gotong royong dan kebersamaan masyarakat Kaili dikenal dengan istilah...",
    hint: "Falsafah hidup hidup rukun dan tolong-menolong.",
    category: "Kosakata",
    options: ["Sintuvu", "Maroso", "Mapalus", "Masagena"],
    correctIndex: 0,
    lore: "'Sintuvu' adalah fondasi adat Kaili yang berarti kesatuan hati, gotong royong, dan saling menopang dalam duka maupun sukacita.",
  },
  {
    id: 6,
    question: "Apa perbedaan dialek Ledo dan Tara dalam menyebut kata 'Tidak'?",
    hint: "Nama sub-etnis Kaili dinamai dari kata 'Tidak' yang digunakan.",
    category: "Fonetik Dialek",
    options: [
      "Ledo menyebut 'Ledo', Tara menyebut 'Tara'",
      "Keduanya menggunakan kata 'Ndada'",
      "Ledo menyebut 'De'e', Tara menyebut 'Bia'",
      "Sama sekali tidak ada perbedaan kosakata",
    ],
    correctIndex: 0,
    lore: "Suku Kaili memiliki keunikan linguistik: nama sub-suku (Ledo, Tara, Da'a, Rai, Ija) diambil dari varian kata negasi 'Tidak' masing-masing.",
  },
];

export async function fetchArcadeQuestions(): Promise<ArcadeQuestion[]> {
  try {
    const res = await fetch("/api/arcade/questions", { cache: "no-store" });
    if (!res.ok) return DEFAULT_ARCADE_QUESTIONS;
    const json = await res.json();
    if (Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
    return DEFAULT_ARCADE_QUESTIONS;
  } catch (err) {
    console.warn("Gagal mengambil soal dari Supabase/API, menggunakan data lokal:", err);
    return DEFAULT_ARCADE_QUESTIONS;
  }
}
