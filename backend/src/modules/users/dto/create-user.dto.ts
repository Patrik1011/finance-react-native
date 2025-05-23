import { Role } from 'src/utils/enums';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: Role;
}
