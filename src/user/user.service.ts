import { Injectable } from '@nestjs/common';
import { SkillLevel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string, includeSkills: boolean) {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        skills: includeSkills,
      },
    });
  }

  async getUserSkills(id: string) {
    return await this.prisma.skillsOnUsers.findMany({
      where: {
        userId: id,
      },
      include: {
        skill: true,
      },
    });
  }

  async getUserSkillsByLevel(id: string, level: SkillLevel) {
    return await this.prisma.skillsOnUsers.findMany({
      where: {
        userId: id,
        skillLevel: level,
      },
      include: {
        skill: true,
      },
    });
  }

  async addSkillToUser(skill, user) {
    let foundSkill = await this.prisma.skillsOnUsers.findFirst({
      where: {
        skill: {
          name: {
            contains: skill.skillName,
            mode: 'insensitive',
          },
        },
      },
    });
    if (!foundSkill) {
      return await this.prisma.user.update({
        where: { id: user.id },
        data: {
          skills: {
            create: [
              {
                skill: { create: { name: skill.skillName } },
                skillLevel: skill.level || SkillLevel.BEGINNER,
              },
            ],
          },
        },
      });
    } else {
      await this.prisma.skillsOnUsers.findMany({
        where: {
          userId: user.id,
        },
        select: {
          skill: true,
        },
      });
    }
  }

  async updateSkill(skill, user) {}

  async findUniqueSkills(userId) {
    let skillsOnUser = await this.prisma.skill.findMany({
      where: {
        NOT: {
          users: { some: { user: { id: userId } } },
        },
      },
    });
    return skillsOnUser;
  }

  async findAllUsersOnSkill(skillId) {
    return await this.prisma.user.findMany({
      where: {
        skills: { some: { skill: { id: skillId } } },
      },
    });
  }

  async findAllSkillsOnUser(user) {
    return await this.prisma.skillsOnUsers.findMany({
      where: {
        userId: user.id,
      },
      include: {
        skill: true,
      },
    });
  }

  async softUserDelete(userId) {
    this.prisma.$use(async (params, next) => {
      // Check incoming query type
      if (params.model.toString() == 'Post') {
        if (params.action == 'delete') {
          // Delete queries
          // Change action to an update
          params.action = 'update';
          params.args['data'] = { deleted: true };
        }
        if (params.action == 'deleteMany') {
          // Delete many queries
          params.action = 'updateMany';
          if (params.args.data != undefined) {
            params.args.data['deleted'] = true;
          } else {
            params.args['data'] = { deleted: true };
          }
        }
      }
      return next(params);
    });
  }
}
