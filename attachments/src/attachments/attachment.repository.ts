import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attachment, AttachmentDocument } from './schema/attachments.schema';
import { Model, Types } from 'mongoose';
import { CreateAttachmentDto } from './dto/create-attachments.dto';

@Injectable()
export class AttachmentRepository {
  constructor(
    @InjectModel(Attachment.name)
    private attachmentModel: Model<AttachmentDocument>,
  ) {}

  async create(createAttachmentDto: CreateAttachmentDto) {
    return await this.attachmentModel.create(createAttachmentDto);
  }

  async list(task_id: string) {
    return await this.attachmentModel.find({
      task_id: new Types.ObjectId(task_id),
    });
  }

  async read(_id: string) {
    return await this.attachmentModel.findOne({ _id: new Types.ObjectId(_id) });
  }

  async delete(_id: string) {
    return await this.attachmentModel.deleteOne({
      _id: new Types.ObjectId(_id),
    });
  }

  async removeMany(task_id: string) {
    return await this.attachmentModel.deleteMany({
      task_id: new Types.ObjectId(task_id),
    });
  }
}
