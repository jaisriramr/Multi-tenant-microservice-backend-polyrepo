import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class FilterTaskDto {
  @IsOptional()
  title: string;

  @IsOptional()
  assignees_ids: Types.ObjectId[];

  @IsOptional()
  type: string;

  @IsNotEmpty()
  sprint_id: Types.ObjectId;

  @IsOptional()
  epics_id: Types.ObjectId[];

  @IsOptional()
  labels: [];
}
