import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrgDocument = Org & Document;
@Schema({ timestamps: true })
export class Org {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  display_name: string;

  @Prop({})
  logo_url: string;

  @Prop({ required: true })
  owner_id: Types.ObjectId;
}

export const OrgSchema = SchemaFactory.createForClass(Org);
