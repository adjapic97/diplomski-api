
import {ranks} from './seed-data/ranks'
import { PrismaClient } from   '@prisma/client'

const prisma = new PrismaClient();

const main = async () => {

    for(let rank of ranks) {
        await prisma.rank.create({
            data: rank
        })
    }
}

main().catch(e => {
    console.log(e);
    process.exit(1);
}).finally( () => {
    prisma.$disconnect();
})