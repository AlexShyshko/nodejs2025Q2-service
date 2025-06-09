import { IsString } from 'class-validator';
import { UpdateUserDto as UpdateUserDtoInterface } from '../../types-and-interfaces';

class UpdateUserDto implements UpdateUserDtoInterface {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}

export { UpdateUserDto };
