import { Role } from 'src/utils/enums';

export class UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: Role;
}
