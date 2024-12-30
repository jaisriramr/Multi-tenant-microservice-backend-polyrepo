import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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
    console.log(response, email);
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
    return await this.userModel.findOneAndUpdate(
      { _id: new Types.ObjectId(user_id) },
      { org_id: org_id },
      { new: true },
    );
  }

  async deleteUser(user_id: string): Promise<any> {
    return await this.userModel.deleteOne({ _id: new Types.ObjectId(user_id) });
  }
}
