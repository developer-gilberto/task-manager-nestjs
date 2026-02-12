import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CollaboratorRole } from 'src/generated/prisma/enums'
import { PrismaService } from 'src/prisma.service'
import { AddCollaboratorDTO, UpdateCollaboratorDTO } from './collaborators.dto'

@Injectable()
export class CollaboratorsService {
  constructor(private readonly prismaClient: PrismaService) {}

  async getAllByProject(project_id: string) {
    return await this.prismaClient.projectCollaborator.findMany({
      where: { project_id },
      include: {
        user: {
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

  async create(project_id: string, data: AddCollaboratorDTO) {
    const user = await this.prismaClient.user.findUnique({
      where: { id: data.user_id },
    })

    if (!user) throw new NotFoundException('User specified not found')

    return await this.prismaClient.projectCollaborator.create({
      data: {
        user_id: data.user_id,
        role: data.role,
        project_id,
      },
      include: {
        user: {
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

  async update(project_id: string, user_id: string, data: UpdateCollaboratorDTO) {
    const collaborator = await this.prismaClient.projectCollaborator.findUnique({
      where: {
        user_id_project_id: {
          user_id,
          project_id,
        },
      },
    })

    if (!collaborator) throw new NotFoundException('Collaborator not found in this project')

    return await this.prismaClient.projectCollaborator.update({
      where: {
        user_id_project_id: {
          user_id,
          project_id,
        },
      },
      data: {
        role: data.role,
      },
      include: {
        user: {
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

  async delete(project_id: string, user_id: string) {
    const collaborator = await this.prismaClient.projectCollaborator.findUnique({
      where: {
        user_id_project_id: {
          user_id,
          project_id,
        },
      },
    })

    if (!collaborator) throw new NotFoundException('Collaborator not found in this project')

    if (collaborator.role === CollaboratorRole.OWNER)
      throw new BadRequestException('The project owner cannot be removed')

    await this.prismaClient.projectCollaborator.delete({
      where: {
        user_id_project_id: {
          user_id,
          project_id,
        },
      },
    })
  }
}
