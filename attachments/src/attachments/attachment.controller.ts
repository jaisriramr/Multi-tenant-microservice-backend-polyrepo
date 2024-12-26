import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AttachmentService } from './attachments.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAttachmentDto } from './dto/create-attachments.dto';
import { Types } from 'mongoose';
import { s3 } from 'src/config/aws.config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('attachment')
export class AttachmentController {
  constructor(
    private readonly attachmentService: AttachmentService,
    @Inject('MESSAGE_SERVICE') private client: ClientProxy,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createAttachment(
    @Body() createAttachmentDto: CreateAttachmentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided!');
      }

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();

      const data = {
        ...createAttachmentDto,
        original_url: uploadResult.Location,
        preview_url: uploadResult.Location,
        name: uploadResult.Key,
        task_id: new Types.ObjectId(createAttachmentDto?.task_id),
      };

      const response = await this.attachmentService.create(data);
      if (response) {
        this.client.emit('task_queue', {
          task_id: response?.task_id,
          _id: response?._id,
          type: 'attachment',
        });
      }
      return response;
    } catch (err) {
      throw new HttpException(
        err?.response ? err?.response : 'Internal Server Error',
        err?.status ? err?.status : 500,
      );
    }
  }

  @Get('/tasks/:task_id')
  async listAttachmentofTask(@Param('task_id') task_id: string) {
    try {
      return await this.attachmentService.list(task_id);
    } catch (err) {
      throw new HttpException(
        err?.response ? err?.response : 'Internal Server Error',
        err?.status ? err?.status : 500,
      );
    }
  }

  @Get(':attachment_id')
  async readAttachment(@Param('attachment_id') attachment_id: string) {
    try {
      return await this.attachmentService.read(attachment_id);
    } catch (err) {
      throw new HttpException(
        err?.response ? err?.response : 'Internal Server Error',
        err?.status ? err?.status : 500,
      );
    }
  }
  @Delete(':attachment_id')
  async deleteAttachment(@Param('attachment_id') attachment_id: string) {
    try {
      return await this.attachmentService.delete(attachment_id);
    } catch (err) {
      throw new HttpException(
        err?.response ? err?.response : 'Internal Server Error',
        err?.status ? err?.status : 500,
      );
    }
  }

  @Delete('/tasks/:task_id')
  async deleteManyAttachment(@Param('task_id') task_id: string) {
    try {
      return await this.attachmentService.deleteMany(task_id);
    } catch (err) {
      throw new HttpException(
        err?.response ? err?.response : 'Internal Server Error',
        err?.status ? err?.status : 500,
      );
    }
  }
}
