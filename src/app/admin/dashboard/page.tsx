import prisma from '@/db';
import {
  BookOpenIcon,
  BookmarkIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';
import InfoCard from './InfoCard';

export default async function Dashboard() {
  const usersCount = await prisma.user.count();
  const booksCount = await prisma.book.count();
  const borrowedBooksCount = await prisma.borrow.count({
    where: { status: 'BORROWED' },
  });

  return (
    <div className="flex flex-row flex-wrap gap-4">
      <InfoCard
        icon={<UsersIcon className="h-12 w-12" />}
        title="Users"
        count={usersCount}
      />
      <InfoCard
        icon={<BookOpenIcon className="h-12 w-12" />}
        title="Books"
        count={booksCount}
      />
      <InfoCard
        icon={<BookmarkIcon className="h-12 w-12" />}
        title="Borrowed"
        count={borrowedBooksCount}
      />
      {/* <InfoCard
        icon={<UsersIcon className="h-12 w-12" />}
        title="Not Implemented"
        count={1337}
      /> */}
    </div>
  );
}
