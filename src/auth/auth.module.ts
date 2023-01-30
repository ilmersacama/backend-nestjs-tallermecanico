import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './../users/users.module';
import { User } from './../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  //imports: [TypeOrmModule.forFeature([User]), UsersModule],
  // imports: [
  //   TypeOrmModule.forFeature([UsersService]),
  //   UsersModule,
  //   PassportModule,
  //   JwtModule.register({
  //     secret: 'aD4PVgBKkTSqGsZvtTyE',
  //     signOptions: { expiresIn: '24h' },
  //   }),
  // ],
  // imports: [
  //   UsersModule,
  //   PassportModule,
  //   JwtModule.register({
  //     secret: 'aD4PVgBKkTSqGsZvtTyE',
  //     signOptions: { expiresIn: '60s' },
  //   }),
  // ],
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
