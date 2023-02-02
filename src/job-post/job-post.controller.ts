import {
    Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query
} from '@nestjs/common';
import { JobPostService } from './job-post.service';

@Controller('job-posts')
export class JobPostController {
  constructor(private jobPostService: JobPostService) {}

  @Get('job-post')
  async getPost(@Query() params) {
    try {
      return this.jobPostService.findOne(params.postId);
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  @Post('create-job-post')
  async createJobPost(@Body() body: any) {

    console.log(body);
    return this.jobPostService.createJobPost(body);
  }
}
