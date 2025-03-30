import { Role } from 'src/utils/enums';

export class UserSignupDto {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: Role;
}
