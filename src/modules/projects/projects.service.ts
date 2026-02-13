import { Injectable } from '@nestjs/common'
import { CollaboratorRole } from 'src/generated/prisma/enums'
import { PrismaService } from 'src/prisma.service'
import { ProjectsRequestDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaClient: PrismaService) {}

  async getAll() {
    return await this.prismaClient.project.findMany()
  }

  async getById(projectId: string) {
    return await this.prismaClient.project.findFirst({
      where: {
        id: projectId,
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
    const project = await this.prismaClient.project.create({
      data: {
        ...data,
        created_by_id: 'a643b276-92f8-4034-bc4a-32c996e42aba', // REMOVER QDO TIVER AUTENTICACAO
      },
    })

    await this.prismaClient.projectCollaborator.create({
      data: {
        project_id: project.id,
        user_id: project.created_by_id, // REMOVER QDO TIVER AUTENTICACAO
        role: CollaboratorRole.OWNER,
      },
    })

    return project
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
