# PowerGrid HV (Titan #20)
### 500 kV Substation SCADA, 60 FPS 3-Phase Sinusoidal Canvas, IBT 500 MVA Transformer & PLN UIP2B Dispatching ERP

![PowerGrid Architecture](https://img.shields.io/badge/Architecture-Client--Side%20Local--First-cyan?style=for-the-badge)
![Compliance](https://img.shields.io/badge/Compliance-PLN%20Grid%20Code%20%26%20IEEE%20C37.113-emerald?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16%20App%20Router-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)

---

## 🌐 Live Production Deployments
- **500 kV Substation Single-Line Diagram:** [https://olyxmintabansos-byte.github.io/powergrid-hv/](https://olyxmintabansos-byte.github.io/powergrid-hv/)
- **IBT 500 MVA Transformer & DGA Desk:** [https://olyxmintabansos-byte.github.io/powergrid-hv/transformer/](https://olyxmintabansos-byte.github.io/powergrid-hv/transformer/)
- **Numerical Distance Relay & R-X Studio:** [https://olyxmintabansos-byte.github.io/powergrid-hv/relay/](https://olyxmintabansos-byte.github.io/powergrid-hv/relay/)
- **PLN UIP2B Switching Order A4 Studio:** [https://olyxmintabansos-byte.github.io/powergrid-hv/dispatch/](https://olyxmintabansos-byte.github.io/powergrid-hv/dispatch/)

---

## 📐 Arsitektur & Fitur Utama

1. **500 kV Substation Single-Line Diagram (`/`)**:
   - Pemantauan telemetri 4 bay transmisi tegangan ekstra tinggi (Bay Cirata 1, Ungaran 2, Mandirancan, dan IBT 500).
   - Pengoperasian interaktif Pemutus Tenaga (*Circuit Breakers* - CB) dan Pemisah (*Disconnect Switches* - DS) dengan skema 1.5 Breaker.
   - Layar osiloskop tegangan sinus 3 fasa (R, S, T dengan pergeseran sudut 120°) berkecepatan **60 FPS** berbasis HTML5 Canvas yang berosilasi mengikuti frekuensi grid (50.00 Hz).
   - Tombol pengaman darurat *Trip 500 kV Bus 1* dengan simulasi proteksi diferensial busbar ANSI 87B.

2. **IBT 500 MVA Transformer & DGA Desk (`/transformer/`)**:
   - Diagnostik trafo daya *Interbus Transformer* (IBT 500/150 kV kapasitas 500 MVA).
   - Pemantauan gradien suhu minyak atas (*top-oil*) dan titik panas lilitan (*winding hot-spot*) sesuai standar IEEE C57.91.
   - Pengaturan tap *On-Load Tap Changer* (OLTC) ±16 *steps* untuk menjaga kestabilan tegangan sistem transmisi 150 kV.
   - Analisis gas terlarut *Dissolved Gas Analysis* (DGA) standar IEC 60599 (kadar asetilena C2H2, hidrogen H2, dan metana CH4 untuk deteksi busur api tegangan tinggi).

3. **Numerical Distance Relay & R-X Studio (`/relay/`)**:
   - Simulator proteksi jarak saluran transmisi ANSI 21 (SEL-421) sepanjang 180 km.
   - Diagram bidang impedansi kompleks R-X dengan koordinasi 3 zona pengaman: Zona 1 (80% jangkauan seketika 20ms), Zona 2 (120% tunda 300ms), dan Zona 3 (150% cadangan 800ms).
   - Simulator injeksi gangguan hubung singkat (1-Fasa ke Tanah A-G, 2-Fasa B-C, dan 3-Fasa A-B-C) dengan penentuan lokasi jarak gangguan otomatis.

4. **PLN UIP2B Switching Order A4 Studio (`/dispatch/`)**:
   - Format cetak A4 presisi untuk Formulir Rencana Operasi Manuver Jaringan (ROMJ) resmi PLN UIP2B Jawa Bali.
   - Verifikasi urutan keselamatan manuver (*interlock sequence safety check*): Buka PMT -> Buka PMS Bus -> Buka PMS Line -> Masukkan PMS Tanah.
   - Kepatuhan Golden Rules K3 Listrik dengan 3 blok tanda tangan: Dispatcher Senior Gandul, Supervisor GITET Ungaran, dan Pengawas K3.

---

## 🛠️ Stack Teknologi
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss";`)
- **State & Storage:** React Context + LocalStorage Persistence
- **Graphics & FX:** HTML5 Canvas (60 FPS Phasor Radar) + Canvas-Confetti
- **Iconography:** Lucide React
- **Static Export:** GitHub Pages (`output: 'export'`, `trailingSlash: true`, `.nojekyll`)
