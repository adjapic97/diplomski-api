import * as argon from 'argon2';


export class PrismaHelper {
    static async hashPassword(): Promise<string> {
        return await argon.hash(process.env.PRISMA_SEED_PASSWORD);
    }
}