import prisma from '@/db';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from '@/material-tailwind';
import { Prisma } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

export default function BookCard({
  book,
}: {
  book: Prisma.PromiseReturnType<typeof prisma.book.findUniqueOrThrow>;
}) {
  const maxDescLength = 45;

  return (
    <Link
      href={`/book/${book.id}`}
      className="flex-1 sm:flex-[0_1_48%] md:flex-[0_1_32%] xl:flex-[0_1_24%]"
    >
      <Card className="h-full w-full">
        <CardHeader floated={false} className="relative h-72 p-2">
          <Image
            src={'/api/public' + book.coverUrl}
            alt={book.title}
            layout="fill"
            objectFit="cover"
          />
        </CardHeader>
        <CardBody>
          <Typography variant="h6" color="blue-gray">
            {book.title}
          </Typography>
          <Typography color="gray">{book.author}</Typography>
          <hr className="my-1" />
          <Typography variant="small" color="gray">
            {book.description.length > maxDescLength
              ? `${book.description.slice(0, maxDescLength)}...`
              : book.description}
          </Typography>
        </CardBody>
      </Card>
    </Link>
  );
}
