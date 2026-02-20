import { Injectable } from '@nestjs/common'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { PrismaService } from 'src/prisma.service'
import { paginate, paginateOutput } from 'src/utils/pagination.utils'
import { TaskListItemDTO, TaskRequestDTO } from './tasks.dto'

@Injectable()
export class TasksService {
  constructor(private readonly prismaClient: PrismaService) {}

  async getAllByProject(projectId: string, query?: QueryPaginationDTO) {
    const { skip, take } = paginate(query)

    const tasks = await this.prismaClient.task.findMany({
      skip,
      take,
      where: { project_id: projectId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        due_date: true,
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
    })

    const total = await this.prismaClient.task.count({
      where: { project_id: projectId },
    })

    return paginateOutput<TaskListItemDTO>(tasks, total, query)
  }

  async getById(projectId: string, taskId: string) {
    return await this.prismaClient.task.findFirst({
      where: {
        project_id: projectId,
        id: taskId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        comments: {
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
        },
      },
    })
  }

  async create(projectId: string, data: TaskRequestDTO) {
    return await this.prismaClient.task.create({
      data: {
        ...data,
        project_id: projectId,
      },
      include: {
        assignee: {
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

  async update(projectId: string, taskId: string, data: TaskRequestDTO) {
    return await this.prismaClient.task.update({
      where: {
        id: taskId,
        project_id: projectId,
      },
      data,
      include: {
        assignee: {
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

  async delete(projectId: string, taskId: string) {
    return await this.prismaClient.task.delete({
      where: {
        id: taskId,
        project_id: projectId,
      },
    })
  }
}
