# AI Financial Tracker

**Aplikasi Pencatatan Keuangan Cerdas Berbasis Artificial Intelligence.**

Proyek ini adalah pengembangan aplikasi web modern yang mengintegrasikan **Generative AI (OpenAI GPT-5-mini)** ke dalam alur kerja sehari-hari. Tujuannya adalah mengubah proses pencatatan keuangan yang membosankan menjadi instan, interaktif, dan berwawasan.

Aplikasi ini dirancang untuk memecahkan masalah malas mencatat keuangan dengan solusi teknologi:

### 1. AI Magic Recorder (Natural Language Input)
Tidak ada lagi form panjang berisi tanggal, kategori, dan nominal. Pengguna cukup mengetik dengan bahasa sehari-hari:
> *"Tadi dapet gaji 5 juta, tapi langsung abis 1.5 juta buat bayar kost dan 50rb buat beli kopi."*

AI akan secara otomatis:
* Mendeteksi nominal uang.
* Memisahkan pemasukan dan pengeluaran.
* Menentukan Kategori yang relevan.
* Menyimpan data ke database tanpa input manual.

### 2. AI Financial Advisor
Data keuangan sering ada, tapi sulit dipahami. Fitur ini bertindak sebagai teman diskusi:
* Menganalisis pola belanja bulanan.
* Memberi saran penghematan yang konstekstual.
* Bisa diajak berdialog dengan gaya bebas.

### 3. Visualisasi Data Interaktif
* Saldo, total pemasukan, dan pengeluaran dihitung secara real-time.
* Pengunaan donut chart untuk melihat pembagian porsi tiap kategori.
* Fitur periode untuk evaluasi bulanan.

---

## Teknologi yang Digunakan

* **Backend:** [Laravel 12](https://laravel.com) (PHP)
* **Frontend:** [React.js](https://react.dev) + TypeScript
* **Fullstack Adapter:** [Inertia.js](https://inertiajs.com)
* **Artificial Intelligence:** [OpenAI API](https://openai.com) (Model `gpt-5-mini`)
* **Styling:** [Tailwind CSS](https://tailwindcss.com)
* **Database:** PostgreSQL

---

## Tujuan Pengembangan

Proyek ini mencoba menggabungkan:
* Natural Language Processing
* Otomatisasi klasifikasi transaksi
* Antarmuka modern berbasis SPA
* AI sebagai asisten personal

## Self Note

Pengembangan proyek ini adalah sebagai pembelajaran pribadi saya dan sekaligus personal portofolio dalam membuat aplikasi/website menggunakan OpenAI API, Framework Laravel, dan React sebagai Frontend. hasil akhir yang saya inginkan adalah alat sederhana yang membuat pencatatan keuangan terasa lebih manusiawi, bukan administratif. Semoga kedepannya saya dapat konsisten mengembangkan aplikasi ini menjadi lebih baik lagi.