import { Role } from "src/utils/enums";

export class UserSignupDto {
  username: string;
  password: string;
  role: Role;
}