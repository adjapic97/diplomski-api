import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { Param, Put, Res, UseFilters, UseGuards } from '@nestjs/common/decorators';
import { User, UserType } from '@prisma/client';
import { Response } from 'express';
import { catchError } from 'rxjs';
import { GetUser, Roles } from 'src/auth/decorator';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { HttpExceptionFilter } from 'src/filters';
import { EmployeeOfferDto, JobPostCreateDto } from './dto';
import { OfferResponseDto } from './dto/offer-response.dto';
import { JobPostService } from './job-post.service';

@Controller('job-posts')
export class JobPostController {
  constructor(private jobPostService: JobPostService) {}

  @Get('get-job-post')
  @UseFilters(new HttpExceptionFilter())
  public async getPost(@Query() params, @Res() res: Response) {

    if (!params || !params.postId) {
      throw new BadRequestException('You didnt provide `postId` parameter!');
    }
    try {
      return res.status(200).send(await this.jobPostService.findOne(params.postId));
    } catch (error) {
      if (NotFoundException) {
        throw new NotFoundException(`Job Post with ID: ${params.postId} is not found`);
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserType.EMPLOYER, UserType.ADMIN)
  @Post('create-job-post')
  public async createJobPost(@Res() res: Response, @Body() body: JobPostCreateDto) {
    try {
      return res.status(200).send(await this.jobPostService.createJobPost(body));
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  //user sends offer on job

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserType.EMPlOYEE)
  @UseFilters(new HttpExceptionFilter())
  @Post('send-offer-to-employeer')
  async sendOfferToEmployeer(@GetUser() user: User, @Body() body: EmployeeOfferDto) {
    const offerCreation = await this.jobPostService.sendOfferToEmployeer(user, body);

    if (offerCreation.error) {
      throw new BadRequestException(offerCreation.message);
    }

    return offerCreation;
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserType.EMPLOYER, UserType.ADMIN)
  @Put('respond-to-offer')
  async respondToOffer(@Res() res : Response, @Body() body: OfferResponseDto ) {
    
    if(!body) {
      throw new BadRequestException('You have to provide body parameter in path!');
    }
    try {
      return res.status(200).send(await this.jobPostService.respondToOffer(body));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //send offer to employeer
  // send offer to user
  // employeer accepts or refuses offer
  //employer kicks out user from a job
  // employeer sets job as done
  // emplyoeer deletes job post
}
