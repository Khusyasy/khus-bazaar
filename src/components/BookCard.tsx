import prisma from '@/db';
import { Card, CardBody, CardHeader, Typography } from '@/material-tailwind';
import { Prisma } from '@prisma/client';
import Image from 'next/image';

export default function BookCard({
  book,
}: {
  book: Prisma.PromiseReturnType<typeof prisma.book.findUniqueOrThrow>;
}) {
  return (
    <Card className="flex-[0_1_48%] md:flex-[0_1_24%] 2xl:flex-[0_1_16%]">
      <CardHeader floated={false} color="blue-gray" className="relative h-64">
        <Image
          src={book.coverUrl}
          alt={book.title}
          layout="fill"
          objectFit="cover"
        />
      </CardHeader>
      <CardBody>
        <Typography variant="h5" color="blue-gray">
          {book.title}
        </Typography>
        <Typography variant="h6" color="blue-gray">
          {book.author}
        </Typography>
        <Typography color="blue-gray">
          {book.description.length > 100
            ? `${book.description.slice(0, 100)}...`
            : book.description}
        </Typography>
      </CardBody>
    </Card>
  );
}
