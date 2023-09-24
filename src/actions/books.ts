'use server';

import prisma from '@/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import fs from 'fs';
import { z } from 'zod';
import Canvas from 'canvas';
// https://github.com/mozilla/pdf.js/issues/14729#issuecomment-1082831050
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.min.js';

const bookSchema = z.object({
  isbn: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
});

function genFilename(title: string) {
  return `${Date.now()}-${title}`
    .toLowerCase()
    .replace(/ /g, '_');
}

async function getCoverImage(pdfArrayBuffer: ArrayBuffer): Promise<Buffer> {
  const pdfDoc = await pdfjsLib.getDocument(pdfArrayBuffer).promise;
  const pdfPage = await pdfDoc.getPage(1);
  const viewport = pdfPage.getViewport({ scale: 1 });
  const emptyCanvas = Canvas.createCanvas(viewport.width, viewport.height);
  const renderContext = {
    canvasContext: emptyCanvas.getContext(
      '2d'
    ) as any as CanvasRenderingContext2D,
    viewport: viewport,
  };
  const pdfImage = await pdfPage
    .render(renderContext)
    .promise.then(() => emptyCanvas.toDataURL())
    .then((dataUrl) => dataUrl.replace(/^data:image\/png;base64,/, ''));

  return Buffer.from(pdfImage, 'base64')
}

export async function createBook(data: FormData) {
  const session = await getServerSession();
  if (!session) return;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email ?? "",
    }
  })
  if (!user) return;

  const parsed = bookSchema.parse({
    isbn: data.get('isbn'),
    title: data.get('title'),
    author: data.get('author'),
    description: data.get('description'),
  });
  const file = data.get('pdf') as File;

  const filename = genFilename(parsed.title);

  if (!fs.existsSync('./public/pdfs')) {
    fs.mkdirSync('./public/pdfs', { recursive: true });
  }
  const pdfArrayBuffer = await file.arrayBuffer();
  const pdfUrl = `/pdfs/${filename}.pdf`;
  fs.writeFileSync(`./public${pdfUrl}`, Buffer.from(pdfArrayBuffer));

  if (!fs.existsSync('./public/covers')) {
    fs.mkdirSync('./public/covers', { recursive: true });
  }
  const coverUrl = `/covers/${filename}.png`;
  const imageBuffer = await getCoverImage(pdfArrayBuffer);
  fs.writeFileSync(`./public${coverUrl}`, imageBuffer);

  const book = await prisma.book.create({
    data: {
      ...parsed,
      coverUrl: coverUrl,
      fileUrl: pdfUrl,
      uploaderId: user.id,
    },
  });

  redirect(`/admin/books/${book.id}`);
}

export async function deleteBook(data: FormData) {
  const id = Number(data.get('id'));
  const book = await prisma.book.findUnique({ where: { id } });
  if (book) {
    await prisma.book.delete({ where: { id } });
    fs.unlinkSync(`./public${book.fileUrl}`);
    fs.unlinkSync(`./public${book.coverUrl}`);
  }
  revalidatePath('/admin/books');
}

export async function editBook(data: FormData) {
  const session = await getServerSession();
  if (!session) return;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email ?? "",
    }
  })
  if (!user) return;

  const id = Number(data.get('id'))
  const parsed = bookSchema.parse({
    isbn: data.get('isbn'),
    title: data.get('title'),
    author: data.get('author'),
    description: data.get('description'),
  });
  const file = data.get('pdf') as File;

  if (file.size > 0) {
    // change file
    const book = await prisma.book.findUnique({
      where: {
        id: id,
      }
    });
    if (!book) return;
    fs.unlinkSync(`./public${book.fileUrl}`);
    fs.unlinkSync(`./public${book.coverUrl}`);

    const filename = genFilename(parsed.title);

    if (!fs.existsSync('./public/pdfs')) {
      fs.mkdirSync('./public/pdfs', { recursive: true });
    }
    const pdfArrayBuffer = await file.arrayBuffer();
    const pdfUrl = `/pdfs/${filename}.pdf`;
    fs.writeFileSync(`./public${pdfUrl}`, Buffer.from(pdfArrayBuffer));

    if (!fs.existsSync('./public/covers')) {
      fs.mkdirSync('./public/covers', { recursive: true });
    }
    const coverUrl = `/covers/${filename}.png`;
    const imageBuffer = await getCoverImage(pdfArrayBuffer);
    fs.writeFileSync(`./public${coverUrl}`, imageBuffer);

    await prisma.book.update({
      where: {
        id: id
      },
      data: {
        ...parsed,
        coverUrl: coverUrl,
        fileUrl: pdfUrl,
        uploaderId: user.id,
      },
    });
  } else {
    // no file
    await prisma.book.update({
      where: {
        id: id
      },
      data: {
        ...parsed,
        uploaderId: user.id,
      },
    });
  }

  redirect('/admin/books')
}
