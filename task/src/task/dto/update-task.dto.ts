import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  sprint_id: Types.ObjectId;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  status: string;

  @IsOptional()
  priority: string;

  @IsOptional()
  assignee: {
    name: string;
    user_id: Types.ObjectId;
  };

  @IsOptional()
  reporter: {
    name: string;
    user_id: Types.ObjectId;
  };

  @IsOptional()
  tags: Array<any>;

  @IsOptional()
  story_points: number;

  @IsOptional()
  comments: [];

  @IsOptional()
  attachments_id: [];
}
