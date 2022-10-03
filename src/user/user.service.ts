import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
  }

  async updateSkill(skill, user) {
    return 'Skill added';
  }
}
