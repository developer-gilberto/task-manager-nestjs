import { Injectable, NotFoundException } from '@nestjs/common'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { paginate, paginateOutput } from 'src/utils/pagination.utils'
import { CommentListItemDTO, CommentRequestDTO } from './comments.dto'

@Injectable()
export class CommentsService {
  constructor(
    private readonly PrismaClient: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  async getAllByTask(taskId: string, query?: QueryPaginationDTO) {
    const { skip, take } = paginate(query)

    const comments = await this.PrismaClient.comment.findMany({
      skip,
      take,
      where: { task_id: taskId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })

    const total = await this.PrismaClient.comment.count({
      where: { task_id: taskId },
    })

    return paginateOutput<CommentListItemDTO>(comments, total, query)
  }

  async getById(taskId: string, commentId: string) {
    return await this.PrismaClient.comment.findFirst({
      where: {
        id: commentId,
        task_id: taskId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            project_id: true,
          },
        },
      },
    })
  }

  async create(taskId: string, data: CommentRequestDTO) {
    const userId = this.requestContext.getUserId()

    return await this.PrismaClient.comment.create({
      data: {
        content: data.content,
        task_id: taskId,
        author_id: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })
  }

  async update(taskId: string, commentId: string, data: CommentRequestDTO) {
    const userId = this.requestContext.getUserId()

    const comment = await this.PrismaClient.comment.findFirst({
      where: {
        id: commentId,
        task_id: taskId,
        author_id: userId,
      },
    })

    if (!comment) throw new NotFoundException('Comment not found')

    return await this.PrismaClient.comment.update({
      where: { id: commentId },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })
  }

  async delete(taskId: string, commentId: string) {
    const userId = this.requestContext.getUserId()

    const comment = await this.PrismaClient.comment.findFirst({
      where: {
        id: commentId,
        task_id: taskId,
        author_id: userId,
      },
    })

    if (!comment) throw new NotFoundException('Comment not found')

    return await this.PrismaClient.comment.delete({
      where: { id: commentId },
    })
  }
}
