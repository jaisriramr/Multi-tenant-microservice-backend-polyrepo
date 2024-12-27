import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Org, OrgSchema } from './schema/org.schema';
import { OrgController } from './org.controller';
import { OrgService } from './org.service';
import { OrgRepository } from './org.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'user_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    MongooseModule.forFeature([{ name: Org.name, schema: OrgSchema }]),
  ],
  controllers: [OrgController],
  providers: [OrgService, OrgRepository],
  exports: [OrgService, OrgRepository],
})
export class OrgModule {}
