import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Sprint, SprintSchema } from './schema/sprint.schema';
import { SprintService } from './sprint.service';
import { SprintRepository } from './sprint.repository';
import { SprintController } from './sprint.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sprint.name, schema: SprintSchema }]),
  ],
  controllers: [SprintController],
  providers: [SprintService, SprintRepository],
  exports: [SprintService, SprintRepository],
})
export class SprintModule {}
