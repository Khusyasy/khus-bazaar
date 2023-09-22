import { Card, Input, Button, Typography, Textarea } from '@/material-tailwind';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import fs from 'fs';
import Canvas from 'canvas';
import { PrismaClient } from '@prisma/client';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.min.js';

import { z } from 'zod';
import { NextResponse } from 'next/server';
const bookSchema = z.object({
  isbn: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
});

async function createNewBook(data: FormData) {
  'use server';
  const prisma = new PrismaClient();

  const parsed = bookSchema.parse({
    isbn: data.get('isbn'),
    title: data.get('title'),
    author: data.get('author'),
    description: data.get('description'),
  });
  const file = data.get('pdf') as File;

  const filename = `${parsed.isbn}-${parsed.title}-${parsed.author}`
    .toLowerCase()
    .replace(/ /g, '_');

  if (!fs.existsSync('./public/pdfs')) {
    fs.mkdirSync('./public/pdfs', { recursive: true });
  }
  const pdfArrayBuffer = await file.arrayBuffer();
  const pdfBuffer = Buffer.from(pdfArrayBuffer);
  const pdfUrl = `/pdfs/${filename}.pdf`;
  fs.writeFileSync(`./public${pdfUrl}`, pdfBuffer);

  // get pdf cover as image
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
  if (!fs.existsSync('./public/covers')) {
    fs.mkdirSync('./public/covers', { recursive: true });
  }
  const coverUrl = `/covers/${filename}.png`;
  fs.writeFileSync(`./public${coverUrl}`, Buffer.from(pdfImage, 'base64'));

  const book = await prisma.book.create({
    data: {
      ...parsed,
      coverUrl: coverUrl,
      fileUrl: pdfUrl,
      uploaderId: 1,
    },
  });

  console.log(book);
  redirect(`/admin/books/${book.id}`);
}

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
      <form
        className="mt-8 mb-2 w-full max-w-screen-2xl"
        action={createNewBook}
      >
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
