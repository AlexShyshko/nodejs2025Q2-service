import { IsString } from 'class-validator';
import { UpdatePasswordDto as UpdatePasswordDtoInterface } from '../../types-and-interfaces';

class UpdatePasswordDto implements UpdatePasswordDtoInterface {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}

export { UpdatePasswordDto };
