import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
