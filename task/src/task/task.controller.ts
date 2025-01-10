import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Types } from 'mongoose';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';

import { JwtAuthGuard } from 'src/config/auth.guard';
import { jwtDecode } from 'jwt-decode';
import { FilterTaskDto } from './dto/filter-task.dto';

@Controller('task')
// @UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    @Inject('SPRINT_SERVICE') private readonly sprintService: ClientProxy,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationService: ClientProxy,
  ) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    try {
      const count = await this.taskService.getCount();

      // const userData: any = await jwtDecode(
      //   req?.headers['authorization'].split(' ')[1],
      // );

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
        org_id: new Types.ObjectId(createTaskDto?.org_id),
        project_id: new Types.ObjectId(createTaskDto?.project_id),
        sprint_id: new Types.ObjectId(createTaskDto?.sprint_id),
        assignee: {
          name: createTaskDto.assignee.name,
          picture: createTaskDto?.assignee?.picture,
          user_id: new Types.ObjectId(createTaskDto?.assignee?.user_id),
        },
      };

      const response1 = await this.taskService.createTask(taskDto);
      if (response1) {
        this.sprintService.emit('task_created', response1);
        // this.sprintService.emit('notification_created', {
        //   collection: 'task',
        //   type: 'create',
        //   data: JSON.stringify(response1),
        // });
      }
      return response1;
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Post('/filter')
  async FilterTasks(@Body() filterTaskDto: FilterTaskDto) {
    try {
      const assignee_ids = [];
      filterTaskDto.assignees_ids.map((id) =>
        assignee_ids.push(new Types.ObjectId(id)),
      );
      console.log(assignee_ids);
      return await this.taskService.filterTask({
        ...filterTaskDto,
        assignees_ids: assignee_ids,
      });
    } catch (err) {
      console.log('ERR ', err);
      throw new HttpException('Internal External Err ', 500);
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
        updateDto.reporter.user_id = new Types.ObjectId(
          updateDto.reporter.user_id,
        );
      }

      if (updateDto?.assignee?.name && updateDto?.assignee?.user_id) {
        updateDto.assignee.name = updateDto.assignee.name;
        updateDto.assignee.user_id = new Types.ObjectId(
          updateDto.assignee.user_id,
        );
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
