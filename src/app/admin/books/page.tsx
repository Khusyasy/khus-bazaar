import {
  Button,
  Card,
  Typography,
  IconButton,
  Input,
} from '@/material-tailwind';
import prisma from '@/db';
import Image from 'next/image';
import Link from 'next/link';
import RowAction from './RowAction';
import {
  DocumentArrowDownIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { Prisma } from '@prisma/client';

const headers = [
  'ISBN',
  'Title',
  'Author',
  'Cover',
  'File',
  // 'Created At',
  // 'Updated At',
];

export default async function Books({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let books: Prisma.PromiseReturnType<typeof prisma.book.findMany> = [];

  const perPage = 5;

  const page = searchParams?.page ? parseInt(searchParams?.page as string) : 1;
  const q = (searchParams?.q ?? '') as string;
  if (page) {
    books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      where: {
        OR: [
          { isbn: { contains: q } },
          { title: { contains: q } },
          { author: { contains: q } },
        ],
      },
    });
  } else {
    books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      take: perPage,
      where: {
        OR: [
          { isbn: { contains: q } },
          { title: { contains: q } },
          { author: { contains: q } },
        ],
      },
    });
  }

  const maxPage = Math.ceil(
    (await prisma.book.count({
      where: {
        OR: [
          { isbn: { contains: q } },
          { title: { contains: q } },
          { author: { contains: q } },
        ],
      },
    })) / perPage
  );

  return (
    <div>
      <div className="flex flex-row justify-between">
        <Typography variant="h3" color="black">
          Books
        </Typography>
        <Link href="/admin/books/new">
          <Button color="blue">Add New</Button>
        </Link>
      </div>
      <Card className="h-full w-full overflow-scroll mt-4 p-4">
        <form
          className="relative flex w-full"
          method="get"
          action="/admin/books"
        >
          {q && (
            <Link href="/admin/books">
              <IconButton color="red" variant="outlined" className="mr-2">
                <XMarkIcon className="w-5 h-5" />
              </IconButton>
            </Link>
          )}
          <input type="hidden" name="page" value="1" />
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
      </Card>
      <Card className="h-full w-full overflow-scroll mt-4">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {headers.map((head) => (
                <th
                  key={head}
                  className="border-b border-gray-100 bg-gray-50 p-4"
                >
                  <Typography
                    variant="small"
                    color="gray"
                    className="font-bold leading-none"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
              <th
                key="actions"
                className="border-b border-gray-100 bg-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="gray"
                  className="font-bold leading-none"
                >
                  Actions
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((row) => (
                <tr key={row.id} className="even:bg-gray-50/50">
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      {row.isbn}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      {row.title}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      {row.author}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Image
                      src={'/api/public' + row.coverUrl}
                      alt={row.title}
                      width={50}
                      height={65}
                    />
                  </td>
                  <td className="p-4">
                    <Link href={row.fileUrl} download>
                      <Button color="blue" size="sm">
                        <DocumentArrowDownIcon className="w-5 h-5" />
                      </Button>
                    </Link>
                  </td>
                  <td className="p-4">
                    <RowAction id={row.id} title={row.title} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center" colSpan={headers.length + 1}>
                  <Typography color="gray" className="font-normal">
                    No books found
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-center items-center gap-8 p-2">
          <Link
            href={
              page === 1
                ? ''
                : `/admin/books?page=${page - 1}` + (q ? `&q=${q}` : '')
            }
          >
            <IconButton size="sm" variant="outlined" disabled={page === 1}>
              <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>
          </Link>
          <Typography color="gray" className="font-normal">
            Page <strong className="text-gray-900">{page}</strong> of{' '}
            <strong className="text-gray-900">{maxPage}</strong>
          </Typography>
          <Link
            href={
              page >= maxPage
                ? ''
                : `/admin/books?page=${page + 1}` + (q ? `&q=${q}` : '')
            }
          >
            <IconButton size="sm" variant="outlined" disabled={page >= maxPage}>
              <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>
          </Link>
        </div>
      </Card>
    </div>
  );
}
