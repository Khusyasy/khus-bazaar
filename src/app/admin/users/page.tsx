import {
  Button,
  Card,
  Chip,
  IconButton,
  Input,
  Typography,
} from '@/material-tailwind';
import prisma from '@/db';
import Link from 'next/link';
import RowAction from './RowAction';
import { Prisma } from '@prisma/client';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

const headers = [
  'Email',
  'Role',
  // 'Created At',
  // 'Updated At',
];

export default async function Users({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let users: Prisma.PromiseReturnType<typeof prisma.user.findMany>;

  const perPage = 8;

  const page = parseInt(searchParams.page as string) || 1;
  const q = (searchParams.q as string) || '';
  if (page) {
    users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      where: {
        OR: [{ email: { contains: q } }, { role: { contains: q } }],
      },
    });
  } else {
    users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: perPage,
      where: {
        OR: [{ email: { contains: q } }, { role: { contains: q } }],
      },
    });
  }

  const maxPage = Math.ceil(
    (await prisma.user.count({
      where: {
        OR: [{ email: { contains: q } }, { role: { contains: q } }],
      },
    })) / perPage
  );

  return (
    <div>
      <div className="flex flex-row justify-between">
        <Typography variant="h3" color="black">
          Users
        </Typography>
        <Link href="/admin/users/new">
          <Button color="blue">Add New</Button>
        </Link>
      </div>
      <Card className="h-full w-full overflow-scroll mt-2 p-4">
        <form
          className="relative flex w-full"
          method="get"
          action="/admin/users"
        >
          {q && (
            <Link href="/admin/users">
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
      <Card className="h-full w-full overflow-scroll mt-2">
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
            {users.length > 0 ? (
              users.map((row) => (
                <tr key={row.id} className="even:bg-gray-50/50">
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      {row.email}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Chip
                      value={row.role}
                      className="rounded-full w-min"
                      color={row.role === 'ADMIN' ? 'blue' : 'blue-gray'}
                    />
                  </td>
                  <td className="p-4">
                    <RowAction id={row.id} email={row.email} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center" colSpan={headers.length + 1}>
                  <Typography color="gray" className="font-normal">
                    No users found
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
                : `/admin/users?page=${page - 1}` + (q ? `&q=${q}` : '')
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
                : `/admin/users?page=${page + 1}` + (q ? `&q=${q}` : '')
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
