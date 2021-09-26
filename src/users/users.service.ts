import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { DEFAULT_ERROR, MAIL } from 'src/shared/constants/user.strings';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  @Post()
  async create(userDto: CreateUserDto) {
    const newUser = await this.usersRepository.create(userDto);
    return await this.usersRepository.save(newUser);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ id });

    if (!user) {
      throw new HttpException(DEFAULT_ERROR, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(id: number, userData: UpdateUserDto) {
    return await this.usersRepository.update({ id }, userData);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ id });

    if (!user) {
      throw new HttpException(DEFAULT_ERROR, HttpStatus.NOT_FOUND);
    }

    return this.usersRepository.remove([user]);
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });

    if (!user) {
      throw new HttpException(MAIL.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
