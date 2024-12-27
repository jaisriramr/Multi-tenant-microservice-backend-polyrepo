import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisPubSubService {
  private publisher: Redis;
  private subscriber: Redis;

  constructor() {
    this.publisher = new Redis(); // connect to redis
    this.subscriber = new Redis(); // separate connection for subscription
  }

  publish(channel: string, message: string) {
    this.publisher.publish(channel, message);
  }

  subscribe(channel: string, callback: (message: string) => void) {
    this.subscriber.subscribe(channel, (err, count) => {
      if (err) {
        console.log('Failed to subscribe: ', err.message);
      } else {
        console.log(`Subscribed to ${count} channel(S).`);
      }
    });

    this.subscriber.on('message', (subscribedChannel, message) => {
      if (subscribedChannel === channel) {
        callback(message);
      }
    });
  }
}
