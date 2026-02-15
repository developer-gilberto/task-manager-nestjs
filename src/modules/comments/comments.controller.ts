import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger'
import { ValidateId } from 'src/common/decorators/validate-id.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { ValidateIdInterceptor } from 'src/common/interceptors/validate-id.interceptor'
import { CommentFullDTO, CommentListItemDTO, CommentRequestDTO } from './comments.dto'
import { CommentsService } from './comments.service'

@Controller({
  version: '1',
  path: 'projects/:project_id/tasks/:task_id/comments',
})
@UseInterceptors(ValidateIdInterceptor)
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  @ValidateId()
  @ApiOkResponse({ type: [CommentListItemDTO], description: 'Get all comments by task' })
  async getAllByTask(@Param('task_id', ParseUUIDPipe) taskId: string) {
    return await this.commentService.getAllByTask(taskId)
  }

  @Get(':comment_id')
  @ValidateId()
  @ApiOkResponse({ type: CommentFullDTO, description: 'Get comments by id' })
  async getById(
    @Param('task_id', ParseUUIDPipe) taskId: string,
    @Param('comment_id', ParseUUIDPipe) commentId: string,
  ) {
    return await this.commentService.getById(taskId, commentId)
  }

  @Post()
  @ValidateId()
  @ApiCreatedResponse({ type: CommentListItemDTO, description: 'Create a new comment' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Param('task_id', ParseUUIDPipe) taskId: string, @Body() data: CommentRequestDTO) {
    return await this.commentService.create(taskId, data)
  }

  @Put(':comment_id')
  @ValidateId()
  @ApiOkResponse({ type: CommentListItemDTO, description: 'Update a comment' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('task_id', ParseUUIDPipe) taskId: string,
    @Param('comment_id', ParseUUIDPipe) commentId: string,
    @Body() data: CommentRequestDTO,
  ) {
    return await this.commentService.update(taskId, commentId, data)
  }

  @Delete(':comment_id')
  @ValidateId()
  @ApiNoContentResponse({ description: 'Delete a comment' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('task_id', ParseUUIDPipe) taskId: string,
    @Param('comment_id', ParseUUIDPipe) commentId: string,
  ) {
    return await this.commentService.delete(taskId, commentId)
  }
}
