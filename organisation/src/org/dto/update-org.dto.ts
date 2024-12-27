import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateOrgDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  display_name: string;

  @IsOptional()
  logo_url: string;
}
