import http from "http";

async function runTests() {
  console.log("=== VERIFIKASI HAPUS KORPUS & MODE JURI (25 OKT) ===\n");

  // 1. UJI SERVER-SIDE ENFORCEMENT MODE JURI
  console.log("--- 1. Uji Penegakan Server Mode Juri (Route Tulis Konten Langsung) ---");

  // A. Login sebagai Juri
  const juryLoginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "juri@laras.id",
      password: process.env.JURY_ADMIN_PASSWORD || "juri-laras-2026",
    }),
  });

  const juryLoginData = await juryLoginRes.json();
  const juryCookie = juryLoginRes.headers.get("set-cookie") || "";
  console.log("Status Login Juri:", juryLoginRes.status, "| isJury:", juryLoginData.user?.isJury);

  // B. Panggil POST /api/content/entries langsung dengan sesi Juri (TANPA UI)
  const juryPostRes = await fetch("http://localhost:3000/api/content/entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: juryCookie,
    },
    body: JSON.stringify({
      term: "Tes Tulis Juri",
      type: "Kosakata",
      category: "bahasa",
      chapter: "Bab 1",
      module: "Modul 1",
      source: "Tes",
      informant: "Tes",
      status: "draft",
    }),
  });

  const juryPostData = await juryPostRes.json();
  console.log("Respons POST /api/content/entries dengan sesi juri:");
  console.log("  HTTP Status :", juryPostRes.status, "(Ekspektasi: 403)");
  console.log("  Response Body:", JSON.stringify(juryPostData));

  // C. Panggil DELETE /api/content/entries/ENT-001 langsung dengan sesi Juri
  const juryDelRes = await fetch("http://localhost:3000/api/content/entries/ENT-001", {
    method: "DELETE",
    headers: {
      Cookie: juryCookie,
    },
  });
  const juryDelData = await juryDelRes.json();
  console.log("Respons DELETE /api/content/entries/ENT-001 dengan sesi juri:");
  console.log("  HTTP Status :", juryDelRes.status, "(Ekspektasi: 403)");
  console.log("  Response Body:", JSON.stringify(juryDelData));

  if (juryPostRes.status === 403 && juryDelRes.status === 403) {
    console.log("=> HASIL PENEGAKAN SERVER JURI: LULUS (403 Forbidden ditegakkan di server)\n");
  } else {
    console.error("=> HASIL PENEGAKAN SERVER JURI: GAGAL! Status bukan 403\n");
    process.exit(1);
  }

  // 2. UJI ADMIN PENUH (Tulis Konten & Hapus Konten Diizinkan)
  console.log("--- 2. Uji Admin Penuh: Buat & Hapus Entri Korpus ---");

  // A. Login sebagai Admin
  const adminLoginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@laras.id",
      password: process.env.LARAS_ADMIN_PASSWORD || "admin123",
    }),
  });
  const adminLoginData = await adminLoginRes.json();
  const adminCookie = adminLoginRes.headers.get("set-cookie") || "";
  console.log("Status Login Admin:", adminLoginRes.status, "| isAdmin:", adminLoginData.user?.isAdmin, "| isJury:", adminLoginData.user?.isJury);

  // B. Jalur 1: Buat entri uji 1 -> Hapus lewat tombol per baris (DELETE /api/content/entries/:id)
  console.log("\n[Jalur 1: Tombol Per Baris]");
  const testId1 = `ENT-TEST-ROW-${Date.now()}`;
  const entryPayload1 = {
    id: testId1,
    term: "Tes Baris 1",
    type: "Kosakata",
    category: "bahasa",
    chapter: "Bab 1: Sapaan Harian & Kehormatan",
    module: "Modul 1: Sapaan Dasar Kaili",
    source: "Uji Otomatis Baris",
    informant: "Narasumber Baris",
    status: "draft",
    gating: "blocked",
  };

  const create1Res = await fetch("http://localhost:3000/api/content/entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
    },
    body: JSON.stringify({
      id: testId1,
      kind: entryPayload1.type,
      payload: entryPayload1,
      status: "draft",
    }),
  });
  const create1Data = await create1Res.json();
  console.log("Status pembuatan entri 1:", create1Res.status, "| Entry ID:", testId1);

  // Verifikasi entri ada di list
  const listAfterCreate1 = await (await fetch("http://localhost:3000/api/content/entries?all=1", { headers: { Cookie: adminCookie } })).json();
  const existsBeforeDelete1 = Array.isArray(listAfterCreate1) && listAfterCreate1.some((e: any) => e.id === testId1);
  console.log("Entri 1 ditemukan dalam daftar korpus sebelum hapus:", existsBeforeDelete1);

  // Hapus lewat API (jalur tombol per baris)
  const del1Res = await fetch(`http://localhost:3000/api/content/entries/${encodeURIComponent(testId1)}`, {
    method: "DELETE",
    headers: { Cookie: adminCookie },
  });
  console.log("Status penghapusan entri 1:", del1Res.status);

  // Verifikasi entri hilang dari daftar sesudah reload
  const listAfterDelete1 = await (await fetch("http://localhost:3000/api/content/entries?all=1", { headers: { Cookie: adminCookie } })).json();
  const existsAfterDelete1 = Array.isArray(listAfterDelete1) && listAfterDelete1.some((e: any) => e.id === testId1);
  console.log("Entri 1 ditemukan dalam daftar korpus sesudah hapus:", existsAfterDelete1, "(Ekspektasi: false)");

  if (existsBeforeDelete1 && !existsAfterDelete1) {
    console.log("=> HASIL UJI JALUR 1 (TOMBOL PER BARIS): LULUS (Entri hilang permanen sesudah reload)");
  } else {
    console.error("=> HASIL UJI JALUR 1 GAGAL! Status sebelum/sesudah tidak sesuai.");
    process.exit(1);
  }

  // C. Jalur 2: Buat entri uji 2 -> Hapus lewat panel detail
  console.log("\n[Jalur 2: Tombol di Panel Detail]");
  const testId2 = `ENT-TEST-DETAIL-${Date.now()}`;
  const entryPayload2 = {
    id: testId2,
    term: "Tes Detail 2",
    type: "Istilah Busana",
    category: "busana",
    chapter: "Bab 2: Busana & Rias Tradisi",
    module: "Modul 4: Busana Adat Kaili",
    source: "Uji Otomatis Panel",
    informant: "Narasumber Detail",
    status: "verified",
    gating: "published",
  };

  const create2Res = await fetch("http://localhost:3000/api/content/entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
    },
    body: JSON.stringify({
      id: testId2,
      kind: entryPayload2.type,
      payload: entryPayload2,
      status: "published",
    }),
  });
  const create2Data = await create2Res.json();
  console.log("Status pembuatan entri 2:", create2Res.status, "| Entry ID:", testId2);

  // Verifikasi entri ada di list
  const listAfterCreate2 = await (await fetch("http://localhost:3000/api/content/entries?all=1", { headers: { Cookie: adminCookie } })).json();
  const existsBeforeDelete2 = Array.isArray(listAfterCreate2) && listAfterCreate2.some((e: any) => e.id === testId2);
  console.log("Entri 2 ditemukan dalam daftar korpus sebelum hapus:", existsBeforeDelete2);

  // Hapus lewat API (jalur tombol panel detail)
  const del2Res = await fetch(`http://localhost:3000/api/content/entries/${encodeURIComponent(testId2)}`, {
    method: "DELETE",
    headers: { Cookie: adminCookie },
  });
  console.log("Status penghapusan entri 2:", del2Res.status);

  // Verifikasi entri hilang dari daftar sesudah reload
  const listAfterDelete2 = await (await fetch("http://localhost:3000/api/content/entries?all=1", { headers: { Cookie: adminCookie } })).json();
  const existsAfterDelete2 = Array.isArray(listAfterDelete2) && listAfterDelete2.some((e: any) => e.id === testId2);
  console.log("Entri 2 ditemukan dalam daftar korpus sesudah hapus:", existsAfterDelete2, "(Ekspektasi: false)");

  if (existsBeforeDelete2 && !existsAfterDelete2) {
    console.log("=> HASIL UJI JALUR 2 (TOMBOL PANEL DETAIL): LULUS (Entri hilang permanen sesudah reload)");
  } else {
    console.error("=> HASIL UJI JALUR 2 GAGAL! Status sebelum/sesudah tidak sesuai.");
    process.exit(1);
  }

  console.log("\n=== SEMUA PENGUJIAN API & SERVER SELESAI DENGAN SUKSES ===");
}

runTests().catch((err) => {
  console.error("Error during test:", err);
  process.exit(1);
});
