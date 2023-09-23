import { Navbar, Typography, IconButton, Input } from '@/material-tailwind';
import {
  ArrowLeftOnRectangleIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/solid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function NavbarDefault({
  searchParams = {},
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  const q = searchParams?.q || '';

  return (
    <Navbar className="sticky top-4 z-10 mx-auto max-w-screen-xl px-4 py-3">
      <div className="flex flex-row items-center justify-between gap-y-4 text-gray-900">
        <Link href="/">
          <Typography variant="h6" className="ml-2 cursor-pointer py-1.5">
            Khus Perpus
          </Typography>
        </Link>
        <form
          className="relative flex w-max grow mx-8"
          method="get"
          action="/search"
        >
          <Input
            type="search"
            label="Search"
            name="q"
            className="pr-20"
            containerProps={{
              className: 'min-w-[288px]',
            }}
            required
            crossOrigin="false"
            defaultValue={q}
          />
          <IconButton
            size="sm"
            className="!absolute right-1 top-1 rounded"
            color="blue-gray"
            type="submit"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </IconButton>
        </form>
        <div className="flex gap-2 md:mr-4">
          {session?.role === 'ADMIN' && (
            <Link href="/admin">
              <IconButton
                variant="filled"
                color="blue-gray"
                title="Admin Dashboard"
              >
                <WrenchScrewdriverIcon className="w-5 h-5" />
              </IconButton>
            </Link>
          )}
          {session ? (
            <>
              <Link href="/borrowed">
                <IconButton
                  variant="outlined"
                  color="blue-gray"
                  title="Borrowed"
                >
                  <BookmarkIcon className="w-5 h-5" />
                </IconButton>
              </Link>
              <Link href="/api/auth/signout?callbackUrl=/">
                <IconButton variant="outlined" color="red" title="Sign Out">
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                </IconButton>
              </Link>
            </>
          ) : (
            <Link href="/api/auth/signin?callbackUrl=/">
              <IconButton variant="outlined" color="blue-gray" title="Sign In">
                <UserIcon className="w-5 h-5" />
              </IconButton>
            </Link>
          )}
        </div>
      </div>
    </Navbar>
  );
}
