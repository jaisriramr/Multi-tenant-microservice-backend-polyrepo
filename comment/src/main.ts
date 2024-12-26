import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';

dotenv.config(); // Load .env file

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://localhost:5672'],
  //     queue: 'task_queue',
  //     queueOptions: {
  //       durable: false,
  //     },
  //   },
  // });
  // await app.startAllMicroservices();
  await app.listen(process.env.PORT);
  console.log('Comment Service is Listening on port ' + process.env.PORT);
}
bootstrap();
