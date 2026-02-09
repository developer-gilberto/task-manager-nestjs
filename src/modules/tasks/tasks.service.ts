import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TaskDTO } from './tasks.dto'

@Injectable()
export class TasksService {
  constructor(private readonly prismaClient: PrismaService) {}

  async getAllByProject(projectId: string) {
    return await this.prismaClient.task.findMany({ where: { project_id: projectId } })
  }

  async getById(projectId: string, taskId: string) {
    return await this.prismaClient.task.findFirst({
      where: {
        project_id: projectId,
        id: taskId,
      },
    })
  }

  async create(projectId: string, data: TaskDTO) {
    return await this.prismaClient.task.create({
      data: {
        ...data,
        project_id: projectId,
      },
    })
  }

  async update(projectId: string, taskId: string, data: TaskDTO) {
    return await this.prismaClient.task.update({
      where: {
        id: taskId,
        project_id: projectId,
      },
      data,
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
