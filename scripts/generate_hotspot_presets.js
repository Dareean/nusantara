const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.join(__dirname, '..', 'public', 'media', 'presets');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Helper to wrap SVG in standard 1200x800 canvas with border and header
function buildCanvas(title, subtitle, content) {
  return `<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1E1714"/>
      <stop offset="100%" stop-color="#2D1F1A"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3A2822"/>
      <stop offset="100%" stop-color="#281A15"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <linearGradient id="tealGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14B8A6"/>
      <stop offset="100%" stop-color="#0F766E"/>
    </linearGradient>
    <linearGradient id="crimsonGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#DC2626"/>
      <stop offset="100%" stop-color="#991B1B"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="800" fill="url(#bgGrad)"/>

  <!-- Subtle cultural decorative pattern border -->
  <rect x="24" y="24" width="1152" height="752" rx="20" fill="none" stroke="#A83B10" stroke-width="2" stroke-opacity="0.3"/>
  <rect x="36" y="36" width="1128" height="728" rx="14" fill="none" stroke="#D97706" stroke-width="1" stroke-dasharray="6,6" stroke-opacity="0.4"/>

  <!-- Top Header Banner -->
  <g transform="translate(60, 50)">
    <rect x="0" y="0" width="140" height="28" rx="14" fill="#A83B10" fill-opacity="0.35"/>
    <text x="70" y="19" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="bold" fill="#FBBF24" text-anchor="middle" letter-spacing="1.5">LARAS • KAILI</text>
    <text x="0" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" letter-spacing="-0.5">${title}</text>
    <text x="0" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" fill="#D6C4B8">${subtitle}</text>
  </g>

  <!-- Content Graphics -->
  ${content}

  <!-- Footer Watermark -->
  <g transform="translate(60, 745)">
    <circle cx="8" cy="8" r="4" fill="#F59E0B" fill-opacity="0.6"/>
    <text x="20" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#A89284" letter-spacing="0.5">Panduan Visual Kebudayaan Kaili — Ketuk pin interaktif di layar</text>
  </g>
</svg>`;
}

