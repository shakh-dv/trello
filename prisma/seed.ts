import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: {email: 'alice@gmail.com'},
    update: {},
    create: {
      username: 'Alice_Flawer',
      email: 'alice@gmail.com',
      password: '$2a$12$.PJCeT0Ay6vK7DbeD4JNZusupcHtTwfrzDt2nVDIUSWzelEukbhiG', // alice#1234??
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
  });
