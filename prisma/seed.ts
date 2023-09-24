// For building on vercel: https://github.com/Automattic/node-canvas/issues/1779
if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(
    `${process.env.PWD}/node_modules/canvas/build/Release:`
  )
) {
  process.env.LD_LIBRARY_PATH = `${process.env.PWD
    }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`;
}

import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"
const saltRounds = 10

// https://github.com/mozilla/pdf.js/issues/14729#issuecomment-1082831050
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.min.js';
import Canvas from 'canvas';
import { faker } from '@faker-js/faker';
import generatePDF from './pdfs';
import fs from 'fs';

const prisma = new PrismaClient()

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

async function main() {
  console.log('Clearing database / files ...')

  await prisma.borrow.deleteMany()
  await prisma.book.deleteMany()
  await prisma.user.deleteMany();

  if (fs.existsSync('./public/pdfs'))
    fs.rmSync('./public/pdfs', { recursive: true });
  if (fs.existsSync('./public/covers'))
    fs.rmSync('./public/covers', { recursive: true });

  fs.mkdirSync('./public/pdfs', { recursive: true });
  fs.mkdirSync('./public/covers', { recursive: true });

  console.log('Start seeding ...')
  const admin = await prisma.user.upsert({
    where: {
      email: "admin@admin.com",
    },
    update: {},
    create: {
      email: "admin@admin.com",
      password: bcrypt.hashSync("12345678", saltRounds),
      role: "ADMIN",
    },
  })
  await prisma.user.upsert({
    where: {
      email: "user@user.com",
    },
    update: {},
    create: {
      email: "user@user.com",
      password: bcrypt.hashSync("12345678", saltRounds),
      role: "USER",
    },
  })

  for (let i = 0; i < 10; i++) {
    await prisma.user.upsert({
      where: {
        email: faker.internet.email(),
      },
      update: {},
      create: {
        email: faker.internet.email(),
        password: bcrypt.hashSync("12345678", saltRounds),
        role: "USER",
      },
    })
  }

  const ids = [admin.id];
  for (let i = 0; i < 5; i++) {
    const admin = await prisma.user.upsert({
      where: {
        email: faker.internet.email(),
      },
      update: {},
      create: {
        email: faker.internet.email(),
        password: bcrypt.hashSync("12345678", saltRounds),
        role: "ADMIN",
      },
    })
    ids.push(admin.id);
  }

  const authors = Array.from({ length: 10 }, () => faker.person.fullName());

  for (let i = 0; i < 40; i++) {
    const title = faker.lorem.words({ min: 3, max: 5 });
    const author = faker.helpers.arrayElement(authors);
    const pdfArrayBuffer = await generatePDF(title, author);
    const filename = `${Date.now()}-${title}`
      .toLowerCase()
      .replace(/ /g, '_');
    const pdfUrl = `/pdfs/${filename}.pdf`;
    fs.writeFileSync(`./public${pdfUrl}`, Buffer.from(pdfArrayBuffer));

    const coverUrl = `/covers/${filename}.png`;
    const imageBuffer = await getCoverImage(pdfArrayBuffer);
    fs.writeFileSync(`./public${coverUrl}`, imageBuffer);

    const book = await prisma.book.create({
      data: {
        isbn: faker.commerce.isbn(13),
        title: title,
        author: author,
        description: faker.lorem.paragraph(),
        coverUrl: coverUrl,
        fileUrl: pdfUrl,
        uploaderId: faker.helpers.arrayElement(ids),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
