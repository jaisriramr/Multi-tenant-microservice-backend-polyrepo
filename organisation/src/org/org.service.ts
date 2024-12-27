import { Injectable } from '@nestjs/common';
import { OrgRepository } from './org.repository';

@Injectable()
export class OrgService {
  constructor(private readonly orgRepository: OrgRepository) {}

  async readOrg(org_id: string): Promise<any> {
    return await this.orgRepository.read(org_id);
  }

  async createOrg(createOrg: any): Promise<any> {
    return await this.orgRepository.create(createOrg);
  }

  async updateOrg(org_id: string, updateDto: any): Promise<any> {
    return await this.orgRepository.updateOrg(org_id, updateDto);
  }

  async deleteOrg(org_id: string): Promise<any> {
    return await this.orgRepository.removeOrg(org_id);
  }

  async getAllOrg(): Promise<any> {
    return await this.orgRepository.getAllOrg();
  }
}
