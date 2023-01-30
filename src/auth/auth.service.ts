import { JwtPayload } from './jwt-payload.interface';
import { User } from './../users/entities/user.entity';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

export interface JWTTokens {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async SigIn(authCredentialsDto: CreateAuthDto) {
    const { email, password } = authCredentialsDto;
    const user: User = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return new HttpException(
        'Username does not exist!',
        HttpStatus.NOT_FOUND,
      );
    }
    const passwordCompared: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    if (user && passwordCompared) {
      const payload: JwtPayload = { id: user.id, email: email };
      //const accessToken: string = this.jwtService.sign(payload);
      //return { accessToken };
      return this.jwtService.sign(payload);
    } else {
      throw new HttpException(
        'Please, check your login credentials!',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
