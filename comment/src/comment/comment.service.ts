import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<any> {
    return await this.commentRepository.create(createCommentDto);
  }

  async readSingleComment(comment_id: string): Promise<any> {
    return await this.commentRepository.readSingleComment(comment_id);
  }

  async listTaskComments(task_id: string): Promise<any> {
    return await this.commentRepository.listTaskComments(task_id);
  }

  async updateComment(
    comment_id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<any> {
    return await this.commentRepository.update(comment_id, updateCommentDto);
  }

  async deleteComment(comment_id: string): Promise<any> {
    return await this.commentRepository.delete(comment_id);
  }

  async removeAllTaskComment(task_id: string): Promise<any> {
    return await this.commentRepository.removeAllCommentsByTaskId(task_id);
  }
}
