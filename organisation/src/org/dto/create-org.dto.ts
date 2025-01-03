import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrgDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  display_name: string;

  @IsNotEmpty()
  owner_id: Types.ObjectId;
}
