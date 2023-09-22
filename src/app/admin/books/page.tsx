import { Button, Card, Typography } from '@/material-tailwind';
import prisma from '@/db';
import Image from 'next/image';
import Link from 'next/link';
import RowAction from './RowAction';
import { DocumentArrowDownIcon } from '@heroicons/react/24/solid';

const headers = [
  'ISBN',
  'Title',
  'Author',
  'Cover',
  'File',
  // 'Created At',
  // 'Updated At',
];

export default async function Books() {
  const books = await prisma.book.findMany();

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
                      src={row.coverUrl}
                      alt={row.title}
                      width={100}
                      height={150}
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
      </Card>
    </div>
  );
}
