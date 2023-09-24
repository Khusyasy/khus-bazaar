# khus-perpus

Live Website: TBD

> There are issues with the deployment to Vercel, so the live website is not available yet.

> Local deployment is still available, follow the installation at the bottom.

## Website Description

`Khus Perpus` is an online library website that allows users to borrow books and download them in pdf format. The main purpose of this website is to provide a place for people to read books online. This website is also equipped with a search feature to make it easier for users to find books. The features of this website are:

### Main Features

1. Role Based, OAuth Login (Google)
2. Books Search
3. Books Detail
4. Books Borrowing
   > Users can download the books that they have borrowed.
5. List of Borrowed Books
<!-- 6. Give ratings (not implemented yet) -->

### Admin Features

1. Role Based, Credential Login / OAuth Login (Google)
2. Books Management
   > When adding a book, the system will automatically take the book cover image from the uploaded pdf file.
3. Books Search and Pagination
4. Users Management
5. Users Search and Pagination

### Dummy user for testing

| Email           | Password |
| --------------- | -------- |
| admin@admin.com | 12345678 |
| user@user.com   | 12345678 |

## Technologies Used

- [Next.js](https://nextjs.org/) + App router + Server Actions

  > This project uses the experimental feature [Server Actions](https://nextjs.org/docs/app/api-reference/functions/server-actions). This feature is useful so that you don't need to create an API endpoint to do server mutations / database management.

- [Material Tailwind](https://material-tailwind.com/)
- [Next Auth](https://next-auth.js.org/) + OAuth Provider (Google)
- [Prisma ORM](https://www.prisma.io/)

## Installation

1. Clone this repository

   ```
   git clone https://github.com/Khusyasy/khus-perpus.git
   ```

2. Install dependencies, use node version `18.x`

   ```
   npm install
   ```

3. Create `.env.local` file and fill in the values from the `.env.example` file

   > `DATABASE_URL` follow [this documentation](https://www.prisma.io/docs/concepts/database-connectors/sqlite#using-a-file-based-sqlite-database)

   > `NEXTAUTH_URL` follow [this documentation](https://next-auth.js.org/configuration/options#nextauth_url)

   > `NEXTAUTH_SECRET` follow [this documentation](https://next-auth.js.org/configuration/options#secret)

   > `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` follow [this documentation](https://next-auth.js.org/providers/google#configuration)

4. Run database migration

   ```
   npx prisma migrate dev
   ```

5. Run seed script (optional, usually already done in the previous migration step)

   ```
   npx prisma db seed
   ```

   > this step will insert dummy user and book data into the database, this step will also generate pdf files used for books and png files used for book covers.

6. Run build script

   ```
   npm run build
   ```

7. Run the server

   ```
   npm run start
   ```

8. Open `http://localhost:3000` in your browser

## Identity

This project is created for GDSC ITB 2022/2023 Last Project Submission.

Made by:

- Name: Muhammad Luthfi Khusyasy
- GDSC ID: 220020005
- Path: Web Development
