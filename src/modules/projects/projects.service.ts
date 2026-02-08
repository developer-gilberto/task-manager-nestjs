import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProjectsRequestDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaClient: PrismaService) {}

  getAll() {
    return this.prismaClient.project.findMany()
  }

  getById(id: string) {
    return this.prismaClient.project.findFirst({ where: { id } })
  }

  create(data: ProjectsRequestDTO) {
    return this.prismaClient.project.create({ data })
  }

  update(id: string, data: ProjectsRequestDTO) {
    return this.prismaClient.project.update({ where: { id }, data })
  }

  delete(id: string) {
    return this.prismaClient.project.delete({ where: { id } })
  }
}
