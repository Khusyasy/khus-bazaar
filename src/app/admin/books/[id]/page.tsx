import { editBook } from '@/actions/books';
import prisma from '@/db';
import { Card, Input, Button, Typography, Textarea } from '@/material-tailwind';
import Image from 'next/image';
import Link from 'next/link';

export type UserDetailParams = {
  id: string;
};

export default async function UserDetail({
  params,
}: {
  params: UserDetailParams;
}) {
  const book = await prisma.book.findUnique({
    where: {
      id: Number(params.id),
    },
  });

  return (
    <div>
      <div className="flex flex-row justify-between">
        <Typography variant="h3" color="black">
          {book ? `Editing book ${book.title}` : 'Book Not Found'}
        </Typography>
        <Link href="/admin/books">
          <Button color="blue">Back</Button>
        </Link>
      </div>
      {book && (
        <>
          <Card className="w-full overflow-scroll mt-4 p-4 items-center">
            <Image
              src={book.coverUrl}
              alt={book.title}
              width={135}
              height={200}
            />
          </Card>
          <Card className="h-full w-full overflow-scroll mt-4 p-4">
            <form className="w-full max-w-screen-2xl" action={editBook}>
              <div className="mb-4 flex flex-col gap-6">
                <input type="hidden" name="id" defaultValue={book.id} />
                <Input
                  size="lg"
                  label="ISBN"
                  name="isbn"
                  crossOrigin="false"
                  required
                  defaultValue={book.isbn}
                />
                <Input
                  size="lg"
                  label="Title"
                  name="title"
                  crossOrigin="false"
                  required
                  defaultValue={book.title}
                />
                <Input
                  size="lg"
                  label="Author"
                  name="author"
                  crossOrigin="false"
                  required
                  defaultValue={book.author}
                />
                <Textarea
                  size="lg"
                  label="Description"
                  name="description"
                  required
                  defaultValue={book.description}
                />
                <Input
                  type="file"
                  size="lg"
                  label="PDF"
                  name="pdf"
                  crossOrigin="false"
                  accept="application/pdf"
                  className="w-full"
                />
              </div>
              <Button className="mt-6" fullWidth type="submit" color="blue">
                Update
              </Button>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}
