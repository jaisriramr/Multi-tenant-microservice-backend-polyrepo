import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Sprint, SprintSchema } from './schema/sprint.schema';
import { SprintService } from './sprint.service';
import { SprintRepository } from './sprint.repository';
import { SprintController } from './sprint.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PROJECT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'project_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    MongooseModule.forFeature([{ name: Sprint.name, schema: SprintSchema }]),
  ],
  controllers: [SprintController],
  providers: [SprintService, SprintRepository],
  exports: [SprintService, SprintRepository],
})
export class SprintModule {}
