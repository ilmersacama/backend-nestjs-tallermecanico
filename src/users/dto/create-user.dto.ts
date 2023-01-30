import { roles } from './../entities/user.entity';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @Length(4, 10)
//   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
//     message: 'password is too weak',
//   })
  password: string;

  @IsNotEmpty()
  @IsEnum(roles)
  role: roles;

//   @IsNotEmpty()
//   @IsBoolean()
//   active: boolean;
}
