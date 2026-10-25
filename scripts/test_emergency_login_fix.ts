const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=== PENGUJIAN VERIFIKASI PERBAIKAN DARURAT LOGIN (25 OKT PAGI) ===\n");
  let passed = 0;
  let total = 0;

  function assert(cond: boolean, msg: string) {
    total++;
    if (cond) {
      passed++;
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ GAGAL: ${msg}`);
      throw new Error(`Assertion failed: ${msg}`);
    }
  }

  // -------------------------------------------------------------
  // BUTIR 1: Login Akun Demo (demo@gmail.com / demo123)
  // -------------------------------------------------------------
  console.log("[TEST 1] Login Akun Demo via /api/auth/login");
  const demoRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "demo@gmail.com", password: "demo123" }),
  });
  assert(demoRes.status === 200, "Login demo@gmail.com berhasil dengan status HTTP 200");
  const demoData = await demoRes.json();
  assert(demoData.ok === true, "Response demo ok: true");
  assert(demoData.email === "demo@gmail.com", "Response demo email cocok");
  assert(demoData.isAdmin === false, "Akun demo memiliki isAdmin: false (hak murid/dashboard)");
  const demoCookie = demoRes.headers.get("set-cookie") || "";
  assert(demoCookie.includes("laras_session="), "Cookie laras_session diterbitkan untuk demo");

  // Verifikasi akses sesi demo
  const demoSessionRes = await fetch(`${BASE_URL}/api/auth/session`, {
    headers: { Cookie: demoCookie.split(";")[0] },
  });
  assert(demoSessionRes.status === 200, "Sesi demo valid via /api/auth/session");

  // -------------------------------------------------------------
  // BUTIR 2: Login Akun Admin (admin@laras.id / admin123)
  // -------------------------------------------------------------
  console.log("\n[TEST 2] Login Akun Admin via /api/auth/login");
  const adminRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@laras.id", password: "admin123" }),
  });
  assert(adminRes.status === 200, "Login admin@laras.id berhasil dengan status HTTP 200");
  const adminData = await adminRes.json();
  assert(adminData.ok === true, "Response admin ok: true");
  assert(adminData.email === "admin@laras.id", "Response admin email cocok");
  assert(adminData.isAdmin === true, "Akun admin memiliki isAdmin: true (hak admin panel)");
  assert(!adminData.isJury, "Akun admin utama bukan mode juri (isJury: false)");
  const adminCookie = adminRes.headers.get("set-cookie") || "";
  assert(adminCookie.includes("laras_session="), "Cookie laras_session diterbitkan untuk admin");

  // -------------------------------------------------------------
  // BUTIR 3: Login Akun Juri (juri@laras.id / juri-laras-2026)
  // -------------------------------------------------------------
  console.log("\n[TEST 3] Login Akun Juri via /api/auth/login & Chip Credentials");
  // Periksa kredensial chip
  const juryCredsRes = await fetch(`${BASE_URL}/api/auth/jury-credentials`);
  assert(juryCredsRes.status === 200, "Endpoint /api/auth/jury-credentials mengembalikan HTTP 200");
  const juryCreds = await juryCredsRes.json();
  assert(juryCreds.email === "juri@laras.id", "Chip email juri adalah juri@laras.id");
  assert(juryCreds.password === "juri-laras-2026", "Chip password juri adalah juri-laras-2026");

  // Login dengan kredensial juri
  const juryRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: juryCreds.email, password: juryCreds.password }),
  });
  assert(juryRes.status === 200, "Login juri@laras.id berhasil dengan status HTTP 200");
  const juryData = await juryRes.json();
  assert(juryData.ok === true, "Response juri ok: true");
  assert(juryData.isAdmin === true, "Akun juri memiliki akses panel admin (isAdmin: true)");
  assert(juryData.isJury === true, "Akun juri teridentifikasi dalam mode juri (isJury: true)");

  // -------------------------------------------------------------
  // BUTIR 4: Daftar Akun Baru -> Logout -> Login Kembali
  // -------------------------------------------------------------
  console.log("\n[TEST 4] Registrasi Pengguna Baru Persisten & Login Ulang");
  const randomSuffix = Date.now();
  const testNewUser = {
    name: `Murid Persisten ${randomSuffix}`,
    email: `murid.persisten.${randomSuffix}@laras.id`,
    password: "PasswordAman123!",
  };

  // 4a. Register akun baru
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testNewUser),
  });
  assert(regRes.status === 200, `Registrasi akun ${testNewUser.email} berhasil (HTTP 200)`);
  const regData = await regRes.json();
  assert(regData.ok === true, "Registrasi response ok: true");
  const regCookie = regRes.headers.get("set-cookie") || "";
  assert(regCookie.includes("laras_session="), "Sesi otomatis diberikan saat pendaftaran");

  // 4b. Logout (hapus sesi klien)
  console.log("  Simulasi logout (menghapus cookie sesi)...");

  // 4c. Login kembali dengan akun yang baru didaftarkan
  const reloginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testNewUser.email, password: testNewUser.password }),
  });
  assert(reloginRes.status === 200, `Login kembali akun ${testNewUser.email} BERHASIL (HTTP 200)`);
  const reloginData = await reloginRes.json();
  assert(reloginData.ok === true, "Login kembali response ok: true");
  assert(reloginData.email === testNewUser.email, "Email login kembali sesuai");
  assert(reloginData.name === testNewUser.name, "Nama profil pengguna persisten sesuai");

  // 4d. Verifikasi kata sandi salah tetap ditolak (401)
  const wrongPassRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testNewUser.email, password: "SalahPassword123" }),
  });
  assert(wrongPassRes.status === 401, "Login dengan kata sandi salah ditolak dengan HTTP 401 (Kata sandi salah)");

  console.log("\n==================================================================");
  console.log(`HASIL: ${passed}/${total} PENGUJIAN LULUS (100% SUKSES)`);
  console.log("Semua akun (demo, admin, juri, & akun baru) terbukti dapat login!");
  console.log("==================================================================\n");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