const presets = [
  // 1. Bilangan Kaili (Hotspots at 20%, 50%, 80% on X, 30% on Y -> 240, 600, 960 on X, 240 on Y)
  {
    filename: 'bilangan_kaili.webp',
    svg: buildCanvas(
      'Papan Belajar Bilangan Kaili Ledo',
      'Sentuh titik untuk memilih lambang bilangan tradisional (1 sampai 10)',
      `
      <!-- 3 Cards centered at X: 240, 600, 960; Y: 240 -->
      <!-- Card 1: Sa (1) -->
      <g transform="translate(130, 160)" filter="url(#shadow)">
        <rect width="220" height="320" rx="20" fill="url(#cardGrad)" stroke="#A83B10" stroke-width="2"/>
        <circle cx="110" cy="80" r="48" fill="#F59E0B" fill-opacity="0.15"/>
        <text x="110" y="98" font-family="system-ui, sans-serif" font-size="52" font-weight="900" fill="#F59E0B" text-anchor="middle">1</text>
        <text x="110" y="160" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">Sa</text>
        <text x="110" y="195" font-family="system-ui, sans-serif" font-size="15" font-weight="500" fill="#D6C4B8" text-anchor="middle">Satu</text>
        <rect x="50" y="235" width="120" height="36" rx="10" fill="#1E1714" stroke="#F59E0B" stroke-opacity="0.3"/>
        <text x="110" y="258" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#F59E0B" text-anchor="middle">Bilangan Dasar</text>
      </g>

      <!-- Card 2: Lima (5) - Target Answer -->
      <g transform="translate(490, 160)" filter="url(#shadow)">
        <rect width="220" height="320" rx="20" fill="url(#cardGrad)" stroke="#14B8A6" stroke-width="3"/>
        <circle cx="110" cy="80" r="48" fill="#14B8A6" fill-opacity="0.2"/>
        <text x="110" y="98" font-family="system-ui, sans-serif" font-size="52" font-weight="900" fill="#14B8A6" text-anchor="middle">5</text>
        <text x="110" y="160" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">Lima</text>
        <text x="110" y="195" font-family="system-ui, sans-serif" font-size="15" font-weight="500" fill="#D6C4B8" text-anchor="middle">Lima</text>
        <rect x="50" y="235" width="120" height="36" rx="10" fill="#1E1714" stroke="#14B8A6" stroke-opacity="0.4"/>
        <text x="110" y="258" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#14B8A6" text-anchor="middle">Pilihan Utama</text>
      </g>

      <!-- Card 3: Sapulu (10) -->
      <g transform="translate(850, 160)" filter="url(#shadow)">
        <rect width="220" height="320" rx="20" fill="url(#cardGrad)" stroke="#A83B10" stroke-width="2"/>
        <circle cx="110" cy="80" r="48" fill="#F59E0B" fill-opacity="0.15"/>
        <text x="110" y="98" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="#F59E0B" text-anchor="middle">10</text>
        <text x="110" y="160" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">Sapulu</text>
        <text x="110" y="195" font-family="system-ui, sans-serif" font-size="15" font-weight="500" fill="#D6C4B8" text-anchor="middle">Sepuluh</text>
        <rect x="50" y="235" width="120" height="36" rx="10" fill="#1E1714" stroke="#F59E0B" stroke-opacity="0.3"/>
        <text x="110" y="258" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#F59E0B" text-anchor="middle">Puluhan Genap</text>
      </g>

      <!-- Counter dots decoration at bottom -->
      <g transform="translate(300, 560)">
        <text x="300" y="0" font-family="system-ui, sans-serif" font-size="15" font-weight="600" fill="#A89284" text-anchor="middle">Kaili Ledo: Sa (1), Roa (2), Tolu (3), Opat (4), Lima (5), Ono (6), Pitu (7), Walu (8), Sio (9), Sapulu (10)</text>
      </g>
      `
    )
  },

  // 2. Waktu Kaili (Hotspots at 20%, 50%, 80% on X, 25% on Y -> 240, 600, 960 on X, 200 on Y)
  {
    filename: 'waktu_kaili.webp',
    svg: buildCanvas(
      'Siklus Waktu Tradisional Kaili Ledo',
      'Simbol kosmis dan penanda pergantian waktu: fajar, malam, dan musim',
      `
      <!-- 3 Celestial Spheres centered at X: 240, 600, 960; Y: 200 -->
      <!-- 1. Fajar (Ndokona) -->
      <g transform="translate(130, 120)" filter="url(#shadow)">
        <rect width="220" height="340" rx="24" fill="url(#cardGrad)" stroke="#F59E0B" stroke-width="2"/>
        <circle cx="110" cy="80" r="44" fill="#F59E0B"/>
        <!-- Sun rays -->
        <path d="M110,20 L110,12 M110,148 L110,140 M50,80 L42,80 M178,80 L170,80 M68,38 L62,32 M158,128 L152,122 M68,122 L62,128 M158,38 L152,32" stroke="#FDE68A" stroke-width="3" stroke-linecap="round"/>
        <text x="110" y="180" font-family="system-ui, sans-serif" font-size="24" font-weight="800" fill="#FFFFFF" text-anchor="middle">Ndokona</text>
        <text x="110" y="210" font-family="system-ui, sans-serif" font-size="15" font-weight="600" fill="#F59E0B" text-anchor="middle">Pagi / Fajar</text>
        <text x="110" y="245" font-family="system-ui, sans-serif" font-size="12" fill="#D6C4B8" text-anchor="middle">Matahari terbit</text>
        <text x="110" y="265" font-family="system-ui, sans-serif" font-size="12" fill="#D6C4B8" text-anchor="middle">di balik lembah</text>
      </g>

      <!-- 2. Bulan (Bengi) - Target Answer -->
      <g transform="translate(490, 120)" filter="url(#shadow)">
        <rect width="220" height="340" rx="24" fill="url(#cardGrad)" stroke="#14B8A6" stroke-width="3"/>
        <circle cx="110" cy="80" r="44" fill="#0F766E"/>
        <!-- Crescent Moon -->
        <path d="M115,48 A32,32 0 1,1 115,112 A26,26 0 1,0 115,48 Z" fill="#5EEAD4"/>
        <circle cx="80" cy="60" r="3" fill="#FFFFFF"/>
        <circle cx="140" cy="65" r="2" fill="#FFFFFF"/>
        <circle cx="130" cy="100" r="2.5" fill="#FFFFFF"/>
        <text x="110" y="180" font-family="system-ui, sans-serif" font-size="24" font-weight="800" fill="#FFFFFF" text-anchor="middle">Bengi</text>
        <text x="110" y="210" font-family="system-ui, sans-serif" font-size="15" font-weight="600" fill="#14B8A6" text-anchor="middle">Malam Hari</text>
        <text x="110" y="245" font-family="system-ui, sans-serif" font-size="12" fill="#D6C4B8" text-anchor="middle">Bulan &amp; bintang</text>
        <text x="110" y="265" font-family="system-ui, sans-serif" font-size="12" fill="#D6C4B8" text-anchor="middle">waktu hening beristirahat</text>
      </g>

      <!-- 3. Musim (Pae) -->
      <g transform="translate(850, 120)" filter="url(#shadow)">
        <rect width="220" height="340" rx="24" fill="url(#cardGrad)" stroke="#A83B10" stroke-width="2"/>
        <circle cx="110" cy="80" r="44" fill="#78350F"/>
        <!-- Rice grain motif -->
        <path d="M110,45 Q125,75 110,115 Q95,75 110,45 Z" fill="#FBBF24"/>
        <path d="M90,65 Q110,80 130,95" stroke="#78350F" stroke-width="2" fill="none"/>
        <text x="110" y="180" font-family="system-ui, sans-serif" font-size="24" font-weight="800" fill="#FFFFFF" text-anchor="middle">Pae</text>
        <text x="110" y="210" font-family="system-ui, sans-serif" font-size="15" font-weight="600" fill="#F59E0B" text-anchor="middle">Tahun / Musim Panen</text>
        <text x="110" y="245" font-family="system-ui, sans-serif" font-size="12" fill="#D6C4B8" text-anchor="middle">Siklus tahunan</text>
        <text x="110" y="265" font-family="system-ui, sans-serif" font-size="12" fill="#D6C4B8" text-anchor="middle">padi dan perayaan</text>
      </g>

      <!-- Flow Arrow -->
      <g transform="translate(370, 290)">
        <path d="M0,0 L80,0" stroke="#F59E0B" stroke-width="2" stroke-dasharray="4,4"/>
        <polygon points="80,-5 90,0 80,5" fill="#F59E0B"/>
      </g>
      <g transform="translate(730, 290)">
        <path d="M0,0 L80,0" stroke="#F59E0B" stroke-width="2" stroke-dasharray="4,4"/>
        <polygon points="80,-5 90,0 80,5" fill="#F59E0B"/>
      </g>
      `
    )
  },

  // 3. Transportasi Kaili (Hotspots at: Kapudara 50%/15% -> 600, 120; Oto 65%/50% -> 780, 400; Sakaya 30%/60% -> 360, 480)
  {
    filename: 'transportasi_kaili.webp',
    svg: buildCanvas(
      'Lanskap Teluk Palu dan Sarana Mobilitas',
      'Tiga dimensi transportasi: udara di atas lembah, darat di pesisir, air di teluk',
      `
      <!-- Sky and Mountains Backdrop -->
      <path d="M60,320 L250,180 L480,260 L750,160 L1000,240 L1140,200 L1140,500 L60,500 Z" fill="#201815" opacity="0.6"/>
      <path d="M60,420 Q300,380 600,430 T1140,420 L1140,700 L60,700 Z" fill="#0F3832"/>

      <!-- 1. Udara (Kapudara) at X: 600, Y: 120 (50%, 15%) -->
      <g transform="translate(480, 70)" filter="url(#shadow)">
        <rect width="240" height="90" rx="16" fill="url(#cardGrad)" stroke="#A83B10" stroke-width="1.5"/>
        <!-- Plane icon -->
        <path d="M50,45 L110,45 L130,25 L145,25 L135,45 L180,45 L190,35 L200,35 L195,48 L120,48 L100,65 L85,65 L95,48 Z" fill="#F59E0B"/>
        <text x="120" y="78" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF" text-anchor="middle">Kapudara (Pesawat)</text>
      </g>

      <!-- 2. Darat (Oto) at X: 780, Y: 400 (65%, 50%) -->
      <g transform="translate(660, 340)" filter="url(#shadow)">
        <rect width="240" height="110" rx="16" fill="url(#cardGrad)" stroke="#A83B10" stroke-width="1.5"/>
        <!-- Bus/car icon -->
        <rect x="40" y="25" width="80" height="40" rx="6" fill="#D97706"/>
        <rect x="50" y="32" width="22" height="16" rx="2" fill="#FEF3C7"/>
        <rect x="80" y="32" width="22" height="16" rx="2" fill="#FEF3C7"/>
        <circle cx="55" cy="65" r="8" fill="#1C1917"/>
        <circle cx="105" cy="65" r="8" fill="#1C1917"/>
        <text x="150" y="48" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#FFFFFF">Oto</text>
        <text x="150" y="68" font-family="system-ui, sans-serif" font-size="12" fill="#D6C4B8">Mobil / Kendaraan Darat</text>
      </g>

      <!-- 3. Air (Sakaya) at X: 360, Y: 480 (30%, 60%) - Target Answer -->
      <g transform="translate(220, 410)" filter="url(#shadow)">
        <rect width="280" height="140" rx="20" fill="url(#cardGrad)" stroke="#14B8A6" stroke-width="3"/>
        <!-- Traditional outrigger boat (Sakaya) -->
        <path d="M40,75 Q90,95 180,75 L170,60 L50,60 Z" fill="#F59E0B"/>
        <!-- Sail -->
        <polygon points="110,15 160,55 110,55" fill="#14B8A6"/>
        <!-- Outrigger float -->
        <rect x="35" y="85" width="145" height="6" rx="3" fill="#5EEAD4"/>
        <line x1="70" y1="75" x2="65" y2="85" stroke="#FFFFFF" stroke-width="2"/>
        <line x1="140" y1="75" x2="135" y2="85" stroke="#FFFFFF" stroke-width="2"/>
        <text x="220" y="60" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#5EEAD4">Sakaya</text>
        <text x="220" y="82" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#FFFFFF">Perahu Nelayan</text>
        <text x="220" y="100" font-family="system-ui, sans-serif" font-size="11" fill="#D6C4B8">Transportasi air Teluk Palu</text>
      </g>
      `
    )
  },

  // 4. Dialog Sapaan (Hotspots at: Tamu/Penyapa 25%/45% -> 300, 360; Tuan Rumah/Penjawab 70%/45% -> 840, 360)
  {
    filename: 'dialog_sapaan.webp',
    svg: buildCanvas(
      'Perjumpaan Warga di Serambi Banua',
      'Etika tegur sapa hangat antara tamu dan tuan rumah di serambi rumah panggung',
      `
      <!-- Serambi Veranda Floor and Railings -->
      <rect x="100" y="520" width="1000" height="24" rx="4" fill="#78350F"/>
      <rect x="120" y="544" width="960" height="120" fill="#451A03" opacity="0.6"/>

      <!-- Tamu (Penyapa) at X: 300, Y: 360 (25%, 45%) -->
      <g transform="translate(180, 200)" filter="url(#shadow)">
        <rect width="250" height="300" rx="20" fill="url(#cardGrad)" stroke="#F59E0B" stroke-width="2"/>
        <circle cx="125" cy="70" r="36" fill="#F59E0B" fill-opacity="0.2"/>
        <circle cx="125" cy="65" r="26" fill="#FDBA74"/>
        <!-- Torso with hand to chest -->
        <path d="M85,140 Q125,120 165,140 L160,220 L90,220 Z" fill="#9A3412"/>
        <text x="125" y="245" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#FFFFFF" text-anchor="middle">Tamu (Penyapa)</text>
        <text x="125" y="270" font-family="system-ui, sans-serif" font-size="13" fill="#F59E0B" text-anchor="middle">"Tabe, komi mambura..."</text>
      </g>

      <!-- Speech Bubble Center -->
      <g transform="translate(480, 280)">
        <rect width="240" height="70" rx="16" fill="#1C1917" stroke="#D97706" stroke-width="1.5"/>
        <text x="120" y="32" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#D6C4B8" text-anchor="middle">Dialog Santun Kaili</text>
        <text x="120" y="52" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#FBBF24" text-anchor="middle">"Kareba roa!"</text>
      </g>

      <!-- Tuan Rumah (Penjawab) at X: 840, Y: 360 (70%, 45%) - Target Answer -->
      <g transform="translate(710, 200)" filter="url(#shadow)">
        <rect width="260" height="300" rx="20" fill="url(#cardGrad)" stroke="#14B8A6" stroke-width="3"/>
        <circle cx="130" cy="70" r="36" fill="#14B8A6" fill-opacity="0.2"/>
        <circle cx="130" cy="65" r="26" fill="#FED7AA"/>
        <!-- Torso smiling welcoming -->
        <path d="M90,140 Q130,120 170,140 L165,220 L95,220 Z" fill="#0F766E"/>
        <text x="130" y="245" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#5EEAD4" text-anchor="middle">Tuan Rumah Ramah</text>
        <text x="130" y="270" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Menjawab: "Kareba roa"</text>
      </g>
      `
    )
  },

  // 5. Tetua Souraja (Hotspots at: Pemuda 20%/50% -> 240, 400; Tetua-pue 65%/45% -> 780, 360)
  {
    filename: 'tetua_souraja.webp',
    svg: buildCanvas(
      'Musyawarah Bersama Tetua Adat Kaili',
      'Penghormatan kepada sosok tetua adat (Pue) dalam musyawarah ruang Souraja',
      `
      <!-- Souraja Carved Wooden Pillar Background -->
      <rect x="520" y="100" width="40" height="580" fill="#78350F" opacity="0.4"/>
      <rect x="510" y="140" width="60" height="20" fill="#B45309" opacity="0.5"/>
      <rect x="510" y="380" width="60" height="20" fill="#B45309" opacity="0.5"/>

      <!-- 1. Pemuda at X: 240, Y: 400 (20%, 50%) -->
      <g transform="translate(110, 250)" filter="url(#shadow)">
        <rect width="250" height="300" rx="20" fill="url(#cardGrad)" stroke="#A83B10" stroke-width="2"/>
        <circle cx="125" cy="70" r="32" fill="#FED7AA"/>
        <path d="M85,135 Q125,120 165,135 L155,220 L95,220 Z" fill="#B45309"/>
        <text x="125" y="245" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#FFFFFF" text-anchor="middle">Generasi Muda</text>
        <text x="125" y="270" font-family="system-ui, sans-serif" font-size="13" fill="#D6C4B8" text-anchor="middle">Menyampaikan salam hormat</text>
      </g>

      <!-- 2. Tetua Adat (Pue) at X: 780, Y: 360 (65%, 45%) - Target Answer -->
      <g transform="translate(650, 190)" filter="url(#shadow)">
        <rect width="280" height="340" rx="22" fill="url(#cardGrad)" stroke="#14B8A6" stroke-width="3"/>
        <circle cx="140" cy="75" r="40" fill="#14B8A6" fill-opacity="0.2"/>
        <circle cx="140" cy="70" r="32" fill="#FDBA74"/>
        <!-- Siga headdress on elder -->
        <polygon points="105,50 140,25 175,50 140,42" fill="#DC2626"/>
        <polygon points="120,40 140,22 160,40" fill="#F59E0B"/>
        <!-- Noble robe -->
        <path d="M90,145 Q140,125 190,145 L180,250 L100,250 Z" fill="#7F1D1D"/>
        <!-- Golden trim -->
        <line x1="140" y1="140" x2="140" y2="250" stroke="#F59E0B" stroke-width="4"/>
        <text x="140" y="275" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="#5EEAD4" text-anchor="middle">Tetua Adat (Pue)</text>
        <text x="140" y="300" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Tokoh panutan yang dihormati</text>
      </g>
      `
    )
  },

  // 6. Peragaan Nggembe (Hotspots at: Baju Nggembe 50%/35% -> 600, 280; Buya Sabe 50%/75% -> 600, 600)
  {
    filename: 'peragaan_nggembe.webp',
    svg: buildCanvas(
      'Perpaduan Busana Adat Kaili Lengkap',
      'Anatomi busana adat wanita: atasan longgar Baju Nggembe dan sarung sutra tenun Buya Sabe',
      `
      <!-- Full Mannequin Center Display -->
      <g transform="translate(420, 150)" filter="url(#shadow)">
        <!-- Mannequin Stand -->
        <line x1="180" y1="60" x2="180" y2="520" stroke="#78350F" stroke-width="8"/>
        <ellipse cx="180" cy="520" rx="90" ry="16" fill="#1C1917"/>

        <!-- 1. Baju Nggembe at top (50%, 35% -> relative Y ~130 inside group) -->
        <g id="baju-nggembe-box">
          <rect x="30" y="60" width="300" height="170" rx="18" fill="url(#cardGrad)" stroke="#F59E0B" stroke-width="2"/>
          <!-- Wide square neck blouse illustration -->
          <path d="M90,80 L140,80 L140,110 L220,110 L220,80 L270,80 L300,180 L250,190 L240,160 L120,160 L110,190 L60,180 Z" fill="#DC2626"/>
          <!-- Gold border along collar -->
          <rect x="135" y="105" width="90" height="8" rx="2" fill="#F59E0B"/>
          <text x="180" y="215" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF" text-anchor="middle">Baju Nggembe (Kerah Persegi)</text>
        </g>

        <!-- 2. Buya Sabe at bottom (50%, 75% -> relative Y ~380 inside group) - Target Answer -->
        <g id="buya-sabe-box" transform="translate(0, 250)">
          <rect x="30" y="60" width="300" height="190" rx="18" fill="url(#cardGrad)" stroke="#14B8A6" stroke-width="3"/>
          <!-- Donggala woven sarong with wave pattern -->
          <rect x="80" y="80" width="200" height="120" rx="6" fill="#831843"/>
          <path d="M80,105 Q130,95 180,105 T280,105" stroke="#F59E0B" stroke-width="3" fill="none"/>
          <path d="M80,135 Q130,125 180,135 T280,135" stroke="#F59E0B" stroke-width="3" fill="none"/>
          <path d="M80,165 Q130,155 180,165 T280,165" stroke="#F59E0B" stroke-width="3" fill="none"/>
          <text x="180" y="232" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#5EEAD4" text-anchor="middle">Buya Sabe (Sarung Donggala)</text>
        </g>
      </g>
      `
    )
  },

  // 7. Busana Pria Kaili (Hotspots at: Siga 50%/18% -> 600, 144; Baju Koje 50%/45% -> 600, 360)
  {
    filename: 'busana_pria_kaili.webp',
    svg: buildCanvas(
      'Anatomi Busana Tradisional Pria Kaili',
      'Kelengkapan busana pria: penutup kepala Siga dan baju kurung berkerah tegak Baju Koje',
      `
      <!-- Center Display Panel -->
      <g transform="translate(420, 100)" filter="url(#shadow)">
        <!-- 1. Siga (50%, 18% -> top box) - Target Answer -->
        <g id="siga-box">
          <rect x="20" y="10" width="320" height="160" rx="18" fill="url(#cardGrad)" stroke="#14B8A6" stroke-width="3"/>
          <!-- Siga folded headdress -->
          <polygon points="180,30 110,95 250,95" fill="#DC2626"/>
          <polygon points="180,45 130,95 230,95" fill="#B91C1C"/>
          <polygon points="180,30 160,70 200,70" fill="#F59E0B"/>
          <text x="180" y="130" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#5EEAD4" text-anchor="middle">Siga (Ikat Kepala Adat)</text>
          <text x="180" y="152" font-family="system-ui, sans-serif" font-size="12" fill="#D6C4B8" text-anchor="middle">Simbol kehormatan dan martabat pria</text>
        </g>

        <!-- 2. Baju Koje (50%, 45% -> center box) -->
        <g id="koje-box" transform="translate(0, 190)">
          <rect x="20" y="20" width="320" height="200" rx="18" fill="url(#cardGrad)" stroke="#F59E0B" stroke-width="2"/>
          <!-- Baju Koje tunic illustration -->
          <path d="M120,40 L150,40 L150,55 L210,55 L210,40 L240,40 L270,120 L230,130 L220,170 L140,170 L130,130 L90,120 Z" fill="#1E293B"/>
          <!-- Mandarin collar & gold buttons -->
          <rect x="155" y="45" width="50" height="15" rx="3" fill="#D97706"/>
          <circle cx="180" cy="80" r="4" fill="#F59E0B"/>
          <circle cx="180" cy="110" r="4" fill="#F59E0B"/>
          <circle cx="180" cy="140" r="4" fill="#F59E0B"/>
          <text x="180" y="195" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF" text-anchor="middle">Baju Koje (Tubuh / Kemeja)</text>
        </g>
      </g>
      `
    )
  },

  // 8. Gestur Melintas (Hotspots at: Pandangan 45%/25% -> 540, 200; Tangan Bawah 45%/65% -> 540, 520)
  {
    filename: 'gestur_melintas.webp',
    svg: buildCanvas(
      'Peragaan Sikap Melintas di Hadapan Tetua',
      'Etika fisik adab Tabe: pandangan teduh menunduk dan tangan kanan merendah ke lantai',
      `
      <g transform="translate(360, 110)" filter="url(#shadow)">
        <!-- Card Frame -->
        <rect width="480" height="540" rx="24" fill="url(#cardGrad)" stroke="#A83B10" stroke-width="2"/>

        <!-- 1. Pandangan Teduh at (45%, 25% -> relative ~Y: 90) -->
        <g transform="translate(40, 30)">
          <rect width="400" height="160" rx="16" fill="#1C1917" stroke="#F59E0B" stroke-width="1.5"/>
          <!-- Head tilted downward in respect -->
          <circle cx="200" cy="65" r="32" fill="#FED7AA"/>
          <path d="M190,75 Q200,85 210,75" stroke="#78350F" stroke-width="2" fill="none"/>
          <text x="200" y="125" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF" text-anchor="middle">Pandangan Teduh (Menunduk)</text>
          <text x="200" y="145" font-family="system-ui, sans-serif" font-size="12" fill="#D6C4B8" text-anchor="middle">Mata menatap lantai dengan rendah hati</text>
        </g>

        <!-- 2. Tangan Merendah at (45%, 65% -> relative ~Y: 300) - Target Answer -->
        <g transform="translate(40, 240)">
          <rect width="400" height="200" rx="16" fill="#1C1917" stroke="#14B8A6" stroke-width="3"/>
          <!-- Right arm extended downward gracefully -->
          <path d="M160,40 Q180,90 200,140 L210,135 Q190,85 175,35 Z" fill="#FED7AA"/>
          <!-- Hand pointing down -->
          <polygon points="195,135 205,170 215,135" fill="#FDBA74"/>
          <text x="200" y="175" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#5EEAD4" text-anchor="middle">Tangan Kanan Merendah</text>
          <text x="200" y="195" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Gestur utama adab Tabe saat melintas</text>
        </g>
      </g>
      `
    )
  },

  // 9. Denah Souraja (Hotspots at: Ruang Dalam 35%/40% -> 420, 320; Gandaria 75%/40% -> 900, 320)
  {
    filename: 'denah_souraja.webp',
    svg: buildCanvas(
      'Denah Zonasi Tata Ruang Souraja (Banua Oge)',
      'Pembagian ruang adat: serambi depan (Gandaria) untuk penyambutan dan ruang dalam keluarga',
      `
      <!-- Blueprint Grid Canvas -->
      <g transform="translate(100, 140)" filter="url(#shadow)">
        <rect width="1000" height="480" rx="20" fill="#0F172A" stroke="#38BDF8" stroke-width="2" stroke-opacity="0.6"/>

        <!-- Grid lines -->
        <line x1="500" y1="0" x2="500" y2="480" stroke="#38BDF8" stroke-width="1" stroke-dasharray="6,6" stroke-opacity="0.3"/>
        <line x1="750" y1="0" x2="750" y2="480" stroke="#38BDF8" stroke-width="1" stroke-dasharray="6,6" stroke-opacity="0.3"/>

        <!-- 1. Ruang Dalam (35%, 40% -> X: 20-480) -->
        <g transform="translate(40, 50)">
          <rect width="420" height="380" rx="14" fill="#1E293B" stroke="#A83B10" stroke-width="2"/>
          <text x="210" y="140" font-family="system-ui, sans-serif" font-size="24" font-weight="900" fill="#FFFFFF" text-anchor="middle">Ruang Dalam</text>
          <text x="210" y="175" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#F59E0B" text-anchor="middle">Lonta Karavana / Keluarga</text>
          <text x="210" y="215" font-family="system-ui, sans-serif" font-size="12" fill="#94A3B8" text-anchor="middle">Area privasi keluarga inti &amp; bilik tidur</text>
          <rect x="140" y="250" width="140" height="32" rx="8" fill="#334155"/>
          <text x="210" y="271" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#E2E8F0" text-anchor="middle">Zona Privat</text>
        </g>

        <!-- 2. Gandaria (Serambi Depan) (75%, 40% -> X: 520-960) - Target Answer -->
        <g transform="translate(520, 50)">
          <rect width="440" height="380" rx="14" fill="#1E293B" stroke="#14B8A6" stroke-width="3"/>
          <text x="220" y="140" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#5EEAD4" text-anchor="middle">Gandaria (Serambi)</text>
          <text x="220" y="175" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="#FFFFFF" text-anchor="middle">Ruang Penerimaan Tamu Depan</text>
          <text x="220" y="215" font-family="system-ui, sans-serif" font-size="13" fill="#CBD5E1" text-anchor="middle">Beralas papan panggung luas untuk menyambut tamu</text>
          <rect x="140" y="250" width="160" height="36" rx="8" fill="#0F766E"/>
          <text x="220" y="273" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle">Zona Publik Adat</text>
        </g>
      </g>
      `
    )
  },

  // 10. Monumen Nosarara (Hotspots at: Gong 50%/35% -> 600, 280; Ikatan 50%/70% -> 600, 560)
  {
    filename: 'monumen_nosarara.webp',
    svg: buildCanvas(
      'Monumen Persaudaraan Nosarara Nosabatutu',
      'Simbol persatuan dan perdamaian abadi masyarakat Palu di atas bukit Jabal Nur',
      `
      <g transform="translate(350, 110)" filter="url(#shadow)">
        <rect width="500" height="560" rx="24" fill="url(#cardGrad)" stroke="#A83B10" stroke-width="2"/>

        <!-- 1. Gong Perdamaian Nusantara (50%, 35%) - Target Answer -->
        <g transform="translate(50, 30)">
          <rect width="400" height="230" rx="18" fill="#1C1917" stroke="#14B8A6" stroke-width="3"/>
          <!-- Bronze Gong Graphic -->
          <circle cx="200" cy="95" r="60" fill="url(#goldGrad)"/>
          <circle cx="200" cy="95" r="45" fill="#78350F" stroke="#F59E0B" stroke-width="3"/>
          <circle cx="200" cy="95" r="18" fill="url(#goldGrad)"/>
          <text x="200" y="185" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="#5EEAD4" text-anchor="middle">Gong Perdamaian</text>
          <text x="200" y="210" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Simbol harmoni &amp; persatuan bangsa</text>
        </g>

        <!-- 2. Tali Persaudaraan (50%, 70%) -->
        <g transform="translate(50, 290)">
          <rect width="400" height="210" rx="18" fill="#1C1917" stroke="#F59E0B" stroke-width="1.5"/>
          <!-- Relief intertwined rope graphic -->
          <path d="M100,70 Q150,40 200,70 T300,70" stroke="#F59E0B" stroke-width="8" fill="none"/>
          <path d="M100,70 Q150,100 200,70 T300,70" stroke="#D97706" stroke-width="8" fill="none"/>
          <text x="200" y="130" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#FFFFFF" text-anchor="middle">Tali Persaudaraan</text>
          <text x="200" y="155" font-family="system-ui, sans-serif" font-size="13" fill="#D6C4B8" text-anchor="middle">Ikatan erat nilai Nosarara Nosabatutu</text>
        </g>
      </g>
      `
    )
  },

  // 11. Perayaan Padungku (Hotspots at: Masak Bambu 40%/55% -> 480, 440; Meja Jamuan 80%/40% -> 960, 320)
  {
    filename: 'perayaan_padungku.webp',
    svg: buildCanvas(
      'Suasana Memasak Bersama dalam Tradisi Padungku',
      'Semangat syukur panen raya: memasak nasi bambu di perapian dan jamuan makan bersama',
      `
      <!-- Warm Festival Hearth & Gathering Display -->
      <!-- 1. Masakan Bambu at X: 480, Y: 440 (40%, 55%) - Target Answer -->
      <g transform="translate(140, 250)" filter="url(#shadow)">
        <rect width="440" height="340" rx="22" fill="url(#cardGrad)" stroke="#14B8A6" stroke-width="3"/>
        <!-- Hearth flames -->
        <path d="M100,240 Q130,170 150,240 Q180,150 210,240 Q240,180 270,240 Z" fill="url(#crimsonGrad)"/>
        <!-- Slanted green bamboo tubes -->
        <rect x="130" y="90" width="22" height="150" rx="8" fill="#15803D" transform="rotate(-15 130 90)"/>
        <rect x="175" y="80" width="22" height="160" rx="8" fill="#16A34A" transform="rotate(-10 175 80)"/>
        <rect x="220" y="85" width="22" height="155" rx="8" fill="#15803D" transform="rotate(-5 220 85)"/>
        <text x="220" y="275" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#5EEAD4" text-anchor="middle">Masakan Bambu</text>
        <text x="220" y="302" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Beras ketan dimasak dalam bilah bambu</text>
      </g>

      <!-- 2. Meja Jamuan at X: 960, Y: 320 (80%, 40%) -->
      <g transform="translate(640, 180)" filter="url(#shadow)">
        <rect width="440" height="320" rx="22" fill="url(#cardGrad)" stroke="#F59E0B" stroke-width="2"/>
        <!-- Feast table graphic with plates -->
        <ellipse cx="220" cy="140" rx="160" ry="60" fill="#78350F"/>
        <ellipse cx="220" cy="135" rx="150" ry="50" fill="#B45309"/>
        <circle cx="160" cy="135" r="22" fill="#FEF3C7"/>
        <circle cx="220" cy="130" r="26" fill="#FDE68A"/>
        <circle cx="280" cy="135" r="22" fill="#FEF3C7"/>
        <text x="220" y="235" font-family="system-ui, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF" text-anchor="middle">Meja Jamuan Warga</text>
        <text x="220" y="265" font-family="system-ui, sans-serif" font-size="13" fill="#D6C4B8" text-anchor="middle">Tempat berkumpulnya tetangga &amp; tamu</text>
      </g>
      `
    )
  },

  // 12. Desa Kaili (Hotspots at: Pos Ronda 25%/55% -> 300, 440; Balai Warga 70%/45% -> 840, 360)
  {
    filename: 'desa_kaili.webp',
    svg: buildCanvas(
      'Kehidupan Guyub Rukun di Desa Kaili',
      'Pusat kegiatan gotong royong: pos ronda penjaga malam dan balai musyawarah desa',
      `
      <!-- Mountain Skyline -->
      <path d="M60,350 L280,240 L520,310 L800,200 L1050,300 L1140,260 L1140,550 L60,550 Z" fill="#201815" opacity="0.6"/>

      <!-- 1. Pos Ronda at X: 300, Y: 440 (25%, 55%) - Target Answer -->
      <g transform="translate(130, 270)" filter="url(#shadow)">
        <rect width="360" height="320" rx="20" fill="url(#cardGrad)" stroke="#14B8A6" stroke-width="3"/>
        <!-- Small wooden hut with gong/kentongan -->
        <polygon points="180,60 100,110 260,110" fill="#B45309"/>
        <rect x="120" y="110" width="120" height="90" fill="#78350F"/>
        <!-- Kentongan slit drum -->
        <rect x="200" y="125" width="16" height="50" rx="4" fill="#F59E0B"/>
        <text x="180" y="240" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#5EEAD4" text-anchor="middle">Pos Ronda</text>
        <text x="180" y="268" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Pusat koordinasi keamanan &amp; ronda warga</text>
      </g>

      <!-- 2. Balai Warga at X: 840, Y: 360 (70%, 45%) -->
      <g transform="translate(600, 200)" filter="url(#shadow)">
        <rect width="460" height="340" rx="20" fill="url(#cardGrad)" stroke="#F59E0B" stroke-width="2"/>
        <!-- Community Hall building -->
        <polygon points="230,40 100,110 360,110" fill="#9A3412"/>
        <rect x="130" y="110" width="200" height="120" fill="#78350F"/>
        <!-- Windows and open door -->
        <rect x="160" y="130" width="40" height="40" rx="4" fill="#FEF3C7"/>
        <rect x="260" y="130" width="40" height="40" rx="4" fill="#FEF3C7"/>
        <rect x="210" y="170" width="40" height="60" fill="#451A03"/>
        <text x="230" y="265" font-family="system-ui, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF" text-anchor="middle">Balai Warga</text>
        <text x="230" y="292" font-family="system-ui, sans-serif" font-size="13" fill="#D6C4B8" text-anchor="middle">Ruang musyawarah &amp; mufakat bersama</text>
      </g>
      `
    )
  }
];

async function generateAll() {
  console.log(`Generating ${presets.length} WebP hotspot presets in:`, targetDir);
  for (const item of presets) {
    const dest = path.join(targetDir, item.filename);
    try {
      const buffer = Buffer.from(item.svg, 'utf8');
      await sharp(buffer)
        .webp({ quality: 92 })
        .toFile(dest);
      const stat = fs.statSync(dest);
      console.log(`✔ Created ${item.filename} (${(stat.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`✘ Failed to generate ${item.filename}:`, err);
    }
  }
  console.log('Finished generating all hotspot presets.');
}

generateAll();
