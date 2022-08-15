import { ranks } from './seed-data/ranks';
import { users } from './seed-data/users';

import { PrismaClient } from '@prisma/client';
import { PrismaHelper } from './util';

const prisma = new PrismaClient();

const main = async () => {
  for (let rank of ranks) {
    await prisma.rank.create({
      data: rank,
    });
  }

  for (let user of users) {
    user.password = await PrismaHelper.hashPassword();
    await prisma.user.create({
      data: user,
    });
  }
};

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
