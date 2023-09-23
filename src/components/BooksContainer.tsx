import prisma from '@/db';
import { Prisma } from '@prisma/client';
import BookCard from './BookCard';
import { Typography } from '@/material-tailwind';

export default function BooksContainer({
  books,
}: {
  books: Prisma.PromiseReturnType<typeof prisma.book.findMany>;
}) {
  return (
    <div className="flex flex-row flex-wrap gap-2 mt-2">
      {books.length > 0 ? (
        books.map((book) => <BookCard book={book} />)
      ) : (
        <Typography
          variant="h6"
          color="blue-gray"
          className="w-full text-center"
        >
          No books found
        </Typography>
      )}
    </div>
  );
}
