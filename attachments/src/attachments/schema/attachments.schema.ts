import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type AttachmentDocument = Attachment & Document;

@Schema({ timestamps: true })
export class Attachment {
  @Prop({ required: true })
  org_id: Types.ObjectId;

  @Prop({ required: true })
  task_id: Types.ObjectId;

  @Prop({ required: true })
  original_url: string;

  @Prop({ required: true })
  preview_url: string;

  @Prop({ required: true })
  name: string;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
