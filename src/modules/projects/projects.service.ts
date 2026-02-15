import { Injectable } from '@nestjs/common'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { CollaboratorRole } from 'src/generated/prisma/enums'
import { PrismaService } from 'src/prisma.service'
import { ProjectsRequestDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prismaClient: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  async getAll() {
    const userId = this.requestContext.getUserId()

    return await this.prismaClient.project.findMany({
      where: { created_by_id: userId },
    })
  }

  async getById(projectId: string) {
    const userId = this.requestContext.getUserId()

    return await this.prismaClient.project.findFirst({
      where: {
        id: projectId,
        created_by_id: userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        created_at: true,
        updated_at: true,

        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            due_date: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    })
  }

  async create(data: ProjectsRequestDTO) {
    const userId = this.requestContext.getUserId()

    const project = await this.prismaClient.project.create({
      data: {
        ...data,
        created_by_id: userId,
      },
    })

    await this.prismaClient.projectCollaborator.create({
      data: {
        project_id: project.id,
        user_id: project.created_by_id,
        role: CollaboratorRole.OWNER,
      },
    })

    return project
  }

  async update(projectId: string, data: ProjectsRequestDTO) {
    const userId = this.requestContext.getUserId()

    return await this.prismaClient.project.update({
      where: {
        id: projectId,
        created_by_id: userId,
      },
      data,
    })
  }

  async delete(projectId: string) {
    const userId = this.requestContext.getUserId()

    await this.prismaClient.task.deleteMany({
      where: {
        project_id: projectId,
      },
    })

    return await this.prismaClient.project.delete({
      where: {
        id: projectId,
        created_by_id: userId,
      },
    })
  }
}
