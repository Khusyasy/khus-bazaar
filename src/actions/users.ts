'use server';

import prisma from '@/db';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
const saltRounds = 10;

const userSchema = z.object({
  email: z.string(),
  password: z.string(),
  role: z.enum(['USER', 'ADMIN']),
});

export async function createUser(data: FormData) {
  const parsed = userSchema.parse({
    email: data.get('email'),
    password: data.get('password'),
    role: data.get('role'),
  });

  const hashedPassword = bcrypt.hashSync(parsed.password, saltRounds);

  const user = await prisma.user.create({
    data: {
      email: parsed.email,
      password: hashedPassword,
      role: parsed.role,
    },
  });

  redirect(`/admin/users/${user.id}`);
}

export async function deleteUser(data: FormData) {
  const id = Number(data.get('id'));
  const user = await prisma.user.findUnique({ where: { id } });
  if (user) {
    await prisma.user.delete({ where: { id } });
  }
  revalidatePath('/admin/users');
}

export async function editUser(data: FormData) {
  const id = Number(data.get('id'));
  const email = String(data.get('email'));
  const password = String(data.get('password'));
  const role = String(data.get('role'));

  if (email && role) {
    if (!password) {
      await prisma.user.update({
        where: { id },
        data: { email, role },
      });
    } else {
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      await prisma.user.update({
        where: { id },
        data: { email, password: hashedPassword, role },
      });
    }
  }

  redirect(`/admin/users`);
}
