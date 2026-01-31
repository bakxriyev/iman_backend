import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ 
    example: 'a', 
    description: 'Filter by address (a or b)',
    enum: ['a', 'b']
  })
  @IsOptional()
  @IsString()
  @IsIn(['a', 'b'])
  address?: string;

  @ApiPropertyOptional({ 
    example: 'John', 
    description: 'Search by name or phone number' 
  })
  @IsOptional()
  @IsString()
  search?: string;
}