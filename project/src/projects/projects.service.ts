import { Injectable } from '@nestjs/common';
import { ProjectRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import axios from 'axios';
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

  async readAllProjectByOrgIdLimit3(org_id: string): Promise<any> {
    return await this.projectRepository.readAllProjectByOrgIdLimit3(org_id);
  }

  async deleteProject(project_id: string): Promise<any> {
    return await this.projectRepository.delete(project_id);
  }

  async updateProject(project_id: string, update: any): Promise<any> {
    return await this.projectRepository.update(project_id, update);
  }

  async getProjects(page: number, org_id: string): Promise<any> {
    const projects = await this.projectRepository.getProjects(page, org_id);

    const projectData = [];

    await new Promise((resolve, reject) => {
      const count = projects.length;

      projects?.map(async (project: any, i: any) => {
        await new Promise(async (ress: any, rejj: any) => {
          const result = await axios({
            url: process.env.USER_SERVICE_URL + '/user/' + project?.owner_id,
            method: 'GET',
          })
            .then((response) => {
              const user = response.data;
              const projectObj = {
                name: project.name,
                key: project.key,
                type: project.type,
                sprints: project.sprints,
                members: project.members,
                lead_id: project.owner_id,
                status: project.status,
                lead: {
                  name: user.name,
                  email: user.email,
                  roles: user.roles,
                  status: user.status,
                  org_id: user.org_id,
                },
              };
              projectData.push(projectObj);
              ress('PROJECT');
            })
            .catch((err) => {
              return err?.response;
            });
        }).then(() => {
          if (projectData.length === projects.length) {
            resolve('done');
          }
        });
      });
    });

    const total = await this.projectRepository.getProjectsCountbyOrg(org_id);

    const totalPages = Math.ceil(total / 10);

    return {
      data: projectData,
      count: projectData.length,
      page: page,
      totalPages: totalPages,
    };
  }

  async appendSprintToProject(
    project_id: string,
    sprint_id: string,
  ): Promise<any> {
    return await this.projectRepository.appendSprintId(project_id, sprint_id);
  }
}
