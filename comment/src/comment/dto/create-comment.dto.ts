import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommentDto {
  @IsNotEmpty()
  user_id: Types.ObjectId;

  @IsNotEmpty()
  task_id: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  comment: string;
}
