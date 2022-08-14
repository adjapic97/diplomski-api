import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {

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

    @IsDate()
    @IsNotEmpty()
    dateOfBirth: string

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}