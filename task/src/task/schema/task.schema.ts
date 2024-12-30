import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  task_no: string;

  @Prop({ required: true })
  org_id: string;

  // @Prop({ required: true })
  // project_id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({})
  description: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  priority: string;

  @Prop({ type: Object })
  assignee: {
    name: string;
    user_id: Types.ObjectId;
  };

  @Prop({ type: Object })
  reporter: {
    name: string;
    user_id: Types.ObjectId;
  };

  @Prop()
  tags: Array<any>;

  @Prop()
  story_points: number;

  @Prop()
  sprint_id: Types.ObjectId;

  @Prop()
  comments: [];

  @Prop()
  attachments_id: [];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
