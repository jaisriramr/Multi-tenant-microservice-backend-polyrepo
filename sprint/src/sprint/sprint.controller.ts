import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { Types } from 'mongoose';

@Controller('sprint')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Post()
  async createSprint(@Body() createSprintDto: CreateSprintDto) {
    try {
      const sprintDto = {
        ...createSprintDto,
        project_id: new Types.ObjectId(createSprintDto.project_id),
      };

      return await this.sprintService.createSprint(sprintDto);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }
}
