import { Injectable } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<any> {
    return await this.taskRepository.create(createTaskDto);
  }

  async getCount(): Promise<any> {
    return await this.taskRepository.getCount();
  }

  async readSingleTask(task_id: string): Promise<any> {
    return await this.taskRepository.readSingleTask(task_id);
  }

  async listUserTasks(user_id: string): Promise<any> {
    return await this.taskRepository.listUserTasks(user_id);
  }

  async listProjectTasks(project_id: string): Promise<any> {
    return await this.taskRepository.listProjectTasks(project_id);
  }

  async listOrgTasks(org_id: string): Promise<any> {
    return await this.taskRepository.listOrgTasks(org_id);
  }

  async listSprintTasks(sprint_id: string): Promise<any> {
    return await this.taskRepository.listSprintTasks(sprint_id);
  }

  async updateTask(
    task_id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<any> {
    return await this.taskRepository.updateTask(task_id, updateTaskDto);
  }

  async updateAndAppendComment(
    task_id: string,
    comment_id: string,
  ): Promise<any> {
    return await this.taskRepository.appendTask(task_id, comment_id);
  }

  async updateAndAppendAttachment(task_id: string, _id: string): Promise<any> {
    return await this.taskRepository.appendAttachment(task_id, _id);
  }

  async deleteTask(task_id: string): Promise<any> {
    return await this.taskRepository.deleteTask(task_id);
  }
}
