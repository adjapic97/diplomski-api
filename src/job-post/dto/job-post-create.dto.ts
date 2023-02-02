import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { SkillsOnJobPostDto } from './skills-on-job-post.dto';

export class JobPostCreateDto {
  title: string;
  description: string;
  hourPrice: number;
  hourNumber: number;
  fixedPrice: boolean;
  fixedPriceAmount?: number;
  multipleEmployees: boolean;
  location: string;

  @IsNotEmpty()
  @Type(() => Date)
  date: Date;
  category: string;
  status: string;
  userId: string;
  skills: SkillsOnJobPostDto[];
}
