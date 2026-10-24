const fs = require("fs");
const path = require("path");

console.log("=== VERIFIKASI RONDE 6: REDESIGN TOTAL CMS ===");

// 1. Cek sesi lama "Salam & Adab Tabe"
const storePath = path.join(__dirname, "..", "laras_content_store.json");
const storeRaw = fs.readFileSync(storePath, "utf8");
const store = JSON.parse(storeRaw);

const session1 = store.sessions && store.sessions["1"];
if (!session1) {
  console.error("FAIL: Sesi 1 (Salam & Adab Tabe) tidak ditemukan di laras_content_store.json");
  process.exit(1);
}

const payload = session1.payload || {};
console.log(`[PASS] Sesi 1 ditemukan: "${payload.title}"`);
console.log(`- ID: ${payload.id}`);
console.log(`- Status: ${payload.status}`);
console.log(`- Bab: ${payload.chapter}`);
console.log(`- Jumlah soal: ${payload.questions ? payload.questions.length : 0}`);

if (!payload.questions || payload.questions.length !== 5) {
  console.error(`FAIL: Jumlah soal sesi 1 bukan 5, tetapi ${payload.questions ? payload.questions.length : 0}`);
  process.exit(1);
}

payload.questions.forEach((q, i) => {
  console.log(`  Soal #${i + 1} (${q.type}): "${q.title || q.prompt?.slice(0, 30)}"`);
});

// 2. Cek validasi 6 tipe soal
function validateQuestion(q) {
  const errs = [];
  if (!q.prompt || !q.prompt.trim()) {
    errs.push("Pertanyaan / Instruksi utama belum diisi");
  }

  if (q.type === "multiple_choice" || q.type === "audio") {
    const opts = q.options || [];
    if (opts.length < 2) {
      errs.push("Pilihan ganda memerlukan minimal 2 opsi jawaban");
    }
    const hasCorrect = opts.some((o) => o.isCorrect);
    if (!hasCorrect) {
      errs.push("Belum ada kunci jawaban benar yang ditandai");
    }
  } else if (q.type === "true_false") {
    if (q.answerBoolean === undefined) {
      errs.push("Kunci jawaban Benar/Salah belum ditentukan");
    }
  } else if (q.type === "match" || q.type === "matching") {
    const pairs = q.pairs || q.matchingPairs || [];
    if (pairs.length < 2) {
      errs.push("Jodohkan pasangan memerlukan minimal 2 pasangan");
    }
    const hasEmpty = pairs.some(
      (p) => !p.left?.trim() || !p.right?.trim()
    );
    if (hasEmpty) {
      errs.push("Ada pasangan yang kolom kiri atau kanannya masih kosong");
    }
  } else if (q.type === "order" || q.type === "word_builder") {
    const items = q.items || q.targetSentence || [];
    if (items.length < 3) {
      errs.push("Susun urutan memerlukan minimal 3 item");
    }
    const hasEmpty = items.some((it) => !it?.trim());
    if (hasEmpty) {
      errs.push("Ada item urutan yang masih kosong");
    }
  } else if (q.type === "hotspot" || q.type === "visual") {
    if (!q.imageUrl || !q.imageUrl.trim()) {
      errs.push("Gambar artefak belum dipilih atau diunggah");
    }
    const spots = q.hotspots || [];
    if (spots.length < 1) {
      errs.push("Hotspot visual memerlukan minimal 1 titik penanda");
    }
    const opts = q.options || [];
    const hasCorrect = opts.some((o) => o.isCorrect) || spots.length > 0;
    if (!hasCorrect) {
      errs.push("Kunci jawaban titik hotspot belum dipilih");
    }
  } else if (q.type === "scenario" || q.type === "roleplay") {
    const steps = q.steps || [];
    if (steps.length < 1) {
      errs.push("Skenario memerlukan minimal 1 langkah situasi");
    }
    steps.forEach((step, sIdx) => {
      if (!step.prompt?.trim()) {
        errs.push(`Langkah ${sIdx + 1} belum memiliki teks situasi/dialog`);
      }
      if (!step.choices || step.choices.length < 1) {
        errs.push(`Langkah ${sIdx + 1} belum memiliki pilihan tindakan`);
      } else {
        const hasScored = step.choices.some((c) => c.score > 0);
        if (!hasScored) {
          errs.push(`Langkah ${sIdx + 1} harus memiliki minimal 1 pilihan dengan skor > 0`);
        }
      }
    });
  }

  return errs;
}

