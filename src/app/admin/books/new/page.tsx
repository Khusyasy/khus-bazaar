import { createBook } from '@/actions';
import { Card, Input, Button, Typography, Textarea } from '@/material-tailwind';
import Link from 'next/link';

export default async function BooksNew() {
  return (
    <Card color="transparent" shadow={false}>
      <div className="flex flex-row justify-between">
        <Typography variant="h3" color="blue-gray">
          New Book
        </Typography>
        <Link href="/admin/books">
          <Button>Back</Button>
        </Link>
      </div>
      <form className="mt-8 mb-2 w-full max-w-screen-2xl" action={createBook}>
        <div className="mb-4 flex flex-col gap-6">
          <Input
            size="lg"
            label="ISBN"
            name="isbn"
            crossOrigin="false"
            required
          />
          <Input
            size="lg"
            label="Title"
            name="title"
            crossOrigin="false"
            required
          />
          <Input
            size="lg"
            label="Author"
            name="author"
            crossOrigin="false"
            required
          />
          <Textarea size="lg" label="Description" name="description" required />
          <Input
            type="file"
            size="lg"
            label="PDF"
            name="pdf"
            crossOrigin="false"
            accept="application/pdf"
            required
            className="w-full"
          />
        </div>
        <Button className="mt-6" fullWidth type="submit">
          Create
        </Button>
      </form>
    </Card>
  );
}
