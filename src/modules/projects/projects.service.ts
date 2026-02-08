import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProjectsRequestDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaClient: PrismaService) {}

  async getAll() {
    return await this.prismaClient.project.findMany()
  }

  async getById(id: string) {
    return await this.prismaClient.project.findFirst({ where: { id } })
  }

  async create(data: ProjectsRequestDTO) {
    return await this.prismaClient.project.create({ data })
  }

  async update(id: string, data: ProjectsRequestDTO) {
    return await this.prismaClient.project.update({ where: { id }, data })
  }

  async delete(id: string) {
    return await this.prismaClient.project.delete({ where: { id } })
  }
}
