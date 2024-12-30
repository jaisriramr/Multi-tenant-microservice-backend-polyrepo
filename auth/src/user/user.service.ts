import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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
}
