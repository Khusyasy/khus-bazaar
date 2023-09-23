'use client';

import { useState } from 'react';
import { deleteUser } from '@/actions/users';
import { DialogDefault } from '@/components/DialogDefault';
import { Button, Typography } from '@/material-tailwind';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function RowAction({
  id,
  email,
}: {
  id: number;
  email: string;
}) {
  const [data, setData] = useState<FormData | null>(null);
  const [open, setOpen] = useState(false);
  function handleOpen() {
    setOpen(!open);
  }
  function handleOk() {
    if (!data) return;
    deleteUser(data);
    handleOpen();
  }

  return (
    <div className="flex flex-row gap-2">
      <Link href={`/admin/users/${id}`}>
        <Button color="blue" size="sm">
          <PencilIcon className="h-5 w-5" />
        </Button>
      </Link>
      <form
        action={(formData) => {
          setData(formData);
          handleOpen();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <Button color="red" type="submit" size="sm">
          <TrashIcon className="h-5 w-5" />
        </Button>
      </form>
      <DialogDefault
        title="Delete User"
        open={open}
        handleOpen={handleOpen}
        handleOk={handleOk}
      >
        <Typography variant="h5" color="red">
          Are you sure you want to delete {email}?
        </Typography>
      </DialogDefault>
    </div>
  );
}
