import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  task_id: Types.ObjectId;

  @Prop({ required: true })
  comment: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
