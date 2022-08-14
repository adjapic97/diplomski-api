import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginDto {

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}