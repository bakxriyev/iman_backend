import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models';
import { CreateUserDto } from './dtos';
import { UpdateUserRequest } from './interfaces';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.findAll();
  }

  async getSingleUser(id: number): Promise<User> {
    return await this.userModel.findOne({ where: { id } });
  }

  async createUser(payload: CreateUserDto): Promise<{ message: string; new_user: User }> {
    const new_user = await this.userModel.create({
      full_name: payload.full_name,
      phone_number: payload.phone_number,
      tg_user: payload.tg_user,
    });

    return {
      message: 'User created successfully',
      new_user,
    };
  }

  async updateUser(id: number, payload: UpdateUserRequest): Promise<{ message: string; updatedUser: User }> {
    await this.userModel.update(payload, { where: { id } });
    const updatedUser = await this.userModel.findOne({ where: { id } });

    return {
      message: 'User updated successfully',
      updatedUser,
    };
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const foundedUser = await this.userModel.findByPk(id);
    await foundedUser.destroy();

    return {
      message: 'User deleted successfully',
    };
  }
}
