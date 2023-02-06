import { IsNotEmpty, IsString } from "class-validator";

export class OfferResponseDto {

    @IsString()
    @IsNotEmpty()
    response: string;

    @IsString()
    @IsNotEmpty()
    offerId: string;

    @IsString()
    message: string;

}