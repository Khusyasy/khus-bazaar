'use server';

import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs";
import { z } from 'zod';
import Canvas from 'canvas';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.min.js';

const bookSchema = z.object({
  isbn: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
});

export async function createBook(data: FormData) {
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
