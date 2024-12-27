import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({})
  org_id: Types.ObjectId;

  @Prop({ requierd: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  picture: string;

  @Prop({ required: true })
  sub: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
