import { IsNotEmpty, IsString } from "class-validator";

export class EmployeeOfferDto {

    @IsString()
    status: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    jobPostId: string;

}