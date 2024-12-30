import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './schema/project.schema';
import { Model, Types } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<any> {
    return await this.projectModel.create(createProjectDto);
  }

  async read(project_id: string): Promise<any> {
    return await this.projectModel.findOne({
      _id: new Types.ObjectId(project_id),
    });
  }

  async readAllProjectsOfOrg(org_id: string): Promise<any> {
    return await this.projectModel.find({ org_id: org_id });
  }

  async delete(project_id: string): Promise<any> {
    return await this.projectModel.deleteOne({
      _id: new Types.ObjectId(project_id),
    });
  }

  async update(project_id: string, data: any): Promise<any> {
    return await this.projectModel.findOneAndUpdate(
      { _id: new Types.ObjectId(project_id) },
      data,
      { new: true },
    );
  }

  async appendSprintId(project_id: string, sprint_id: string): Promise<any> {
    return await this.projectModel.findOneAndUpdate(
      { _id: new Types.ObjectId(project_id) },
      { $push: { sprints: new Types.ObjectId(sprint_id) } },
      { new: true },
    );
  }
}
