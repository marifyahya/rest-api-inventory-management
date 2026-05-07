import prisma from "../src/lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  const adminEmail = 'admin@example.com';
  const hashedPassword = await bcrypt.hash('password', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'I am Admin',
      password: hashedPassword,
      role: 'ADMIN'
    },
  })

  console.log({ admin })
}

console.log('Seeding database...')

main()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })