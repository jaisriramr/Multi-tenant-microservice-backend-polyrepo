import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Types } from 'mongoose';
import { UpdateTaskDto } from './dto/update-task.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    try {
      const count = await this.taskService.getCount();

      const words = createTaskDto.project_name.split(/\s+/);
      let task_no_prefix = '';
      if (words.length === 1) {
        task_no_prefix = words[0].slice(0, 2);
      } else if (words.length === 2) {
        task_no_prefix = words[0][0] + words[1][0];
      } else {
        task_no_prefix = words[0][0] + words[1][0];
      }

      const taskDto = {
        ...createTaskDto,
        task_no: task_no_prefix + '-' + String(count == 0 ? count + 1 : count),
        org_id: new Types.ObjectId(createTaskDto.org_id),
        project_id: new Types.ObjectId(createTaskDto.project_id),
        assignee: {
          name: createTaskDto.assignee.name,
          user_id: new Types.ObjectId(createTaskDto.assignee.user_id),
        },
      };

      return await this.taskService.createTask(taskDto);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Get(':task_id')
  async readSingleTask(@Param('task_id') task_id: string) {
    try {
      const response = await this.taskService.readSingleTask(task_id);
      if (response) {
        return response;
      } else {
        throw new HttpException('No task found', 404);
      }
    } catch (err) {
      throw new HttpException(
        err?.response ? err?.response : 'Internal Server Error',
        err?.status ? err?.status : 500,
      );
    }
  }

  @Get('/user/:user_id')
  async listUserTasks(@Param('user_id') user_id: string) {
    try {
      return await this.taskService.listUserTasks(user_id);
    } catch (err) {
      throw new HttpException(
        err?.response ? err?.response : 'Internal Server Error',
        err?.status ? err?.status : 500,
      );
    }
  }

  @Get('/project/:project_id')
  async listProjectTasks(@Param('project_id') project_id: string) {
    try {
      return await this.taskService.listProjectTasks(project_id);
    } catch (err) {
      throw new HttpException(
        err?.response ? err?.response : 'Internal Server Error',
        err?.status ? err?.status : 500,
      );
    }
  }

  @Get('/org/:org_id')
  async listOrgTasks(@Param('org_id') org_id: string) {
    try {
      return await this.taskService.listOrgTasks(org_id);
    } catch (err) {
      throw new HttpException(
        err?.response ? err?.response : 'Internal Server Error',
        err?.status ? err?.status : 500,
      );
    }
  }

  @Get('/sprint/:sprint_id')
  async listSprinTasks(@Param('sprint_id') sprint_id: string) {
    try {
      return await this.taskService.listSprintTasks(sprint_id);
    } catch (err) {
      throw new HttpException(
        err?.response ? err?.response : 'Internal Server Error',
        err?.status ? err?.status : 500,
      );
    }
  }

  @Put(':task_id')
  async updateTask(
    @Param('task_id') task_id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    try {
      console.log(updateTaskDto);

      const updateDto = {
        ...updateTaskDto,
        sprint_id: new Types.ObjectId(updateTaskDto?.sprint_id),
      };

      if (updateDto?.reporter?.name && updateDto?.reporter?.user_id) {
        updateDto.reporter.name = updateDto.reporter.name;
        updateDto.reporter.user_id = updateDto.reporter.user_id;
      }

      if (updateDto?.assignee?.name && updateDto?.assignee?.user_id) {
        updateDto.assignee.name = updateDto.assignee.name;
        updateDto.assignee.user_id = updateDto.assignee.user_id;
      }

      return await this.taskService.updateTask(task_id, updateDto);
    } catch (err) {
      throw new HttpException(
        err?.response ? err?.response : 'Internal Server Error',
        err?.status ? err?.status : 500,
      );
    }
  }

  @Delete(':task_id')
  async deleteTask(@Param('task_id') task_id: string) {
    try {
      return await this.taskService.deleteTask(task_id);
    } catch (err) {
      throw new HttpException(
        err?.response ? err?.response : 'Internal Server Error',
        err?.status ? err?.status : 500,
      );
    }
  }

  @EventPattern('task_queue')
  async handleCheckAppend(@Payload() data: any) {
    const task_id = data?.task_id;
    const _id = data?._id;

    console.log('TYPPPP ', data);

    if (data?.type == 'comment') {
      this.taskService.updateAndAppendComment(task_id, _id);
    } else if (data?.type == 'attachment') {
      this.taskService.updateAndAppendAttachment(task_id, _id);
    }
  }
}
