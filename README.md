# The Great Wrap

The Great Wrap adalah aplikasi untuk menghitung dan memvisualisasikan Convex Hull dari sekumpulan titik dua dimensi. Website ini dibuat untuk membantu user melihat hasil akhir Convex Hull dan proses kerja algoritma secara bertahap. Algoritma yang digunakan adalah Graham Scan, Jarvis March, dan Quickhull

## Fitur Program
# Fitur Input
- Menambahkan titik secara manual dengan klik pada canvas
- Menghapus titik dengan klik pada titik di canvas
- Import dataset titik dari file `.txt` atau `.csv`
- Generate dataset secara otomatis dengan berbagai bentuk:
  - Random
  - Triangle
  - Rectangle
  - Cluster

# Pilihan Algoritma
  - Graham Scan
  - Jarvis March
  - QuickHull

# Visualisasi Canvas
- Menampilkan visualisasi titik biasa, titik hull, dan sisi hull dengan warna yang berbeda
- Menampilkan animasi step-by-step proses algoritma setiap algoritma
- Playback control untuk animasi:
  - Play
  - Pause
  - Next Step
  - Previous Step
  - Stop

# Statistic Algoritma
- Menampilkan statistik algoritma seperti:
  - Jumlah titik
  - Jumlah titik hull
  - Runtime
- Menampilkan benchmark runtime untuk setiap algoritma

# Edge Case Handling
- Menangani beberapa kasus khusus:
  - Titik duplikat
  - Jumlah titik kurang dari tiga
  - Titik kolinear
  - Seluruh titik berada pada satu garis

## Teknologi dan Framework
- React 
- TypeScript
- Vite 

## Struktur Program

```text
The-Great-Wrap-13524097
|-- README.md
|-- README_PROJECT.md
|-- src
|   |-- package.json
|   |-- index.html
|   |-- src
|   |   |-- algorithm
|   |   |   |-- grahamscan.ts
|   |   |   |-- jarvismarch.ts
|   |   |   |-- quickhull.ts
|   |   |   |-- input.ts
|   |   |   |-- point.ts
|   |   |-- components
|   |   |   |-- CanvasBoard.tsx
|   |   |   |-- DatasetGenerator.tsx
|   |   |   |-- FileUpload.tsx
|   |   |   |-- InspectorPanel.tsx
|   |   |   |-- PlaybackControls.tsx
|   |   |   |-- Sidebar.tsx
|   |   |-- styles
|   |   |-- App.tsx
|   |   |-- types.ts
|-- test
|   |-- test.txt
|   |-- test1.txt
|   |-- test2.csv
```

## Format Input File
File input dapat berupa `.txt` atau `.csv`. Setiap baris berisi satu titik dengan format dua angka yang dipisah dengan spasi
Contoh Input FIle:

```text
10 20
-30 40
50 -10
```

## Convex Hull
Convex hull adalah himpunan atau bentuk cembung terkecil yang dapat mencakup seluruh titik dalam suatu ruang Euclidean. Pada ruang dua dimensi (2D), convex hull berbentuk poligon cembung yang mengelilingi semua titik, sedangkan pada ruang tiga dimensi (3D), convex hull berbentuk polihedron cembung. Convex hull banyak digunakan dalam bidang geometri komputasi, pengolahan citra, perencanaan rute, dan pemodelan objek.

## Graham Scan
# Langkah-Langkah Algoritma 
1. Menentukan titik awal
Algoritma dimulai dengan mencari titik yang memiliki koordinat (y) paling kecil. Jika terdapat beberapa titik dengan nilai (y) yang sama, dipilih titik dengan koordinat (x) paling kecil. Titik ini digunakan sebagai titik awal karena pasti berada pada bagian convex hull.

2. Mengurutkan titik berdasarkan sudut polar
Semua titik lainnya diurutkan berdasarkan sudut polar terhadap titik awal.

3. Memasukkan titik ke convex hull
Titik-titik yang telah diurutkan diperiksa satu per satu dan dimasukkan ke dalam stack yang menyimpan titik-titik sementara pembentuk convex hull

4. Memeriksa arah belokan
Setiap kali titik baru akan dimasukkan, algoritma memeriksa arah belokan yang dibentuk oleh dua titik terakhir dalam stack dan titik yang sedang diperiksa.

5. Membuang titik yang tidak valid
Jika ketiga titik membentuk belokan ke kanan atau berada pada satu garis lurus, titik terakhir dalam stack dihapus karena tidak termasuk bagian terluar convex hull.

6. Menyimpan titik yang valid
Jika ketiga titik membentuk belokan ke kiri, titik baru dimasukkan dan dipertahankan sebagai bagian dari convex hull.

7. Menghasilkan convex hull
Proses tersebut dilakukan hingga seluruh titik selesai diperiksa. Setelah selesai, titik-titik yang tersisa dalam stack merupakan titik-titik pembentuk convex hull.

# Analisis Kompleksitas Algoritma
Kompleksitas Waktu: (O(n log n)). Proses mencari titik paling bawah membutuhkan waktu (O(n)), mengurutkan titik-titik membutuhkan waktu (O(n log n)), dan membangun convex hull melalui operasi stack membutuhkan waktu (O(n))

Kompleksitas Ruang: (O(n)), karena stack digunakan untuk menyimpan titik-titik selama proses pembentukan convex hull dan tidak terdapat penggunaan ruang tambahan lain yang signifikan.

## Jarvis March
# Langkah-Langkah Algoritma 

1. Menghapus titik duplikat
Titik-titik yang mempunyai koordinat (x) dan (y) yang sama dihapus agar tidak diproses lebih dari satu kali.

