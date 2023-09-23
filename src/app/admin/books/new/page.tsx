import { createBook } from '@/actions/books';
import BackButton from '@/components/BackButton';
import { Card, Input, Button, Typography, Textarea } from '@/material-tailwind';

export default async function BooksNew() {
  return (
    <div>
      <div className="flex flex-row justify-between">
        <Typography variant="h3" color="black">
          New Book
        </Typography>
        <BackButton />
      </div>
      <Card className="h-full w-full overflow-scroll mt-4 p-4">
        <form className="w-full max-w-screen-2xl" action={createBook}>
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
            <Textarea
              size="lg"
              label="Description"
              name="description"
              required
            />
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
          <Button className="mt-6" fullWidth type="submit" color="blue">
            Create
          </Button>
        </form>
      </Card>
    </div>
  );
}
