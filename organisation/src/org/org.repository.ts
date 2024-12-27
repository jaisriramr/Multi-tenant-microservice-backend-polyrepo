import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Org, OrgDocument } from './schema/org.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class OrgRepository {
  constructor(@InjectModel(Org.name) private orgModel: Model<OrgDocument>) {}

  async create(createOrg: any): Promise<any> {
    return await this.orgModel.create(createOrg);
  }

  async read(org_id: string): Promise<any> {
    return await this.orgModel.findOne({ _id: new Types.ObjectId(org_id) });
  }

  async getAllOrg(): Promise<any> {
    return await this.orgModel.find({});
  }

  async updateOrg(org_id: string, updateDto: any) {
    return await this.orgModel.findOneAndUpdate(
      { _id: new Types.ObjectId(org_id) },
      updateDto,
      { new: true },
    );
  }

  async removeOrg(org_id: string) {
    return await this.orgModel.deleteOne({ _id: new Types.ObjectId(org_id) });
  }
}
