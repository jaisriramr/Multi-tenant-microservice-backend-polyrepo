import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrgDocument = Org & Document;
@Schema({ timestamps: true })
export class Org {
  @Prop({ required: true })
  org_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  display_name: string;

  @Prop({})
  logo_url: string;

  @Prop({ required: true })
  owner_id: string;
}

export const OrgSchema = SchemaFactory.createForClass(Org);
