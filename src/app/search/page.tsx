import { Card, Typography } from '@/material-tailwind';
import NavbarDefault from '@/components/NavbarDefault';
import prisma from '@/db';
import BooksContainer from '@/components/BooksContainer';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Search({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  let books: Prisma.PromiseReturnType<typeof prisma.book.findMany>;

  const q = (searchParams.q as string) || '';
  books = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      OR: [
        { isbn: { contains: q } },
        { title: { contains: q } },
        { author: { contains: q } },
        { description: { contains: q } },
      ],
    },
  });

  return (
    <div className="p-4 flex flex-col items-center bg-light-green-300 min-h-screen">
      <NavbarDefault searchParams={searchParams} session={session} />
      <Card className="h-full w-full overflow-scroll mt-4 p-4 max-w-screen-xl bg-light-green-100">
        <Typography variant="h4" color="blue-gray">
          Results for &quot;{q}&quot;
        </Typography>
        <BooksContainer books={books} />
      </Card>
    </div>
  );
}
