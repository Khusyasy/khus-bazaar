import { Card, Typography } from "@/material-tailwind";
import { PrismaClient } from "@prisma/client";

async function getBooks() {
  const prisma = new PrismaClient();

  const books = await prisma.book.findMany();
  
  return books;
}

const headers = [
  ["ISBN", "isbn"],
  ["Title", "title"],
  ["Author", "author"],
  ["Cover", "coverUrl"],
  ["File", "fileUrl"],
  ["Created At", "createdAt"],
  ["Updated At", "updatedAt"],
] as const;

export default async function Books() {
  const books = await getBooks();

  return (
    <div>
      <Typography variant="h3" color="blue-gray">Books</Typography>
      <Card className="h-full w-full overflow-scroll mt-4">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {headers.map((head) => (
                <th key={head[1]} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head[0]}
                  </Typography>
                </th>
              ))}
              <th key="actions" className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Actions
                  </Typography>
                </th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0
              ?
              (books.map((row, index) => (
              <tr key={row.id} className="even:bg-blue-gray-50/50">
                {headers.map(([head, key]) => (
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {""+(row[key])}
                    </Typography>
                  </td>
                ))}
                <td className="p-4">
                  <Typography as="a" href="#" variant="small" color="blue-gray" className="font-medium">
                    Edit
                  </Typography>
                </td>
              </tr>
              )))
              :
              (
                <tr>
                  <td className="p-4 text-center" colSpan={headers.length+1}>
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    No books found
                  </Typography>
                  </td>
                </tr>
              )
              }
          </tbody>
        </table>
      </Card>
    </div>
  )
}
