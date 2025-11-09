import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async getSingleUser(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

 async createUser(payload: CreateUserDto): Promise<User> {
  const newUser = await this.userModel.create({ ...payload });
  return newUser;
}


  async updateUser(id: number, payload: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    await user.update(payload);
    return user;
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    await user.destroy();
    return { message: 'User deleted successfully' };
  }
}
