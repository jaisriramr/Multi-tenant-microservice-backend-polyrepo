import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Types } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    @Inject('MESSAGE_SERVICE') private client: ClientProxy,
  ) {}

  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    try {
      const commentBody = {
        ...createCommentDto,
        task_id: new Types.ObjectId(createCommentDto.task_id),
      };
      const response = await this.commentService.createComment(commentBody);
      if (response) {
        this.client.emit('task_queue', {
          task_id: response?.task_id,
          _id: response?._id,
          type: 'comment',
        });
      }
      return response;
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Get(':comment_id')
  async readSingleComment(@Param('comment_id') comment_id: string) {
    try {
      return await this.commentService.readSingleComment(comment_id);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Get('/tasks/:task_id')
  async listTaskComment(@Param('task_id') task_id: string) {
    try {
      return await this.commentService.listTaskComments(task_id);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Put(':comment_id')
  async updateComment(
    @Param('comment_id') comment_id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    try {
      return await this.commentService.updateComment(
        comment_id,
        updateCommentDto,
      );
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Delete(':comment_id')
  async deleteComment(@Param('comment_id') comment_id: string) {
    try {
      return await this.commentService.deleteComment(comment_id);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Delete('/tasks/:task_id')
  async removeTaskComments(@Param('task_id') task_id: string) {
    try {
      return await this.commentService.removeAllTaskComment(task_id);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }
}
