# 💰 AI Financial Tracker

**Aplikasi Pencatatan Keuangan Cerdas Berbasis Artificial Intelligence.**

Proyek ini adalah eksplorasi pengembangan aplikasi web modern yang mengintegrasikan **Generative AI (OpenAI GPT-5-mini)** ke dalam alur kerja sehari-hari. Tujuannya adalah mengubah proses pencatatan keuangan yang membosankan menjadi instan, interaktif, dan berwawasan.

Aplikasi ini dirancang untuk memecahkan masalah malas mencatat keuangan dengan solusi teknologi:

### 1. 🪄 AI Magic Recorder (Natural Language Input)
Tidak perlu lagi mengisi formulir panjang (pilih tanggal, pilih kategori, ketik nominal). Cukup ketik layaknya curhat di chat:
> *"Tadi dapet gaji 5 juta, tapi langsung abis 1.5 juta buat bayar kost dan 50rb buat beli kopi."*

AI akan secara otomatis:
* Mendeteksi nominal uang.
* Memisahkan antara **Pemasukan** dan **Pengeluaran**.
* Menentukan **Kategori** yang relevan (misal: *Needs*, *Food*, *Income*).
* Menyimpan data ke database dalam hitungan detik.

### 2. 🤖 AI Financial Advisor
Punya data keuangan tapi bingung cara bacanya? Fitur ini bertindak sebagai konsultan pribadi.
* **Analisis Otomatis:** AI membaca rekap pengeluaran bulanan kamu.
* **Feedback Personal:** Memberikan kritik, saran penghematan, atau pujian berdasarkan pola belanja.
* **Custom Prompt:** Kamu bisa meminta AI menganalisis dengan gaya tertentu, misalnya *"Marahin saya dong karena boros"* atau *"Berikan saran investasi resiko rendah"*.

### 3. 📊 Visualisasi Data Interaktif
* **Real-time Monitoring:** Saldo, total pemasukan, dan pengeluaran dihitung otomatis.
* **Donut Chart:** Visualisasi porsi pengeluaran per kategori untuk melihat ke mana uang paling banyak mengalir.
* **Filter Periode:** Kemudahan meninjau riwayat transaksi per bulan.

### 4. 🎨 Modern User Experience
* **Dark Mode Support:** Tampilan yang nyaman di mata mengikuti preferensi sistem pengguna.
* **SPA Feel:** Navigasi antar halaman yang mulus tanpa reload (menggunakan Inertia.js).
* **Responsive:** Tampilan yang rapi baik di Desktop maupun Mobile.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun di atas *stack* modern untuk performa dan skalabilitas:

* **Backend:** [Laravel 12](https://laravel.com) (PHP)
* **Frontend:** [React.js](https://react.dev) + TypeScript
* **Fullstack Adapter:** [Inertia.js](https://inertiajs.com)
* **Artificial Intelligence:** [OpenAI API](https://openai.com) (Model `gpt-5-mini`)
* **Styling:** [Tailwind CSS](https://tailwindcss.com)
* **Database:** PostgreSQL
* **Charts:** Recharts