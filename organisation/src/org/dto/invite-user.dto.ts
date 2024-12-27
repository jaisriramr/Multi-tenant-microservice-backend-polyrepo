import { IsNotEmpty } from 'class-validator';

export class InviteUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  roles: string;

  @IsNotEmpty()
  org_id: string;
}
