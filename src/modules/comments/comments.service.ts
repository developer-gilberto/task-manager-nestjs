import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CommentRequestDTO } from './comments.dto'

@Injectable()
export class CommentsService {
  constructor(private readonly PrismaClient: PrismaService) {}

  async getAllByTask(task_id: string) {
    return await this.PrismaClient.comment.findMany({
      where: { task_id },
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

  async getById(task_id: string, comment_id: string) {
    return await this.PrismaClient.comment.findFirst({
      where: {
        id: comment_id,
        task_id,
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

  async create(task_id: string, data: CommentRequestDTO) {
    return await this.PrismaClient.comment.create({
      data: {
        content: data.content,
        task_id,
        author_id: '123', // MUDAR ID DO USUARIO
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

  async update(task_id: string, comment_id: string, data: CommentRequestDTO) {
    const comment = await this.PrismaClient.comment.findFirst({
      where: {
        id: comment_id,
        task_id,
      },
    })

    if (!comment) throw new NotFoundException('Comment not found')

    return await this.PrismaClient.comment.update({
      where: { id: comment_id },
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

  async delete(task_id: string, comment_id: string) {
    const comment = await this.PrismaClient.comment.findFirst({
      where: {
        id: comment_id,
        task_id,
      },
    })

    if (!comment) throw new NotFoundException('Comment not found')

    return await this.PrismaClient.comment.delete({
      where: { id: comment_id },
    })
  }
}
