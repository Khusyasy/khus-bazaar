import { Button, Card, Typography } from '@/material-tailwind';
import NavbarDefault from '@/components/NavbarDefault';
import prisma from '@/db';
import { redirect } from 'next/navigation';
import BackButton from '@/components/BackButton';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { borrowBook, returnBook } from '@/actions/borrows';

export default async function BookDetail({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  const book = await prisma.book.findUnique({
    where: { id: Number(params.id) },
  });

  let borrowed = false;
  if (session) {
    const borrow = await prisma.borrow.findFirst({
      where: { bookId: Number(params.id), userId: Number(session.id) },
    });
    if (borrow?.status === 'BORROWED') {
      borrowed = true;
    }
  }

  if (!book) {
    redirect('/');
  }

  return (
    <div className="p-4 flex flex-col items-center bg-light-green-300 min-h-screen">
      <NavbarDefault session={session} />
      <Card className="h-full w-full overflow-scroll mt-4 p-4 max-w-screen-xl bg-light-green-100">
        <div className="flex flex-row justify-between">
          <Typography variant="h3" color="blue-gray">
            {book.title}
          </Typography>
          <BackButton />
        </div>
        <div className="mt-4 flex flex-row gap-4">
          <Image
            src={book.coverUrl}
            alt={book.title}
            width={420}
            height={500}
            className="rounded-lg shadow-lg"
          />
          <Card className="w-full flex-1 overflow-scroll text-blue-gray flex flex-col justify-between">
            <table className="m-2 table-auto">
              <tbody>
                <tr>
                  <th className="text-left">ISBN</th>
                  <td className="p-2">{book.isbn}</td>
                </tr>
                <tr>
                  <th className="text-left">Title</th>
                  <td className="p-2">{book.title}</td>
                </tr>
                <tr>
                  <th className="text-left">Author</th>
                  <td className="p-2">{book.author}</td>
                </tr>
                <tr>
                  <th className="text-left">Description</th>
                  <td className="p-2">{book.description}</td>
                </tr>
                <tr>
                  <th className="text-left">File</th>
                  <td className="p-2">
                    {borrowed ? (
                      <a
                        href={book.fileUrl}
                        download
                        className="underline text-cyan-500"
                      >
                        Download
                      </a>
                    ) : (
                      'Borrow book to Download'
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex flex-row justify-center p-2">
              {!session ? (
                <Typography variant="small" color="gray">
                  Sign In to Borrow
                </Typography>
              ) : !borrowed ? (
                <form action={borrowBook} className="grow">
                  <input type="hidden" name="bookId" value={book.id} />
                  <input type="hidden" name="userId" value={session.id} />
                  <Button color="blue" size="sm" fullWidth type="submit">
                    Borrow
                  </Button>
                </form>
              ) : (
                <form action={returnBook} className="grow">
                  <input type="hidden" name="bookId" value={book.id} />
                  <input type="hidden" name="userId" value={session.id} />
                  <Button color="blue" size="sm" fullWidth type="submit">
                    Return
                  </Button>
                </form>
              )}
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}