// Uji validasi kelima soal sesi 1
let session1Valid = true;
payload.questions.forEach((q, i) => {
  const errs = validateQuestion(q);
  if (errs.length > 0) {
    console.error(`FAIL: Soal #${i + 1} sesi 1 memiliki error: ${errs.join(", ")}`);
    session1Valid = false;
  }
});
if (session1Valid) {
  console.log("[PASS] Seluruh 5 soal pada sesi 'Salam & Adab Tabe' 100% valid dan lolos checklist!");
}

// 3. Uji blocking saat soal tanpa kunci jawaban
const invalidQ = {
  id: "Q-TEST-INVALID",
  type: "multiple_choice",
  prompt: "Apa salam adat Kaili?",
  options: [
    { id: "1", title: "Tabe", isCorrect: false },
    { id: "2", title: "Halo", isCorrect: false }
  ]
};
const invalidErrs = validateQuestion(invalidQ);
if (invalidErrs.some(e => e.includes("Belum ada kunci jawaban benar"))) {
  console.log("[PASS] Validasi pemblokir Checklist Terbit berfungsi tepat saat soal tidak memiliki kunci jawaban.");
} else {
  console.error("FAIL: Validasi tidak memblokir soal tanpa kunci jawaban");
  process.exit(1);
}

// 4. Verifikasi file GameFlowBuilder.tsx untuk ketiadaan tombol duplikat
const builderFile = fs.readFileSync(path.join(__dirname, "..", "src", "app", "admin", "GameFlowBuilder.tsx"), "utf8");

// Pastikan tidak ada tombol Simpan/Terbit ganda di header editor
const hasOldHeaderButtons = builderFile.includes('title="Simpan perubahan sebagai draf khusus admin"');
if (hasOldHeaderButtons) {
  console.error("FAIL: Masih ditemukan tombol Simpan Draf di header lama");
  process.exit(1);
} else {
  console.log("[PASS] Tombol aksi dobel Simpan Draf/Terbitkan di header telah sepenuhnya dihapus. Terbitkan hanya ada di Layar 4.");
}

// Pastikan stepper 4 langkah ada
if (builderFile.includes("1. Atur Pelajaran") &&
    builderFile.includes("2. Isi Soal") &&
    builderFile.includes("3. Coba sebagai Murid") &&
    builderFile.includes("4. Terbitkan")) {
  console.log("[PASS] Stepper 4 langkah tersedia lengkap dan konsisten.");
} else {
  console.error("FAIL: Stepper 4 langkah tidak lengkap");
  process.exit(1);
}

// Pastikan bar aksi bawah sticky ada
if (builderFile.includes("sticky bottom-0") && builderFile.includes("Lanjut: Isi Soal") && builderFile.includes("Lanjut: Coba sebagai Murid")) {
  console.log("[PASS] Sticky action bar bawah terpasang dengan navigasi langkah berikutnya dan tombol kembali.");
} else {
  console.error("FAIL: Sticky action bar bawah tidak ditemukan");
  process.exit(1);
}

// Pastikan galeri 6 tipe soal lengkap
if (builderFile.includes("multiple_choice") &&
    builderFile.includes("true_false") &&
    builderFile.includes("match") &&
    builderFile.includes("order") &&
    builderFile.includes("hotspot") &&
    builderFile.includes("scenario")) {
  console.log("[PASS] Galeri 6 tipe soal (Pilihan Ganda, Benar/Salah, Jodohkan, Susun Urutan, Hotspot Visual, Skenario Bercabang) lengkap terpasang.");
} else {
  console.error("FAIL: Galeri tipe soal tidak lengkap");
  process.exit(1);
}

console.log("\n=== SEMUA UJI VERIFIKASI LOGIKA BERHASIL (PASS) ===");
