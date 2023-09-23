'use server';

import prisma from '@/db';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const borrowSchema = z.object({
  bookId: z.number().int().positive(),
  userId: z.number().int().positive(),
});

export async function borrowBook(data: FormData) {
  const parsed = borrowSchema.parse({
    bookId: Number(data.get('bookId')),
    userId: Number(data.get('userId')),
  });

  await prisma.borrow.upsert({
    where: {
      bookId_userId: {
        bookId: parsed.bookId,
        userId: parsed.userId,
      },
    },
    update: {
      status: "BORROWED",
    },
    create: {
      bookId: parsed.bookId,
      userId: parsed.userId,
      status: "BORROWED",
    }
  });

  revalidatePath(`/book/${parsed.bookId}`);
}

export async function returnBook(data: FormData) {
  const parsed = borrowSchema.parse({
    bookId: Number(data.get('bookId')),
    userId: Number(data.get('userId')),
  });

  await prisma.borrow.update({
    where: {
      bookId_userId: {
        bookId: parsed.bookId,
        userId: parsed.userId,
      },
    },
    data: {
      status: "RETURNED",
    }
  });

  revalidatePath(`/book/${parsed.bookId}`);
}
