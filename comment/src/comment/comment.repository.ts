import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schema/comment-schema';
import { Model, Types } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    return await this.commentModel.create(createCommentDto);
  }

  async readSingleComment(comment_id: string): Promise<any> {
    return await this.commentModel.findOne({
      _id: new Types.ObjectId(comment_id),
    });
  }

  async listTaskComments(task_id: string): Promise<any> {
    return await this.commentModel.find({
      task_id: new Types.ObjectId(task_id),
    });
  }

  async update(
    comment_id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<any> {
    return await this.commentModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(comment_id),
      },
      updateCommentDto,
      {
        new: true,
      },
    );
  }

  async delete(comment_id: string) {
    return await this.commentModel.findOneAndDelete({
      _id: new Types.ObjectId(comment_id),
    });
  }

  async removeAllCommentsByTaskId(task_id: string): Promise<any> {
    return await this.commentModel.deleteMany({
      task_id: new Types.ObjectId(task_id),
    });
  }
}