2. Menentukan titik awal
Pilih titik yang memiliki koordinat (x) paling kecil sebagai titik awal (p)

3. Memasukkan titik awal ke convex hull
Titik (p) dimasukkan ke dalam daftar titik pembentuk convex hull.

4. Menentukan kandidat titik berikutnya
Pilih sembarang titik selain (p) sebagai kandidat awal titik berikutnya yaitu (q).

5. Memeriksa seluruh titik
Untuk setiap titik lain (r), periksa orientasi dari tiga titik (p), (q), dan (r).

6. Memperbarui kandidat titik berikutnya
Jika titik (r) berada lebih berlawanan arah jarum jam dibandingkan kandidat (q), maka kandidat titik berikutnya diperbarui menjadi (r). Jika ketiga titik segaris, dipilih titik yang jaraknya paling jauh dari (p).

7. Menetapkan titik berikutnya
Setelah seluruh titik diperiksa, nilai akhir (q) merupakan titik berikutnya pada convex hull.

8. Melanjutkan proses dari titik berikutnya
Titik (q) dijadikan titik aktif yang baru dengan menetapkan (p = q).

9. Mengulangi proses
Pemeriksaan diulangi sampai algoritma kembali ke titik awal.

10. Menghasilkan convex hull
Semua titik yang telah dimasukkan ke dalam daftar hasil merupakan titik-titik pembentuk convex hull.

# Analisis Kompleksitas Algoritma
Kompleksitas Waktu: (O(m * n)), dengan (n) merupakan jumlah titik masukan dan (m) merupakan jumlah titik keluaran atau titik pada convex hull, dengan (m <= n). Untuk setiap titik pada convex hull, algoritma memeriksa seluruh titik lainnya untuk menentukan titik berikutnya.

Kompleksitas Waktu pada Kasus Terburuk: (O(n^2)). Kasus terburuk terjadi ketika seluruh titik berada pada convex hull sehingga (m = n)

Kompleksitas Ruang: (O(n)), karena algoritma menggunakan ruang tambahan sebesar (n) untuk menyimpan titik-titik.

## QuickHull
Algoritma QuickHull merupakan algoritma Divide and Conquer yang memiliki cara kerja mirip dengan QuickSort

# Langkah-Langkah Algoritma 
1. Menentukan titik paling kiri dan paling kanan
Cari titik dengan koordinat (x) paling kecil, yaitu min_x, dan titik dengan koordinat (x) paling besar, yaitu max_x.

2. Membagi kumpulan titik menjadi dua bagian
Buat sebuah garis (L) yang menghubungkan min_x dan max_x. Garis tersebut membagi seluruh kumpulan titik menjadi dua bagian. Kedua bagian kemudian diproses secara terpisah.

3. Mencari titik terjauh dari garis
Pada salah satu bagian, cari titik (P) yang memiliki jarak paling jauh dari garis (L). Titik (P), min_x, dan max_x membentuk sebuah segitiga. Titik-titik yang berada di dalam segitiga tersebut tidak mungkin menjadi bagian dari convex hull sehingga dapat diabaikan.

4. Divide
Garis yang menghubungkan (P) dengan min_x dan garis yang menghubungkan (P) dengan max_x menjadi dua garis baru. Titik-titik yang masih berada di luar segitiga dibagi ke dalam dua subset berdasarkan posisinya terhadap kedua garis tersebut.

5. Conquer
Kedua subset yang telah terbentuk diselesaikan secara rekursif dengan mengulangi proses pencarian titik terjauh dari masing-masing garis baru.

6. Menghentikan proses
Rekursi dihentikan ketika tidak ada lagi titik yang berada di luar suatu garis.

7. Membentuk convex hull
Titik-titik ujung dari setiap garis yang diperoleh selama proses rekursif dimasukkan ke dalam convex hull. Setelah seluruh proses selesai, kumpulan titik tersebut membentuk convex hull.

# Analisis Kompleksitas Algoritma
Kompleksitas Waktu: Pada kasus rata-rata, kompleksitas waktunya adalah (O(n log n)). Pada kasus terburuk, kompleksitas waktunya dapat menjadi (O(n^2)).

Kompleksitas Ruang: (O(n)), bergantung pada proses rekursif dan data titik yang diproses.

## Cara Menjalankan Program
Masuk ke folder source aplikasi:

```bash
cd src
```

Install dependencies:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Buka URL yang muncul di terminal, seperti

```text
http://localhost:5173
```

## Cara Menggunakan Program
1. Masukkan titik dengan klik pada canvas, upload file, atau gunakan dataset generator
2. Tambahkan titik atau hapus titik pada canvas jika diperlukan
2. Pilih algoritma yang ingin digunakan (Graham Scan, Jarvis March, atau Quickhull)
3. Tekan tombol Start
4. Gunakan playback control untuk melihat proses algoritma
5. Lihat hasil Convex Hull, runtime, dan benchmark pada panel sebelah kanan

## Video Demonstrasi

```text
Link video: -
```

## Referensi
- https://www.geeksforgeeks.org/dsa/convex-hull-using-jarvis-algorithm-or-wrapping/
- https://www.geeksforgeeks.org/dsa/convex-hull-using-graham-scan/
- https://www.geeksforgeeks.org/dsa/quickhull-algorithm-convex-hull/ 
- https://www.youtube.com/watch?v=nBvCZi34F_o 
- https://www.youtube.com/watch?v=SBdWdT_5isI 
- https://www.youtube.com/watch?v=2EKIZrimeuk 
- https://www.geeksforgeeks.org/dsa/convex-hull-algorithm/ 