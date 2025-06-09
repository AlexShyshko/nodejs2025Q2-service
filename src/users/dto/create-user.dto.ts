import { IsString } from 'class-validator';
import { CreateUserDto as CreateUserDtoInterface } from '../../types-and-interfaces';

class CreateUserDto implements CreateUserDtoInterface {
  @IsString()
  //   @MinLength(1)
  //   @MaxLength(255)
  login: string;

  @IsString()
  //   @MinLength(1)
  //   @MaxLength(255)
  password: string;
}

export { CreateUserDto };
