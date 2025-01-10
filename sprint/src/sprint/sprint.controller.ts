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
} from '@nestjs/common';
import { SprintService } from './sprint.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { Types } from 'mongoose';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';

@Controller('sprint')
export class SprintController {
  constructor(
    private readonly sprintService: SprintService,
    @Inject('PROJECT_SERVICE') private readonly projectService: ClientProxy,
  ) {}

  @Post()
  async createSprint(@Body() createSprintDto: CreateSprintDto) {
    try {
      const sprintDto = {
        ...createSprintDto,
        project_id: new Types.ObjectId(createSprintDto.project_id),
        created_by: new Types.ObjectId(createSprintDto.created_by),
        updated_by: new Types.ObjectId(createSprintDto.updated_by),
      };

      const sprintOutput = await this.sprintService.createSprint(sprintDto);
      if (sprintOutput) {
        this.projectService.emit('sprint_created', sprintOutput);
      }
      return sprintOutput;
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Get(':sprint_id')
  async readSprint(@Param('sprint_id') sprint_id: string) {
    try {
      return await this.sprintService.getSingleSprint(sprint_id);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Get('/project/:project_id')
  async listSprintByProjectId(@Param('project_id') project_id: string) {
    try {
      return await this.sprintService.listProjectSprint(project_id);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Delete(':sprint_id')
  async deleteSprint(@Param('sprint_id') sprint_id: string) {
    try {
      return await this.sprintService.deleteSprint(sprint_id);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Delete('/project/:project_id')
  async deleteProjectSprints(@Param('project_id') project_id: string) {
    try {
      return await this.sprintService.deleteProjectSprints(project_id);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Put(':sprint_id')
  async updateSprint(
    @Body() updateSprintDto: UpdateSprintDto,
    @Param('sprint_id') sprint_id,
  ) {
    try {
      return await this.sprintService.updateSprint(sprint_id, updateSprintDto);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @EventPattern('task_created')
  async handleTaskCreated(@Payload() data: any) {
    console.log('Task Created ', data);

    if (data) {
      this.sprintService.appendTaskToSprint(data?.sprint_id, data?._id);
    }
  }
}
