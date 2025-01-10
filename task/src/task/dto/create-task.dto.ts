import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTaskDto {
  @IsNotEmpty()
  org_id: Types.ObjectId;

  @IsNotEmpty()
  type: string;

  @IsOptional()
  task_no: string;

  @IsNotEmpty()
  project_name: string;

  @IsNotEmpty()
  project_id: Types.ObjectId;

  @IsNotEmpty()
  sprint_id: Types.ObjectId;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  priority: string;

  @IsNotEmpty()
  assignee: {
    name: string;
    picture: string;
    user_id: Types.ObjectId;
  };
}
