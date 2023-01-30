import { User } from './entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });
    if (userFound) {
      //throw new ConflictException('Existe un usuario con el mismo email');
      return new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
    const datauser = user;
    const { password } = datauser;
    const salt = bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, parseInt(salt));
    datauser.password = hashedPassword;
    //const userdata = this.create({ email, password: hashedPassword });

    const newUser = await this.userRepository.create(datauser);
    return this.userRepository.save(newUser);
  }

  async getUsers() {
    const users = await this.userRepository.find();
    return { users };
  }

  async getUser(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!userFound) {
      //throw new NotFoundException('User not found');
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }

  async updateUser(id: number, user: UpdateUserDto) {
    //return this.userRepository.update({ id }, user);
    const userFound = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!userFound) {
      //throw new NotFoundException('User not found');
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    //const updateUser = Object.assign(userFound, user);
    return this.userRepository.update({ id }, user);
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete({ id });
    if (result.affected === 0) {
      //throw new NotFoundException('User not found');
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
