import { Button, Card, Chip, Typography } from '@/material-tailwind';
import prisma from '@/db';
import Link from 'next/link';
import RowAction from './RowAction';

const headers = [
  'Email',
  'Role',
  // 'Created At',
  // 'Updated At',
];

export default async function Users() {
  const users = await prisma.user.findMany();

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
      </Card>
    </div>
  );
}
