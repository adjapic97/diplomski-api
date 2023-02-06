import { Injectable, Logger } from '@nestjs/common';
import { JobStatus, OfferStatus, SkillLevel, User } from '@prisma/client';
import { empty } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeOfferDto, JobPostCreateDto, OfferResponseDto } from './dto';

@Injectable()
export class JobPostService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(JobPostService.name);

  async findOne(id: string) {
    if (!id) {
      this.logger.warn(`no id provided`);
      return;
    }
    const jobPost = await this.prisma.jobPost.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
    if (!jobPost) {
      this.logger.warn(`No Job Post with id:  ${id}`);
      return;
    }
    this.logger.log(`Job Post with id: ${id} found and returned`);
    return jobPost;
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

  //on sucessfull creation find user who owns the job post and sendd him
  // web push notification
  async sendOfferToEmployeer(user: User, offer: EmployeeOfferDto) {
    const offerFound = await this.prisma.offer.findFirstOrThrow({
      where: {
        userId: user.id,
        jobPostId: offer.jobPostId,
      },
    });
    if (offerFound && offerFound.status == OfferStatus.REJECTED) {
      return {
        error: true,
        message: 'offer is rejected already',
      };
    } else if (offerFound) {
      return {
        error: true,
        message: 'offer already created',
      };
    }
    await this.prisma.offer.create({
      data: {
        status: OfferStatus[OfferStatus.PENDING],
        description: offer.description,
        user: { connect: { id: user.id } },
        jobPost: { connect: { id: offer.jobPostId } },
      },
    });
  }

  async respondToOffer(offerResponseDto: OfferResponseDto) {
    
    const offerFound = await this.prisma.offer.findFirstOrThrow({
      where: {
        id: offerResponseDto.offerId,
      },
    });

    console.log(OfferStatus.PENDING)
    if (offerFound && OfferStatus[offerFound.status] === OfferStatus.PENDING) {
      const offerResponse = await this.prisma.offer.update({
        where: {
          id: offerResponseDto.offerId,
        },
        data: {
          status: OfferStatus[offerResponseDto.response],
        },
      });
      if (offerResponse && offerResponseDto.response == 'ACCEPTED') {
        if (
          await this.prisma.userHasJobPost.findFirstOrThrow({
            where: {
              offer: { id: offerResponseDto.offerId },
            },
          })
        ) {
          return { offerResponse: offerResponse, alreadyAccepted: true };
        } else {
          const createUserOnJob = await this.prisma.userHasJobPost.create({
            data: {
              offer: { connect: { id: offerResponse.id } },
            },
          });
          return {
            offerResponse: offerResponse,
            createUserOnJob: createUserOnJob,
          };
        }
      } else if (offerResponse && offerResponseDto && offerResponseDto.response == OfferStatus.REJECTED) {
        return { offerResponse: offerResponse };
      }
    }

    return {
      isOfferAnswered: true,
      offerAnswer: OfferStatus[offerFound.status]
    }
  }
}
