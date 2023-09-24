import { Card, Typography } from '@/material-tailwind';
import NavbarDefault from '../components/NavbarDefault';
import prisma from '@/db';
import BooksContainer from '@/components/BooksContainer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  const newestBooks = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' },
    take: 4,
  });
  // const recommendedBooks = await prisma.book.findMany({
  //   orderBy: {
  //     Rating: {
  //       _count: 'desc',
  //     },
  //   },
  //   take: 4,
  // });
  const books = await prisma.book.findMany();

  return (
    <div className="p-4 flex flex-col items-center bg-light-green-300 min-h-screen">
      <NavbarDefault session={session} />
      <Card className="h-full w-full overflow-scroll mt-4 p-4 max-w-screen-xl bg-light-green-100">
        <Typography variant="h4" color="blue-gray">
          New Releases
        </Typography>
        <BooksContainer books={newestBooks} />
      </Card>
      {/* <Card className="h-full w-full overflow-scroll mt-4 p-4 max-w-screen-xl bg-light-green-100">
        <Typography variant="h4" color="blue-gray">
          Recommended
        </Typography>
        <BooksContainer books={recommendedBooks} />
      </Card> */}
      <Card className="h-full w-full overflow-scroll mt-4 p-4 max-w-screen-xl bg-light-green-100">
        <Typography variant="h4" color="blue-gray">
          All Collections
        </Typography>
        <BooksContainer books={books} />
      </Card>
    </div>
  );
}
