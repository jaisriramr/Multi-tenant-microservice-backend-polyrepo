import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  org_id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;

  @Prop({})
  sprints: [];

  @Prop({})
  owner_id: Types.ObjectId;

  @Prop({ required: true })
  status: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
