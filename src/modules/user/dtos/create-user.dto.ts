import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        type: String,
        required: false,
        example: 'Eshmat',
    })
    @IsString()
    full_name: string;

    @ApiProperty({
        type: String,
        required: false,
        example: '+998933211232',
    })
    @IsOptional()
    phone_number?: string;

    @ApiProperty({
        type: String,
        required: false,
        example: 'Gap',
    })
    @IsOptional()
    type: string;

    @ApiProperty({
        type: String,
        required: false,
        example: 'Toshkent'
    })
    @IsOptional()
    address: string;
    
}