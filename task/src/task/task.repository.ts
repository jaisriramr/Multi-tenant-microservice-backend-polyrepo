import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schema/task.schema';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto): Promise<any> {
    return await this.taskModel.create(createTaskDto);
  }

  async getCount(): Promise<any> {
    return await this.taskModel.countDocuments({});
  }

  async readSingleTask(task_id: string): Promise<any> {
    return await this.taskModel.findOne({ _id: new Types.ObjectId(task_id) });
  }

  async listUserTasks(user_id: string): Promise<any> {
    return await this.taskModel.find({
      'assignee.user_id': new Types.ObjectId(user_id),
    });
  }

  async listProjectTasks(project_id: string): Promise<any> {
    return await this.taskModel.find({
      project_id: new Types.ObjectId(project_id),
    });
  }

  async listOrgTasks(org_id: string): Promise<any> {
    return await this.taskModel.find({ org_id: new Types.ObjectId(org_id) });
  }

  async listSprintTasks(sprint_id: string): Promise<any> {
    return await this.taskModel.find({
      sprint_id: new Types.ObjectId(sprint_id),
    });
  }

  async updateTask(
    task_id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<any> {
    return await this.taskModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(task_id),
      },
      updateTaskDto,
      { new: true },
    );
  }

  async appendTask(task_id: string, comment_id: string): Promise<any> {
    // console.log('Service ', task_id, comment_id);

    return await this.taskModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(task_id),
      },
      { $push: { comments: new Types.ObjectId(comment_id) } },
      { new: true },
    );
  }

  async appendAttachment(task_id: string, attachment_id: string): Promise<any> {
    return await this.taskModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(task_id),
      },
      { $push: { attachments_id: new Types.ObjectId(attachment_id) } },
      { new: true },
    );
  }

  async deleteTask(task_id: string): Promise<any> {
    return await this.taskModel.findOneAndDelete({
      _id: new Types.ObjectId(task_id),
    });
  }
}
