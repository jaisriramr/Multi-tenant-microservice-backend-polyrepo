import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

export type SprintDocument = Sprint & Document;

@Schema({ timestamps: true })
export class Sprint {
  @Prop({ required: true })
  org_id: string;

  // @Prop({ required: true })
  // is_backlog: boolean;

  @Prop({ required: true })
  project_id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({})
  sprint_goal: string;

  @Prop({})
  tasks: [];

  @Prop({})
  status: string;

  @Prop({ required: true })
  created_by: Types.ObjectId;

  @Prop({ required: true })
  updated_by: Types.ObjectId;

  @Prop({})
  start_date: string;

  @Prop({})
  end_date: string;
}

export const SprintSchema = SchemaFactory.createForClass(Sprint);
