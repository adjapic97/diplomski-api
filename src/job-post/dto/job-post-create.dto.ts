import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SkillsOnJobPostDto } from './skills-on-job-post.dto';

export class JobPostCreateDto {

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
  
  @IsNumber()
  hourPrice: number;
  
  @IsNumber()
  hourNumber: number;

  @IsBoolean()
  fixedPrice: boolean;

  @IsNumber()
  fixedPriceAmount?: number;

  @IsBoolean()
  multipleEmployees: boolean;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  skills: SkillsOnJobPostDto[];
}
