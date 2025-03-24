import { Role } from 'src/utils/enums';

export class CreateUserDto {
  username: string;
  password: string;
  role: Role;
}
