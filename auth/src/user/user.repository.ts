import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, RoleDocument } from './schema/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<any> {
    return await this.roleModel.create(createRoleDto);
  }

  async readRole(roleId: string): Promise<any> {
    return await this.roleModel.findOne({ _id: new Types.ObjectId(roleId) });
  }

  async readAllRole(): Promise<any> {
    return await this.roleModel.find({});
  }

  async updateRole(roleId: string, updateRoleDto: CreateRoleDto): Promise<any> {
    return await this.roleModel.findOneAndUpdate(
      { _id: new Types.ObjectId(roleId) },
      updateRoleDto,
      { new: true },
    );
  }

  async deleteRole(roleId: string): Promise<any> {
    return await this.roleModel.deleteOne({ _id: new Types.ObjectId(roleId) });
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    return await this.userModel.create(createUserDto);
  }

  async read(user_id: string): Promise<any> {
    return await this.userModel.findOne({ _id: new Types.ObjectId(user_id) });
  }

  async checkUser(email: string): Promise<any> {
    return await this.userModel.find({ email: email });
  }

  async readByEmail(email: string): Promise<any> {
    const response = await this.userModel.findOne({ email: email });

    if (response) {
      return response;
    }
    // return await this.userModel.findOne({ email: email });
  }

  async getUsersOfOrg(org_id: string): Promise<any> {
    return await this.userModel.find({ org_id: new Types.ObjectId(org_id) });
  }

  async updateUser(
    user_id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return await this.userModel.findOneAndUpdate(
      { _id: new Types.ObjectId(user_id) },
      updateUserDto,
      { new: true },
    );
  }

  async updateOrgId(user_id: string, org_id: string): Promise<any> {
    console.log(user_id, org_id);
    return await this.userModel.findOneAndUpdate(
      { _id: new Types.ObjectId(user_id) },
      { org_id: new Types.ObjectId(org_id) },
      { new: true },
    );
  }

  async userAggregateOrg(email: string): Promise<any> {
    console.log('UUU ', email);
    const response = await this.userModel.aggregate([
      {
        $match: {
          email: email, // Filter by specific user ID
        },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'roles',
          foreignField: '_id',
          as: 'roles',
        },
      },
      {
        $unwind: '$roles',
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          status: 1,
          org_id: 1,
          picture: 1,
          roles: {
            name: 1,
            permissions: 1,
          },
        },
      },
    ]);
    console.log('RESS ', response);
    return response;
  }

  async deleteUser(user_id: string): Promise<any> {
    return await this.userModel.deleteOne({ _id: new Types.ObjectId(user_id) });
  }
}
