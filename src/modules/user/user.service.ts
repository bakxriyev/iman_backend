import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models';
import { CreateUserDto } from './dtos';
import { UpdateUserRequest } from './interfaces';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';

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

    // Excel faylga yozish
    await this.saveToExcel(new_user);

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

 async saveToExcel(user: User) {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, 'users.xlsx');
    const workbook = new ExcelJS.Workbook();
    let worksheet;

    // Agar fayl mavjud bo‘lsa, uni ochamiz
    if (fs.existsSync(filePath)) {
      await workbook.xlsx.readFile(filePath);
      worksheet = workbook.getWorksheet(1);
    } else {
      // Yangi fayl yaratish
      worksheet = workbook.addWorksheet('Users');
      
      // Sarlavhalarni qo‘shish
      worksheet.addRow(['Tartib raqami', 'Ismi', 'Telefon raqami', 'Telegram User', 'Ro‘yxatdan o‘tgan sana']);
    }

    // Oxirgi satr sonini olish va yangi qator qo‘shish
    const lastRow = worksheet.rowCount;
    const formattedDate = moment().format('DD.MM.YYYY HH:mm'); 

    worksheet.addRow([
      lastRow, 
      user.full_name, 
      user.phone_number, 
      user.tg_user, 
      formattedDate,
    ]);

    // Faylni saqlash
    await workbook.xlsx.writeFile(filePath);
  }
}
