import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { MAIL } from 'src/authentication/strings.constants';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  @Post()
  async create(userDto: CreateUserDto) {
    const newUser = await this.usersRepository.create(userDto);
    return await this.usersRepository.save(newUser);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });

    if (!user) {
      throw new HttpException(MAIL.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
