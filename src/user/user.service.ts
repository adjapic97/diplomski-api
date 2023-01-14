import { ForbiddenException, Injectable } from '@nestjs/common';
import { SkillLevel, UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {
  }

  async findOne(id: string, includeSkills: boolean) {
    return await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        skills: includeSkills,
      },
    });
  }

  async getUserSkills(id: string) {
    return await this.prismaService.skillsOnUsers.findMany({
      where: {
        userId: id,
      },
      include: {
        skill: true,
      },
    });
  }

  async getUserSkillsByLevel(id: string, level: SkillLevel) {
    return await this.prismaService.skillsOnUsers.findMany({
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
    let foundSkill = await this.prismaService.skillsOnUsers.findFirst({
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
      return await this.prismaService.user.update({
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
      let userSkills = await this.prismaService.skillsOnUsers.findMany({
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
    let skillsOnUser = await this.prismaService.skill.findMany({
      where: {
        NOT: {
          users: { some: { user: { id: userId } } },
        },
      },
    });
    return skillsOnUser;
  }

  async findAllUsersOnSkill(skillId) {
    return await this.prismaService.user.findMany({
      where: {
        skills: { some: { skill: { id: skillId } } },
      },
    });
  }

  async findAllSkillsOnUser(user) {
    return await this.prismaService.skillsOnUsers.findMany({
      where: {
        userId: user.id,
      },
      include: {
        skill: true,
      },
    });
  }

  async softUserDelete(userId) {
    this.prismaService.$use(async (params, next) => {
      // Check incoming query type
      if (params.model.toString() == 'Post') {
        if (params.action == 'delete') {
          // Delete queries
          // Change action to an update
          params.action = 'update'
          params.args['data'] = { deleted: true }
        }
        if (params.action == 'deleteMany') {
          // Delete many queries
          params.action = 'updateMany'
          if (params.args.data != undefined) {
            params.args.data['deleted'] = true
          } else {
            params.args['data'] = { deleted: true }
          }
        }
      }
      return next(params)
    })
  }

  async createNewUser(dto) {
    //generate password, send it to email of the newly created user
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          password: hash,
          username: dto.username,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phoneNumber: dto.phoneNumber,
          dateOfBirth: dto.dateOfBirth,
          userType: UserType[dto.userType],
        },
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(`${error.meta.target[0]} is taken!`);
        }
      }
      throw error;
    }
  }
  
}
