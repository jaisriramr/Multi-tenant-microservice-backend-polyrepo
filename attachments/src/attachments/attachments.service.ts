import { Injectable } from '@nestjs/common';
import { AttachmentRepository } from './attachment.repository';
import { CreateAttachmentDto } from './dto/create-attachments.dto';

@Injectable()
export class AttachmentService {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async create(createAttachmentDto: CreateAttachmentDto) {
    return await this.attachmentRepository.create(createAttachmentDto);
  }

  async list(task_id: string) {
    return await this.attachmentRepository.list(task_id);
  }

  async read(_id: string) {
    return await this.attachmentRepository.read(_id);
  }

  async delete(_id: string) {
    return await this.attachmentRepository.delete(_id);
  }

  async deleteMany(task_id: string) {
    return await this.attachmentRepository.removeMany(task_id);
  }
}
