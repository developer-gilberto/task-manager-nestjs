import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProjectsRequestDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaClient: PrismaService) {}

  async getAll() {
    return await this.prismaClient.project.findMany()
  }

  async getById(projectId: string) {
    return await this.prismaClient.project.findFirst({ where: { id: projectId } })
  }

  async create(data: ProjectsRequestDTO) {
    return await this.prismaClient.project.create({ data })
  }

  async update(projectId: string, data: ProjectsRequestDTO) {
    return await this.prismaClient.project.update({ where: { id: projectId }, data })
  }

  async delete(projectId: string) {
    await this.prismaClient.task.deleteMany({
      where: { project_id: projectId },
    })

    return await this.prismaClient.project.delete({ where: { id: projectId } })
  }
}
