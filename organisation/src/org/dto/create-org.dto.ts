import { IsNotEmpty } from 'class-validator';

export class CreateOrgDto {
  @IsNotEmpty()
  org_id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  display_name: string;

  @IsNotEmpty()
  owner_id: string;
}
