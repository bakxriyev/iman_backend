import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";

export class CreateUserDto {


    
    @ApiProperty({
        type: String,
        required: true,
        example: 'Eshmat',
    })
    @IsString()
    full_name: string;

    @ApiProperty({
        type: String,
        required: true,
        example: '+998933211232',
    })
    @IsPhoneNumber("UZ")
    phone_number?: string;

    @ApiProperty({
        type: String,
        required: true,
        example: 'Gap',
    })
    @IsString()
    tg_user: string;
}