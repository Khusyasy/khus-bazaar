# khus-perpus

Live Website: TBD

> Masih bermasalah dengan deploy ke Vercel.

## Deskripsi Website

`Khus Perpus` adalah website perpustakaan online yang digunakan untuk meminjam buku secara online. Fitur utama yang tersedia di website ini adalah sebagai berikut:

### Fitur

1. Role Based, OAuth Login (Google)
2. Mencari buku
3. Melihat detail buku
4. Meminjam buku
5. Melihat daftar buku yang dipinjam
<!-- 6. Memberikan rating ke buku yang dipinjam (not implemented yet) -->

### Fitur Admin

1. Role Based, Credential Login / OAuth Login (Google)
2. Manajemen buku
   > Saat menambahkan buku, sistem akan secara otomatis mengambil gambar cover buku dari file pdf yang diupload.
3. Pencarian dan Pagination buku
4. Manajemen user
5. Pencarian dan Pagination user

## Teknologi yang Digunakan

- [Next.js](https://nextjs.org/) + App router + Server Actions
  > Projek ini menggunakan fitur eksperimental [Server Actions](https://nextjs.org/docs/app/api-reference/functions/server-actions). Fitur ini berguna agar tidak perlu membuat API endpoint untuk melakukan manajemen data di database.
- [Material Tailwind](https://material-tailwind.com/)
- [Next Auth](https://next-auth.js.org/) + OAuth Provider (Google)
- [Prisma ORM](https://www.prisma.io/)

## Instalasi

1. Clone repository ini

   ```
   git clone https://github.com/Khusyasy/khus-perpus.git
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Buat file `.env.local` dan isi seperti file `.env.example`

   > `DATABASE_URL` bisa mengikuti [dokumentasi ini](https://www.prisma.io/docs/concepts/database-connectors/sqlite#using-a-file-based-sqlite-database)

   > `NEXTAUTH_URL` bisa mengikuti [dokumentasi ini](https://next-auth.js.org/configuration/options#nextauth_url)

   > `NEXTAUTH_SECRET` bisa mengikut [dokumentasi ini](https://next-auth.js.org/configuration/options#secret)

   > `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` bisa mengikuti [dokumentasi ini](https://next-auth.js.org/providers/google#configuration)

4. Jalankan migrasi database

   ```
   npx prisma migrate dev
   ```

5. Jalankan seed database (opsional)

   > tahap ini akan memasukkan data dummy user dan buku ke database, tahap ini juga akan generate file pdf yang digunakan untuk buku dan file png yang digunakan untuk cover buku.

   ```
   npx prisma db seed
   ```

   | Email           | Password |
   | --------------- | -------- |
   | admin@admin.com | 12345678 |
   | user@user.com   | 12345678 |

6. Jalankan build

   ```
   npm run build
   ```

7. Jalankan server

   ```
   npm run start
   ```

8. Buka `http://localhost:3000` atau sesuai dengan port yang digunakan

## Identitas

Projek ini dibuat untuk memenuhi GDSC ITB 2022/2023 Last Project Submission.

- Nama: Muhammad Luthfi Khusyasy
- GDSC ID: 220020005
- Path: Web Development
