import { Injectable } from '@nestjs/common';
import { JobStatus, SkillLevel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobPostCreateDto } from './dto';

@Injectable()
export class JobPostService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return await this.prisma.jobPost.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
  }

  async createJobPost(dto: JobPostCreateDto) {
    const jobPost = await this.prisma.jobPost.create({
      data: {
        title: dto.title,
        description: dto.description,
        hourPrice: dto.hourPrice,
        hourNumber: dto.hourNumber,
        fixedPrice: dto.fixedPrice,
        fixedPriceAmount: dto.fixedPriceAmount,
        multipleEmployees: dto.multipleEmployees,
        location: dto.location,
        date: dto.date,
        category: dto.category,
        status: JobStatus[dto.status],
        time: '',
        user: { connect: { id: dto.userId } },
      },
    });
    dto.skills.forEach(async (skill) => {
      await this.prisma.skillsOnJobPosts.create({
        data: {
          skillLevelNeeded: SkillLevel[skill.skillLevelNeeded],
          skill: {
            connectOrCreate: {
              where: { id: skill.id },
              create: {
                name: skill.name,
              },
            },
          },
          jobPost: { connect: { id: jobPost.id } },
        },
      });
    });
    return jobPost;
  }
}
