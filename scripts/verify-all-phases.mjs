// scripts/verify-all-phases.mjs
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const STORE_PATH = path.join(ROOT_DIR, 'laras_auth_store.json');
const BASE_URL = 'http://localhost:3457';

const results = [];

function record(phase, testNum, desc, status, proof) {
  results.push({ phase, testNum, desc, status, proof });
  console.log(`[${status}] ${phase} - Uji ${testNum}: ${desc} -> ${proof}`);
}

async function run() {
  console.log('================================================================');
  console.log('RANGKAIAN UJI PENERIMAAN FASE 1-5 (SERVER PRODUKSI LOKAL :3457)');
  console.log('================================================================\n');

  // --- FASE 1 ---
  // Uji 1.1: GET /api/auth/jury-credentials
  try {
    const r = await fetch(`${BASE_URL}/api/auth/jury-credentials`);
    const d = await r.json();
    if (r.status === 200 && d.email === 'juri@laras.id' && d.password) {
      record('FASE 1', '1.1', 'Endpoint Kredensial Juri', 'LULUS', `HTTP 200, email=${d.email}`);
    } else {
      record('FASE 1', '1.1', 'Endpoint Kredensial Juri', 'GAGAL', `HTTP ${r.status}, ${JSON.stringify(d)}`);
    }
  } catch (e) {
    record('FASE 1', '1.1', 'Endpoint Kredensial Juri', 'GAGAL', e.message);
  }

  // Uji 1.2: POST /api/auth/login (Jury)
  let juryCookie = '';
  try {
    const r = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'juri@laras.id', password: 'juri-laras-2026' }),
    });
    const d = await r.json();
    juryCookie = r.headers.get('set-cookie') || '';
    if (r.status === 200 && d.isJury === true && d.isAdmin === true) {
      record('FASE 1', '1.2', 'Login Kredensial Juri', 'LULUS', `HTTP 200, isJury=true, isAdmin=true, name="${d.name}"`);
    } else {
      record('FASE 1', '1.2', 'Login Kredensial Juri', 'GAGAL', `HTTP ${r.status}, ${JSON.stringify(d)}`);
    }
  } catch (e) {
    record('FASE 1', '1.2', 'Login Kredensial Juri', 'GAGAL', e.message);
  }

  // Uji 1.3: GET /api/auth/session (Jury)
  try {
    const r = await fetch(`${BASE_URL}/api/auth/session`, { headers: { cookie: juryCookie } });
    const d = await r.json();
    if (r.status === 200 && d.session?.isJury === true) {
      record('FASE 1', '1.3', 'Verifikasi Sesi Juri Server-Side', 'LULUS', `HTTP 200, session.isJury=true`);
    } else {
      record('FASE 1', '1.3', 'Verifikasi Sesi Juri Server-Side', 'GAGAL', `HTTP ${r.status}, ${JSON.stringify(d)}`);
    }
  } catch (e) {
    record('FASE 1', '1.3', 'Verifikasi Sesi Juri Server-Side', 'GAGAL', e.message);
  }

  // Uji 1.4: PUT /api/progress (Jury Write Guard -> HTTP 403)
  try {
    const r = await fetch(`${BASE_URL}/api/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', cookie: juryCookie },
      body: JSON.stringify({ progress: { xp: 999 } }),
    });
    const d = await r.json();
    if (r.status === 403 && d.error === 'Mode demo juri: hanya lihat') {
      record('FASE 1', '1.4', 'Proteksi Route Tulis PUT /api/progress (Juri)', 'LULUS', `HTTP 403, error="${d.error}"`);
    } else {
      record('FASE 1', '1.4', 'Proteksi Route Tulis PUT /api/progress (Juri)', 'GAGAL', `HTTP ${r.status}, ${JSON.stringify(d)}`);
    }
  } catch (e) {
    record('FASE 1', '1.4', 'Proteksi Route Tulis PUT /api/progress (Juri)', 'GAGAL', e.message);
  }

  // Uji 1.5: POST /api/content/entries (Jury Write Guard -> HTTP 403)
  try {
    const r = await fetch(`${BASE_URL}/api/content/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', cookie: juryCookie },
      body: JSON.stringify({ title: 'Test Korpus' }),
    });
    const d = await r.json();
    if (r.status === 403 && d.error === 'Mode demo juri: hanya lihat') {
      record('FASE 1', '1.5', 'Proteksi Route Tulis Konten POST /api/content/entries', 'LULUS', `HTTP 403, error="${d.error}"`);
    } else {
      record('FASE 1', '1.5', 'Proteksi Route Tulis Konten POST /api/content/entries', 'GAGAL', `HTTP ${r.status}, ${JSON.stringify(d)}`);
    }
  } catch (e) {
    record('FASE 1', '1.5', 'Proteksi Route Tulis Konten POST /api/content/entries', 'GAGAL', e.message);
  }

  // Uji 1.6: POST /api/auth/login (Admin Utama)
  let adminCookie = '';
  try {
    const r = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@laras.id', password: 'admin123' }),
    });
    const d = await r.json();
    adminCookie = r.headers.get('set-cookie') || '';
    if (r.status === 200 && d.isAdmin === true && d.isJury === false) {
      record('FASE 1', '1.6', 'Login Admin Utama (Bukan Juri)', 'LULUS', `HTTP 200, isAdmin=true, isJury=false`);
    } else {
      record('FASE 1', '1.6', 'Login Admin Utama (Bukan Juri)', 'GAGAL', `HTTP ${r.status}, ${JSON.stringify(d)}`);
    }
  } catch (e) {
    record('FASE 1', '1.6', 'Login Admin Utama (Bukan Juri)', 'GAGAL', e.message);
  }

  // Uji 1.7: PUT /api/progress (Admin Utama -> BUKAN 403)
  try {
    const r = await fetch(`${BASE_URL}/api/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', cookie: adminCookie },
      body: JSON.stringify({ progress: { xp: 50, streak: 1, hearts: 3 } }),
    });
    const d = await r.json();
    if (r.status === 200 && d.ok === true) {
      record('FASE 1', '1.7', 'Akses Tulis Admin Utama (PUT Progres)', 'LULUS', `HTTP 200 (Bukan 403), source="${d.source}"`);
    } else {
      record('FASE 1', '1.7', 'Akses Tulis Admin Utama (PUT Progres)', 'GAGAL', `HTTP ${r.status}, ${JSON.stringify(d)}`);
    }
  } catch (e) {
    record('FASE 1', '1.7', 'Akses Tulis Admin Utama (PUT Progres)', 'GAGAL', e.message);
  }

  // Uji 1.8: Login Demo Normal
  let demoCookie = '';
  try {
    const r = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@gmail.com', password: 'demo123' }),
    });
    const d = await r.json();
    demoCookie = r.headers.get('set-cookie') || '';
    if (r.status === 200 && d.isAdmin === false && d.isJury === false) {
      record('FASE 1', '1.8', 'Login Akun Demo (Murid Normal)', 'LULUS', `HTTP 200, isAdmin=false, isJury=false`);
    } else {
      record('FASE 1', '1.8', 'Login Akun Demo (Murid Normal)', 'GAGAL', `HTTP ${r.status}, ${JSON.stringify(d)}`);
    }
  } catch (e) {
    record('FASE 1', '1.8', 'Login Akun Demo (Murid Normal)', 'GAGAL', e.message);
  }

  // --- FASE 2 ---
  // Uji 2.1: Akun baru langsung format scrypt$
  const newEmail = `user_prod_${Date.now()}@laras.id`;
  try {
    const r = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Pengguna Scrypt', email: newEmail, password: 'PasswordProd123!' }),
    });
    const d = await r.json();
    const store = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
    const hash = store.users[newEmail]?.passwordHash;
    if (r.status === 200 && hash && hash.startsWith('scrypt$')) {
      record('FASE 2', '2.1', 'Pendaftaran Akun Baru Ber-hash Scrypt Salt', 'LULUS', `HTTP 200, format=${hash.substring(0, 18)}...`);
    } else {
      record('FASE 2', '2.1', 'Pendaftaran Akun Baru Ber-hash Scrypt Salt', 'GAGAL', `Hash=${hash}`);
    }
  } catch (e) {
    record('FASE 2', '2.1', 'Pendaftaran Akun Baru Ber-hash Scrypt Salt', 'GAGAL', e.message);
  }

  // Uji 2.2: Login akun baru
  try {
    const r = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail, password: 'PasswordProd123!' }),
    });
    const d = await r.json();
    if (r.status === 200 && d.ok === true) {
      record('FASE 2', '2.2', 'Login Akun Baru Tersimpan', 'LULUS', `HTTP 200, email=${d.email}`);
    } else {
      record('FASE 2', '2.2', 'Login Akun Baru Tersimpan', 'GAGAL', `HTTP ${r.status}`);
    }
  } catch (e) {
    record('FASE 2', '2.2', 'Login Akun Baru Tersimpan', 'GAGAL', e.message);
  }

  // Uji 2.3: Migrasi transparan akun legacy SHA-256 murni
  const legEmail = `legacy_prod_${Date.now()}@laras.id`;
  const legPass = 'LegacyPass123!';
  const legSha = crypto.createHash('sha256').update(legPass).digest('hex');
  try {
    const store = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
    store.users[legEmail] = {
      name: 'User Legacy',
      email: legEmail,
      passwordHash: legSha,
      isAdmin: false,
      isJury: false,
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');

    const r = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: legEmail, password: legPass }),
    });
    const d = await r.json();

    const updatedStore = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
    const migratedHash = updatedStore.users[legEmail]?.passwordHash;

    if (r.status === 200 && migratedHash && migratedHash.startsWith('scrypt$')) {
      record('FASE 2', '2.3', 'Migrasi Transparan Legacy SHA-256 ke Scrypt', 'LULUS', `Login HTTP 200, hash baru=${migratedHash.substring(0, 18)}...`);
    } else {
      record('FASE 2', '2.3', 'Migrasi Transparan Legacy SHA-256 ke Scrypt', 'GAGAL', `Status ${r.status}, hash=${migratedHash}`);
    }
  } catch (e) {
    record('FASE 2', '2.3', 'Migrasi Transparan Legacy SHA-256 ke Scrypt', 'GAGAL', e.message);
  }

  // --- FASE 3 ---
  // Uji 3.1: Ke-5 berkas gambar lokal
  const images = [
    'artefak-souraja.jpg',
    'culture-scenario-bertamu.jpg',
    'culture-scenario-upacara.jpg',
    'onboarding-hero.jpg',
    'onboarding-nggembe.jpg',
  ];
  let imgSuccess = 0;
  for (const img of images) {
    try {
      const r = await fetch(`${BASE_URL}/images/${img}`);
      if (r.status === 200 && r.headers.get('content-type')?.includes('image/')) {
        imgSuccess++;
      }
    } catch {}
  }
  if (imgSuccess === images.length) {
    record('FASE 3', '3.1', 'Aset Gambar Lokal di public/images/', 'LULUS', `${imgSuccess}/${images.length} gambar merespons HTTP 200 image/jpeg`);
  } else {
    record('FASE 3', '3.1', 'Aset Gambar Lokal di public/images/', 'GAGAL', `Hanya ${imgSuccess}/${images.length} gambar 200`);
  }

  // --- FASE 4 ---
  // Uji 4.1: Fallback lokal jujur
  try {
    const r = await fetch(`${BASE_URL}/api/progress`, { headers: { cookie: demoCookie } });
    const d = await r.json();
    if (r.status === 200 && d.synced === false && d.source === 'fallback_local') {
      record('FASE 4', '4.1', 'Fallback Lokal Jujur & Tanpa Crash 500', 'LULUS', `HTTP 200, synced=false, source="fallback_local"`);
    } else {
      record('FASE 4', '4.1', 'Fallback Lokal Jujur & Tanpa Crash 500', 'GAGAL', `HTTP ${r.status}, source=${d.source}`);
    }
  } catch (e) {
    record('FASE 4', '4.1', 'Fallback Lokal Jujur & Tanpa Crash 500', 'GAGAL', e.message);
  }

  // Uji 4.2: Persistensi progres antar sesi
  try {
    const startRes = await fetch(`${BASE_URL}/api/progress`, { headers: { cookie: demoCookie } });
    const startData = await startRes.json();
    const oldXp = startData.progress?.xp || 0;
    const targetXp = oldXp + 25;

    await fetch(`${BASE_URL}/api/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', cookie: demoCookie },
      body: JSON.stringify({ progress: { ...startData.progress, xp: targetXp } }),
    });

    // Logout
    await fetch(`${BASE_URL}/api/auth/logout`, { method: 'POST', headers: { cookie: demoCookie } });

    // Login ulang
    const relogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@gmail.com', password: 'demo123' }),
    });
    const newDemoCookie = relogin.headers.get('set-cookie');

    // Cek progres
    const checkRes = await fetch(`${BASE_URL}/api/progress`, { headers: { cookie: newDemoCookie } });
    const checkData = await checkRes.json();
    const finalXp = checkData.progress?.xp;

    if (finalXp === targetXp) {
      record('FASE 4', '4.2', 'Persistensi Progres Demo Antar Sesi', 'LULUS', `XP bertambah dari ${oldXp} -> ${finalXp}, bertahan setelah relogin`);
    } else {
      record('FASE 4', '4.2', 'Persistensi Progres Demo Antar Sesi', 'GAGAL', `Expected XP ${targetXp}, got ${finalXp}`);
    }
  } catch (e) {
    record('FASE 4', '4.2', 'Persistensi Progres Demo Antar Sesi', 'GAGAL', e.message);
  }

  // --- FASE 5 ---
  // Uji 5.1: Header Keamanan
  try {
    const r = await fetch(`${BASE_URL}/`);
    const nosniff = r.headers.get('x-content-type-options');
    const referrer = r.headers.get('referrer-policy');
    const csp = r.headers.get('content-security-policy');
    if (nosniff === 'nosniff' && referrer === 'strict-origin-when-cross-origin' && csp === "frame-ancestors 'self'") {
      record('FASE 5', '5.1', 'Tiga Header Keamanan di next.config.ts', 'LULUS', `nosniff, strict-origin-when-cross-origin, frame-ancestors 'self'`);
    } else {
      record('FASE 5', '5.1', 'Tiga Header Keamanan di next.config.ts', 'GAGAL', `nosniff=${nosniff}, referrer=${referrer}, csp=${csp}`);
    }
  } catch (e) {
    record('FASE 5', '5.1', 'Tiga Header Keamanan di next.config.ts', 'GAGAL', e.message);
  }

  console.log('\n================================================================');
  console.log('TABEL HASIL PENGUJIAN AKHIR FASE 1-5');
  console.log('================================================================');
  console.table(results);

  const allPassed = results.every((r) => r.status === 'LULUS');
  console.log(`\nSTATUS KELULUSAN KESELURUHAN: ${allPassed ? 'HIJAU SEMUA (SIAP KE FASE 7)' : 'ADA GAGAL'}`);
}

run().catch(console.error);
