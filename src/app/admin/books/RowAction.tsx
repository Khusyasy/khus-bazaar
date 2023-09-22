'use client';

import { deleteBook } from '@/actions';
import { Button } from '@/material-tailwind';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default async function RowAction({ id }: { id: number }) {
  return (
    <div className="flex flex-row gap-2">
      <Link href={`/admin/books/${id}`}>
        <Button color="blue" size="sm">
          <PencilIcon className="h-5 w-5" />
        </Button>
      </Link>
      <form
        action={async (formData) => {
          if (confirm(`Delete book?`)) {
            await deleteBook(formData);
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <Button color="red" type="submit" size="sm">
          <TrashIcon className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
