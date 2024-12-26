import { Injectable } from '@nestjs/common';
import { SprintRepository } from './sprint.repository';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';

@Injectable()
export class SprintService {
  constructor(private readonly sprintRepository: SprintRepository) {}

  async createSprint(createSprintDto: CreateSprintDto): Promise<any> {
    return await this.sprintRepository.create(createSprintDto);
  }

  async getSingleSprint(sprint_id: string): Promise<any> {
    return await this.sprintRepository.read(sprint_id);
  }

  async listProjectSprint(project_id: string): Promise<any> {
    return await this.sprintRepository.listProjectSprints(project_id);
  }

  async deleteSprint(sprint_id: string): Promise<any> {
    return await this.sprintRepository.deleteSprint(sprint_id);
  }

  async deleteProjectSprints(project_id: string): Promise<any> {
    return await this.sprintRepository.deleteProjectSprints(project_id);
  }

  async updateSprint(
    sprint_id: string,
    updateSprintDto: UpdateSprintDto,
  ): Promise<any> {
    return await this.sprintRepository.update(sprint_id, updateSprintDto);
  }

  async appendTaskToSprint(sprint_id: string, task_id: string): Promise<any> {
    return await this.sprintRepository.appendTaskToSprint(sprint_id, task_id);
  }
}
