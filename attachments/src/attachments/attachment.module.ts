import { Module } from '@nestjs/common';
import { AttachmentService } from './attachments.service';
import { AttachmentRepository } from './attachment.repository';
import { AttachmentController } from './attachment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Attachment, AttachmentSchema } from './schema/attachments.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MESSAGE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'task_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: Attachment.name, schema: AttachmentSchema },
    ]),
  ],
  controllers: [AttachmentController],
  providers: [AttachmentService, AttachmentRepository],
  exports: [AttachmentService, AttachmentRepository],
})
export class AttachmentModule {}
