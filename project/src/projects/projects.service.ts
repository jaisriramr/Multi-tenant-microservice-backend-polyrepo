import { Injectable } from '@nestjs/common';
import { ProjectRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async createProject(createProjectDto: CreateProjectDto): Promise<any> {
    return await this.projectRepository.create(createProjectDto);
  }

  async readProject(project_id: string): Promise<any> {
    return await this.projectRepository.read(project_id);
  }

  async readAllProject(org_id: string): Promise<any> {
    return await this.projectRepository.readAllProjectsOfOrg(org_id);
  }

  async deleteProject(project_id: string): Promise<any> {
    return await this.projectRepository.delete(project_id);
  }

  async updateProject(project_id: string, update: any): Promise<any> {
    return await this.projectRepository.update(project_id, update);
  }
}
