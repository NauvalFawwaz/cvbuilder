# Folio — 18 Templates & Siap Melamar

CV Builder gratis, React + Vite + Tailwind CSS + lucide-react. Semua pengolahan CV, lowongan, dan pencocokan kata/frasa berjalan di browser. Tidak ada backend, database, akun, analytics, atau unggahan data.

## Menjalankan project

Gunakan versi Node.js yang didukung Vite 8 (Node 20.19+ atau 22.12+).

1. Buka folder project ini di VS Code.
2. Jalankan `npm install`.
3. Jalankan `npm run dev`.
4. Buka alamat yang ditampilkan terminal.

Pemeriksaan: `npm test`, `npm run lint`, `npm run build`.

## Yang baru

- 18 template dengan 6 kategori, pencarian, dan variasi urutan bagian dokumen.
- Struktur pendidikan dahulu untuk fresh graduate; keterampilan dahulu untuk pindah bidang; sertifikasi dahulu untuk kredensial; proyek dahulu untuk portofolio.
- Bagian proyek/kegiatan, sertifikasi/pelatihan, dan bahasa, masing-masing dapat ditambah, diubah, diurutkan, dan dihapus.
- Pilihan bahasa judul bagian CV: Indonesia atau Inggris. Isi tulisan pengguna tidak diterjemahkan otomatis.
- Panel Siap Melamar: 12 profil bidang dan 3 tahap karier, delapan pemeriksaan dasar, perbandingan kata/frasa lowongan, dan alat bantu menyusun poin kontribusi.
- Deskripsi lowongan, target karier, dan bagian baru ikut autosave serta backup JSON, tetapi deskripsi lowongan tidak dicetak.
- Backup lama otomatis mendapatkan field baru yang aman; alias `education` dan `linkedIn` tetap didukung.

## Template

ATS Classic, ATS Modern, Professional, Minimal, Creative, Developer, Executive, First Chapter, New Direction, Care, Educator, Blueprint, Ledger, Welcome, People First, Precision, Scholar, Studio.

Semua template dapat digunakan lintas bidang. Label kategori merupakan bantuan memilih, bukan batas kelayakan pekerjaan. Desain berbagi struktur dokumen semantik satu kolom, dengan perbedaan tipografi, aksen, kepadatan, heading, dan urutan bagian.

## Batas analisis yang ditampilkan kepada pengguna

Tidak ada janji diterima kerja atau lolos ATS. Pemeriksaan dasar bukan skor rekrutmen. Pencocokan menggunakan kata/frasa literal (tanpa membedakan kapital dan dengan normalisasi spasi), bukan AI, analisis konteks, verifikasi pengalaman, atau penilaian syarat wajib. Kata/frasa otomatis berasal dari daftar istilah terbatas; pengguna dapat menambahkan istilah secara manual. Isi target lowongan dan kontak tidak dihitung sebagai bukti dalam CV. Istilah yang belum ditemukan tidak otomatis ditambahkan sebagai keterampilan.

Panduan penulisan merujuk pada:
- https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/
- https://ung.edu/career-services/online-career-resources/resumes-cover-letters/accomplishment-statements.php

## Penyimpanan dan backup

Autosave menggunakan `free-cv-builder:v1` di localStorage. Penyimpanan ini tidak terenkripsi, khusus browser serta alamat situs (termasuk port), dan dapat terhapus saat browser data dibersihkan. Ekspor JSON sebelum pindah browser/alamat/perangkat. Impor membatasi berkas hingga 2 MB dan meminta konfirmasi sebelum mengganti draft. Data rusak yang tersimpan tidak ditimpa sampai pengguna melakukan edit.

Panel penyusun poin kontribusi memiliki tiga isian bantu sementara. Isian tersebut tidak disimpan sebelum pengguna memilih menambahkannya sebagai draft proyek. Pengguna kemudian melengkapi nama dan konteks proyek di editor.

## PDF

Klik Download PDF, lalu pilih Save as PDF dalam Chrome/Edge. Gunakan A4, skala 100%, matikan header/footer browser, dan aktifkan background graphics untuk template berwarna. Konten panjang mengalir ke halaman berikutnya. Preview layar menunjukkan dokumen kontinu selebar A4; print preview browser menentukan pemenggalan halaman akhir. Tidak ada watermark, paywall, atau batas ekspor.

## Struktur

- src/components/editor: form modular, pengalaman, pendidikan, proyek, sertifikasi, bahasa
- src/components/preview: dokumen CV sesuai template dan bahasa
- src/components/CareerCoach.jsx: panel Siap Melamar
- src/components/TemplateGallery.jsx: pencarian dan kategori 18 template
- src/data: data kosong dan profil karier
- src/templates: registry template dan urutan bagian
- src/utils: normalisasi, autosave, JSON, pencocokan kata/frasa, pemeriksaan dasar, tes
- src/index.css: gaya aplikasi, template, responsif, dan print A4

## Validasi versi ini

10 tes lulus, ESLint bersih, build produksi berhasil. Browser diuji untuk 18 pilihan template dan urutan bagian, pencarian tanpa hasil, data tambahan, bahasa judul, autosave setelah reload, pencocokan lowongan, draft proyek, serta layout mobile 390 px. Dialog unduh/cetak fisik tidak didukung browser pengujian internal; periksa berkas PDF akhir melalui Chrome/Edge.
