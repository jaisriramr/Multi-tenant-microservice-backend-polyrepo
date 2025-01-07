import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<any> {
    return await this.userRepository.createRole(createRoleDto);
  }

  async readSingleRole(roleId: string): Promise<any> {
    return await this.userRepository.readRole(roleId);
  }

  async readAllRole(): Promise<any> {
    return await this.userRepository.readAllRole();
  }

  async updateRole(roleId: string, updateRoleDto: CreateRoleDto): Promise<any> {
    return await this.userRepository.updateRole(roleId, updateRoleDto);
  }

  async deleteRole(roleId: string): Promise<any> {
    return await this.userRepository.deleteRole(roleId);
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    return await this.userRepository.create(createUserDto);
  }

  async readUser(user_id: string): Promise<any> {
    return await this.userRepository.read(user_id);
  }

  async readUserByEmail(email: string): Promise<any> {
    return await this.userRepository.readByEmail(email);
  }

  async checkUser(email: string): Promise<any> {
    return await this.userRepository.checkUser(email);
  }

  async getAllUserByOrg(org_id: string): Promise<any> {
    return await this.userRepository.getUsersOfOrg(org_id);
  }

  async removeUser(user_id: string): Promise<any> {
    return await this.userRepository.deleteUser(user_id);
  }

  async updateUser(
    user_id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return await this.userRepository.updateUser(user_id, updateUserDto);
  }

  async updateOrgID(user_id: string, org_id: string): Promise<any> {
    return await this.userRepository.updateOrgId(user_id, org_id);
  }

  async userAggreateOrgsandRoles(userId: string): Promise<any> {
    const user = await this.userRepository.userAggregateOrg(userId);
    if (user) {
      const org = await axios({
        url: process.env.ORG_URL + '/org/' + user[0].org_id,
        method: 'GET',
      });
      if (org) {
        const user_data = user[0];
        const orgData = {
          name: org?.data?.name,
          display_name: org?.data?.display_name,
          logo_url: org?.data?.logo_url,
          owner_id: org?.data?.owner_id,
        };
        return { ...user_data, organisation: orgData };
      }
    }
  }
}
