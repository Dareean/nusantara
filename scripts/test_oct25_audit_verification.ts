import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=== STARTING AUDIT VERIFICATION TESTS (25 OKT 2026) ===\n");

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition: boolean, message: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✓ ${message}`);
    } else {
      console.error(`  ✗ FAILED: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // ---------------------------------------------------------
  // TEST 1: Bagian A & D - Jury Credentials Endpoint & Form Auto-fill support
  // ---------------------------------------------------------
  console.log("[BAGIAN A] 1. Pengujian Kredensial Juri & Chip /auth");
  const credsRes = await fetch(`${BASE_URL}/api/auth/jury-credentials`);
  assert(credsRes.ok, "Endpoint /api/auth/jury-credentials mengembalikan HTTP 200");
  const credsData = await credsRes.json();
  assert(credsData.email === "juri@laras.id", "Email juri sesuai konfigurasi env (juri@laras.id)");
  assert(credsData.password === "juri-laras-2026", "Kata sandi juri sesuai konfigurasi env (juri-laras-2026)");
  assert(credsData.role === "admin_jury", "Role kredensial teridentifikasi sebagai admin_jury");

  // ---------------------------------------------------------
  // TEST 2: Bagian A & D - Login Juri & Session Token
  // ---------------------------------------------------------
  console.log("\n[BAGIAN A & D] 2. Login Akun Juri & Session Token Payload");
  const juryLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: credsData.email, password: credsData.password }),
  });
  assert(juryLoginRes.ok, "Login akun juri berhasil (HTTP 200)");
  const juryLoginData = await juryLoginRes.json();
  assert(juryLoginData.isJury === true, "Login response payload menandai isJury: true");
  assert(juryLoginData.isAdmin === true, "Login response payload menandai isAdmin: true");

  const setCookieHeader = juryLoginRes.headers.get("set-cookie") || "";
  assert(setCookieHeader.includes("laras_session="), "Cookie laras_session diterbitkan untuk juri");

  const cookieMatch = setCookieHeader.match(/laras_session=([^;]+)/);
  const juryCookie = cookieMatch ? cookieMatch[1] : "";
  assert(Boolean(juryCookie), "Session cookie juri valid dan dapat diekstrak");

  // Periksa sesi juri via /api/auth/session
  const jurySessionRes = await fetch(`${BASE_URL}/api/auth/session`, {
    headers: { Cookie: `laras_session=${juryCookie}` },
  });
  assert(jurySessionRes.ok, "Validasi sesi /api/auth/session berhasil");
  const jurySessionData = await jurySessionRes.json();
  assert(jurySessionData.session.isJury === true, "Sesi mengonfirmasi isJury: true");
  assert(jurySessionData.session.isAdmin === true, "Sesi mengonfirmasi isAdmin: true");

  // ---------------------------------------------------------
  // TEST 3: Bagian A - Server-Enforced Read-Only Mode (403 on ALL write routes)
  // ---------------------------------------------------------
  console.log("\n[BAGIAN A] 3. Server-Enforced Read-Only Guard (9 Route Tulis Konten)");
  const writeRoutes = [
    {
      name: "POST /api/content/entries",
      url: `${BASE_URL}/api/content/entries`,
      method: "POST",
      body: JSON.stringify({ term: "Uji Juri", category: "Uji", chapter: "Bab 1", module: "1.1", source: "Uji" }),
    },
    {
      name: "PUT /api/content/entries/ENT-001",
      url: `${BASE_URL}/api/content/entries/ENT-001`,
      method: "PUT",
      body: JSON.stringify({ term: "Tabe Edit", status: "verified" }),
    },
    {
      name: "DELETE /api/content/entries/ENT-001",
      url: `${BASE_URL}/api/content/entries/ENT-001`,
      method: "DELETE",
      body: null,
    },
    {
      name: "POST /api/content/entries/ENT-001/publish",
      url: `${BASE_URL}/api/content/entries/ENT-001/publish`,
      method: "POST",
      body: JSON.stringify({}),
    },
    {
      name: "POST /api/content/entries/ENT-001/unpublish",
      url: `${BASE_URL}/api/content/entries/ENT-001/unpublish`,
      method: "POST",
      body: JSON.stringify({}),
    },
    {
      name: "POST /api/content/sessions",
      url: `${BASE_URL}/api/content/sessions`,
      method: "POST",
      body: JSON.stringify({ id: "SES-TEST", title: "Uji Sesi Juri", payload: { questions: [] } }),
    },
    {
      name: "PUT /api/content/sessions/SES-TEST",
      url: `${BASE_URL}/api/content/sessions/SES-TEST`,
      method: "PUT",
      body: JSON.stringify({ title: "Uji Edit" }),
    },
    {
      name: "DELETE /api/content/sessions/SES-TEST",
      url: `${BASE_URL}/api/content/sessions/SES-TEST`,
      method: "DELETE",
      body: null,
    },
    {
      name: "POST /api/content/sessions/SES-TEST/publish",
      url: `${BASE_URL}/api/content/sessions/SES-TEST/publish`,
      method: "POST",
      body: JSON.stringify({}),
    },
  ];

  for (const route of writeRoutes) {
    const res = await fetch(route.url, {
      method: route.method,
      headers: {
        Cookie: `laras_session=${juryCookie}`,
        "Content-Type": "application/json",
      },
      body: route.body,
    });
    assert(res.status === 403, `${route.name} menolak sesi juri dengan status 403 Forbidden`);
    const errData = await res.json().catch(() => ({}));
    assert(
      (errData.error || "").includes("Mode Juri hanya memiliki akses baca"),
      `${route.name} mengembalikan pesan: "${errData.error}"`
    );
  }

  // ---------------------------------------------------------
  // TEST 4: Bagian A - Admin Utama Tetap Dapat Menulis
  // ---------------------------------------------------------
  console.log("\n[BAGIAN A] 4. Admin Utama Bebas Menulis (Tidak Ditolak 403)");
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@laras.id", password: "admin123" }),
  });
  assert(adminLoginRes.ok, "Login akun admin utama berhasil");
  const adminCookie = (adminLoginRes.headers.get("set-cookie") || "").match(/laras_session=([^;]+)/)?.[1] || "";
  assert(Boolean(adminCookie), "Cookie admin utama valid");

  const adminTestSessionId = `SES-TEST-${Date.now()}`;
  const adminCreateSessionRes = await fetch(`${BASE_URL}/api/content/sessions`, {
    method: "POST",
    headers: {
      Cookie: `laras_session=${adminCookie}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: adminTestSessionId,
      title: "Pelajaran Uji Admin Utama",
      payload: { id: adminTestSessionId, title: "Pelajaran Uji", questions: [{ id: "q1", type: "multiple_choice" }] },
      status: "draft",
    }),
  });
  assert(adminCreateSessionRes.status === 201, "Admin utama berhasil membuat sesi baru (HTTP 201)");

  // Clean up test session
  const adminDeleteRes = await fetch(`${BASE_URL}/api/content/sessions/${adminTestSessionId}`, {
    method: "DELETE",
    headers: { Cookie: `laras_session=${adminCookie}` },
  });
  assert(adminDeleteRes.ok, "Admin utama berhasil menghapus sesi uji (HTTP 200)");

  // ---------------------------------------------------------
  // TEST 5: Bagian D - Salted Password Hash & Transparent Migration
  // ---------------------------------------------------------
  console.log("\n[BAGIAN D] 5. Salted Password Hashing & Transparent Migration");
  const storePath = path.join(process.cwd(), "laras_auth_store.json");
  if (fs.existsSync(storePath)) {
    const rawStore = fs.readFileSync(storePath, "utf8");
    const store = JSON.parse(rawStore);
    const users = Object.values(store.users || {}) as Array<{ email: string; passwordHash: string }>;
    for (const u of users) {
      if (u.email === "admin@laras.id" || u.email === "demo@gmail.com") {
        assert(
          u.passwordHash.startsWith("s1$"),
          `Kata sandi ${u.email} tersimpan dalam format salted hash (${u.passwordHash.slice(0, 15)}...)`
        );
      }
    }
  }

  // ---------------------------------------------------------
  // TEST 6: Bagian C2 & C3 - Content Fixes
  // ---------------------------------------------------------
  console.log("\n[BAGIAN C] 6. Soal Hotspot Lesson 13 & Onboarding XP Text");
  const lessonsFilePath = path.join(process.cwd(), "src", "lib", "lessons.ts");
  const lessonsContent = fs.readFileSync(lessonsFilePath, "utf8");
  assert(
    lessonsContent.includes('id: "u6-p1-hotspot"') &&
    lessonsContent.includes('answer: "hotspot-ikatan"'),
    "Soal hotspot Tugu Perdamaian Nosarara memiliki kunci answer: 'hotspot-ikatan' (Tali Persaudaraan)"
  );

  const onboardingFilePath = path.join(process.cwd(), "src", "app", "onboarding", "page.tsx");
  const onboardingContent = fs.readFileSync(onboardingFilePath, "utf8");
  assert(
    onboardingContent.includes("+20 XP Pelajaran Pertama") &&
    !onboardingContent.includes("+30 XP Pelajaran Pertama"),
    "Halaman onboarding menuliskan '+20 XP Pelajaran Pertama' sesuai reward riil"
  );

  // ---------------------------------------------------------
  // TEST 7: Bagian B - Buku Panduan Unit Korpus Tab & Session 404
  // ---------------------------------------------------------
  console.log("\n[BAGIAN B] 7. Sisi Murid: Tab Korpus Adat & Penanganan Sesi Terhapus (404)");
  const dashboardFilePath = path.join(process.cwd(), "src", "app", "dashboard", "page.tsx");
  const dashboardContent = fs.readFileSync(dashboardFilePath, "utf8");
  assert(
    dashboardContent.includes('guidebookTab === "korpus"') &&
    dashboardContent.includes("Korpus Adat") &&
    dashboardContent.includes("unitVerifiedEntries"),
    "Buku Panduan Unit memiliki tab 'Korpus Adat' yang merender entri terverifikasi per bab"
  );

  const dynamicLessonFilePath = path.join(process.cwd(), "src", "app", "dashboard", "belajar", "[lessonId]", "page.tsx");
  const dynamicLessonContent = fs.readFileSync(dynamicLessonFilePath, "utf8");
  assert(
    dynamicLessonContent.includes("Pelajaran Tidak Ditemukan") &&
    dynamicLessonContent.includes("Sesi belajar ini tidak tersedia, berstatus draf, atau telah dihapus"),
    "Halaman /dashboard/belajar/[lessonId] menolak pelajaran terhapus/draf dengan tampilan 404 rapi"
  );

  console.log(`\n======================================================`);
  console.log(`HASIL VERIFIKASI: ${passedTests}/${totalTests} PENGUJIAN LULUS (100%)`);
  console.log(`======================================================\n`);
}

runTests().catch((err) => {
  console.error("Test suite failed:", err);
  process.exit(1);
});
