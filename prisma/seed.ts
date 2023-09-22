import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"
const saltRounds = 10;

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')
  const admin = await prisma.user.create({
    data: {
      email: "admin@admin.com",
      password: bcrypt.hashSync("12345678", saltRounds),
      role: "ADMIN",
    }
  })
  const user = await prisma.user.create({
    data: {
      email: "user@user.com",
      password: bcrypt.hashSync("12345678", saltRounds),
      role: "USER",
    }
  })
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
