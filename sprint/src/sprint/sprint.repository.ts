import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sprint, SprintDocument } from './schema/sprint.schema';
import { Model, Types } from 'mongoose';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';

@Injectable()
export class SprintRepository {
  constructor(
    @InjectModel(Sprint.name) private sprintModel: Model<SprintDocument>,
  ) {}

  async create(createSprintDto: CreateSprintDto): Promise<any> {
    return await this.sprintModel.create(createSprintDto);
  }

  async read(sprint_id: string): Promise<any> {
    return await this.sprintModel.findOne({
      _id: new Types.ObjectId(sprint_id),
    });
  }

  async listProjectSprints(project_id: string): Promise<any> {
    return await this.sprintModel.find({
      project_id: new Types.ObjectId(project_id),
    });
  }

  async deleteSprint(sprint_id: string): Promise<any> {
    return await this.sprintModel.deleteOne({
      _id: new Types.ObjectId(sprint_id),
    });
  }

  async deleteProjectSprints(project_id: string): Promise<any> {
    return await this.sprintModel.deleteMany({
      project_id: new Types.ObjectId(project_id),
    });
  }

  async appendTaskToSprint(sprint_id: string, task_id: string): Promise<any> {
    return await this.sprintModel.findOneAndUpdate(
      { _id: new Types.ObjectId(sprint_id) },
      { $push: { tasks: new Types.ObjectId(task_id) } },
      { new: true },
    );
  }

  async update(
    sprint_id: string,
    updateSprintDto: UpdateSprintDto,
  ): Promise<any> {
    return await this.sprintModel.findByIdAndUpdate(
      { _id: new Types.ObjectId(sprint_id) },
      updateSprintDto,
      { new: true },
    );
  }
}
