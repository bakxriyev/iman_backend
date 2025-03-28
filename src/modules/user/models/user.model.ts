import { 
    Table, 
    Model, 
    Column, 
    DataType,  
  } from 'sequelize-typescript';
  
  @Table({ tableName: 'users', timestamps: true })
  export class User extends Model {

    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    full_name: string;

    @Column({ type: DataType.BIGINT, allowNull: false })
    phone_number?: string;

    @Column({ type: DataType.STRING, allowNull: false })
    tg_user:string;
  }
  