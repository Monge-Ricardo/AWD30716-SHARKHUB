const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: 'owner@sharkhub.com' },
    update: {},
    create: {
      name: 'Owner Shark',
      email: 'owner@sharkhub.com',
      password: 'password123',
      role: 'OWNER',
    },
  })

  const barbershop = await prisma.barbershop.upsert({
    where: { ownerId: owner.id },
    update: {},
    create: {
      name: 'Sharkhub Barbershop',
      description: 'The best barbershop in the ocean.',
      location: '123 Ocean Avenue',
      ownerId: owner.id,
    },
  })

  const barber = await prisma.user.upsert({
    where: { email: 'barber@sharkhub.com' },
    update: {},
    create: {
      name: 'Barber Shark',
      email: 'barber@sharkhub.com',
      password: 'password123',
      role: 'BARBER',
      barbershopId: barbershop.id,
    },
  })

  console.log('Seeded owner:', owner.email)
  console.log('Seeded barbershop:', barbershop.name)
  console.log('Seeded barber:', barber.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
