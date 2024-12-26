import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAttachmentDto {
  @IsNotEmpty()
  task_id: Types.ObjectId;

  @IsNotEmpty()
  original_url: string;

  @IsNotEmpty()
  preview_url: string;

  @IsNotEmpty()
  name: string;
}
