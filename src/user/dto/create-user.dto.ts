import { Type } from "class-transformer";
import {IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";



enum UserType {
    ADMIN = 'ADMIN',
    EMPLOYER = 'EMPLOYER',
    EMPlOYEE = 'EMPlOYEE'
}
export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    description: string;

    @IsNotEmpty()
    @Type(() => Date)
    dateOfBirth: Date;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsEnum([UserType.ADMIN, UserType.EMPLOYER, UserType.EMPlOYEE])
    userType: UserType;
}

