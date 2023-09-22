'use client';

import { deleteBook } from '@/actions';
import { Button } from '@/material-tailwind';
import Link from 'next/link';

export default async function RowAction({ id }: { id: number }) {
  return (
    <div className="flex flex-row gap-2">
      <Link href={`/admin/books/${id}`}>
        <Button color="blue">Edit</Button>
      </Link>
      <form
        action={async (formData) => {
          if (confirm(`Delete book ${id}?`)) {
            await deleteBook(formData);
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <Button color="red" type="submit">
          Delete
        </Button>
      </form>
    </div>
  );
}
