# Panduan Aset Audio LARAS

Folder ini menyimpan rekaman suara/pelafalan autentik untuk materi bahasa dan budaya Nusantara.

## Konvensi Penamaan & Struktur File
- **Jalur / Path:** `/audio/<slug-lesson>/<id-soal>.mp3`
- **Format:** MP3 (.mp3)
- **Granularitas:** 1 file per kata/frasa kultural

## Contoh Struktur
```
public/audio/
├── salam-adab-tabe/
│   ├── tabe-choice.mp3
│   └── tabe-fact.mp3
└── busana-baju-nggembe/
    └── nggembe-choice.mp3
```

## Integrasi di Kode
Saat file rekaman MP3 sudah siap:
1. Simpan file MP3 pada folder di atas sesuai slug lesson dan id soal.
2. Tambahkan properti `audioUrl: "/audio/<slug-lesson>/<id-soal>.mp3"` pada objek `Question` terkait di `src/lib/lessons.ts`.
3. Tombol putar audio akan otomatis aktif di player `[lessonId]` dan `CulturalGameEngine`.
