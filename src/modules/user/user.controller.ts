import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto, UpdateUserDto } from './dtos';


@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  #_service: UserService;
  constructor(service: UserService) {
    this.#_service = service;
  }

  @ApiOperation({ summary: 'Hamma userlarni olish' })
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.#_service.getAllUsers();
  }

  @ApiOperation({ summary: 'Yagona userlarni olish' })
  @Get('/:id')
  @ApiOperation({ summary: 'Yagona userni olish' })
  async getSingleUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.#_service.getSingleUser(id);
  }

  @ApiOperation({ summary: 'Userni creat qilish' })
  @Post()
  async createUser(
    @Body() createUserPayload: CreateUserDto,
  ): Promise<{ message: string; new_user: CreateUserDto }> {
    await this.#_service.createUser(createUserPayload);
    return {
      message: 'User created successfully',
      new_user: createUserPayload,
    };
  }

  @ApiOperation({ summary: 'Userni yangilash' })
  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserPayload: UpdateUserDto,
  ): Promise<{ message: string; updatedUser: User }> {
    const result = await this.#_service.updateUser(
      +id,
      updateUserPayload,
    );

    return {
      message: 'User updated successfully',
      updatedUser: result.updatedUser,
    };
  }

  @ApiOperation({ summary: "Userni o'chirish" })
  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.#_service.deleteUser(+id);
  }
}
