import { Card, Typography } from '@/material-tailwind';
import NavbarDefault from '@/components/NavbarDefault';
import prisma from '@/db';
import BooksContainer from '@/components/BooksContainer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function Search() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const borrowedBooks = await prisma.book.findMany({
    where: {
      Borrow: {
        some: {
          userId: Number(session.id),
          status: 'BORROWED',
        },
      },
    },
  });

  return (
    <div className="p-4 flex flex-col items-center bg-light-green-300 min-h-screen">
      <NavbarDefault session={session} />
      <Card className="h-full w-full overflow-scroll mt-4 p-4 max-w-screen-xl bg-light-green-100">
        <Typography variant="h4" color="blue-gray">
          Borrowed Books
        </Typography>
        <BooksContainer books={borrowedBooks} />
      </Card>
    </div>
  );
}
