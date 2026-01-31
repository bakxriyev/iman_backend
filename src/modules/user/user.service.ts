import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from './models/user.model';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUsersQueryDto } from './dtos/query-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User
  ) {}

  // ✅ 1. Barcha userlarni pagination bilan olish
  async getAllUsers(query: GetUsersQueryDto): Promise<{ 
    users: User[], 
    total: number, 
    page: number, 
    limit: number,
    totalPages: number 
  }> {
    const { page = 1, limit = 10, address, search } = query;
    
    // Pagination hisoblash
    const offset = (page - 1) * limit;
    
    // Filter conditions
    const whereCondition: any = {};
    
    // Address bo'yicha filter (a yoki b)
    if (address && ['a', 'b'].includes(address)) {
      whereCondition.address = address;
    }
    
    // Qidiruv bo'yicha filter (full_name yoki phone_number bo'yicha)
    if (search) {
      whereCondition[Op.or] = [
        { full_name: { [Op.iLike]: `%${search}%` } },
        { phone_number: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const { rows: users, count: total } = await this.userModel.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      users,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages
    };
  }

  // ✅ 2. Faqat "a" address'li userlarni olish
  async getUsersByAddressA(query: GetUsersQueryDto): Promise<{ 
    users: User[], 
    total: number, 
    page: number, 
    limit: number 
  }> {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;
    
    const { rows: users, count: total } = await this.userModel.findAndCountAll({
      where: { address: 'a' },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    return {
      users,
      total,
      page: Number(page),
      limit: Number(limit)
    };
  }

  // ✅ 3. Faqat "b" address'li userlarni olish
  async getUsersByAddressB(query: GetUsersQueryDto): Promise<{ 
    users: User[], 
    total: number, 
    page: number, 
    limit: number 
  }> {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;
    
    const { rows: users, count: total } = await this.userModel.findAndCountAll({
      where: { address: 'b' },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    return {
      users,
      total,
      page: Number(page),
      limit: Number(limit)
    };
  }

  // ✅ 4. Eng yangi 10 ta userni olish (limit bilan)
  async getLatestUsers(limit: number = 10): Promise<User[]> {
    return this.userModel.findAll({
      limit,
      order: [['createdAt', 'DESC']]
    });
  }

  // ✅ 5. Userlarni telefon raqami bo'yicha qidirish
  async searchUsersByPhone(phone: string): Promise<User[]> {
    if (!phone) {
      throw new BadRequestException('Phone number is required for search');
    }
    
    return this.userModel.findAll({
      where: {
        phone_number: {
          [Op.iLike]: `%${phone}%`
        }
      },
      limit: 20
    });
  }

  // ✅ 6. Bitta userni ID bo'yicha olish
  async getSingleUser(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  // ✅ 7. Yangi user yaratish
  async createUser(payload: CreateUserDto): Promise<User> {
    // Telefon raqami allaqachon mavjudligini tekshirish
    const existingUser = await this.userModel.findOne({
      where: { phone_number: payload.phone_number }
    });
    
    if (existingUser) {
      throw new BadRequestException('User with this phone number already exists');
    }
    
    const newUser = await this.userModel.create({
      ...payload,
      address: payload.address || 'a' // Default 'a'
    });
    
    return newUser;
  }

  // ✅ 8. Userni yangilash
  async updateUser(id: number, payload: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    
    await user.update(payload);
    return user;
  }

  // ✅ 9. Userni o'chirish
  async deleteUser(id: number): Promise<{ message: string }> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    
    await user.destroy();
    return { message: 'User deleted successfully' };
  }

  // ✅ 10. Statistik ma'lumotlar
  async getUserStats(): Promise<{
    totalUsers: number,
    addressAUsers: number,
    addressBUsers: number,
    todayRegistrations: number
  }> {
    const totalUsers = await this.userModel.count();
    const addressAUsers = await this.userModel.count({ where: { address: 'a' } });
    const addressBUsers = await this.userModel.count({ where: { address: 'b' } });
    
    // Bugungi registratsiyalar
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRegistrations = await this.userModel.count({
      where: {
        createdAt: {
          [Op.gte]: today
        }
      }
    });
    
    return {
      totalUsers,
      addressAUsers,
      addressBUsers,
      todayRegistrations
    };
  }
}