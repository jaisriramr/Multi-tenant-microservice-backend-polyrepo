import { EventPattern, Payload } from '@nestjs/microservices';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Types } from 'mongoose';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    try {
      const words = createProjectDto.name.split(/\s+/);
      let task_no_prefix = '';
      if (words.length === 1) {
        task_no_prefix = words[0].slice(0, 2);
      } else if (words.length === 2) {
        task_no_prefix = words[0][0] + words[1][0];
      } else {
        task_no_prefix = words[0][0] + words[1][0];
      }

      const projectData = {
        ...createProjectDto,
        key: task_no_prefix,
        org_id: new Types.ObjectId(createProjectDto.org_id),
        owner_id: new Types.ObjectId(createProjectDto?.owner_id),
      };

      return await this.projectService.createProject(projectData);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Get(':project_id')
  async readProject(@Param('project_id') project_id: string) {
    try {
      return await this.projectService.readProject(project_id);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Get('/org/:org_id')
  async readOrgProjects(@Param('org_id') org_id: string) {
    try {
      return await this.projectService.readAllProject(org_id);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Get('/list/by/org/:org_id')
  async readOrgProjectsLimit3(@Param('org_id') org_id: string) {
    try {
      return await this.projectService.readAllProjectByOrgIdLimit3(org_id);
    } catch (err) {
      throw new HttpException('Internal Server Err ', 500);
    }
  }

  @Get('/list/projects/:org_id')
  async listProjectByPagination(
    @Param('org_id') org_id: string,
    @Query('page') page: string,
  ) {
    try {
      return await this.projectService.getProjects(Number(page), org_id);
    } catch (err) {
      throw new HttpException('Internal Server Error ', 500);
    }
  }

  @Delete(':project_id')
  async deleteProject(@Param('project_id') project_id: string) {
    try {
      return await this.projectService.deleteProject(project_id);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @EventPattern('sprint_created')
  async handleSprintCreated(@Payload() data: any) {
    console.log('SPrint created ', data);

    if (data) {
      this.projectService.appendSprintToProject(data?.project_id, data?._id);
    }
  }
}
