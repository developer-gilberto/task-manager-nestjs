import { Injectable } from '@nestjs/common'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { PrismaService } from 'src/prisma.service'
import { paginate, paginateOutput } from 'src/utils/pagination.utils'
import { CreateUserDTO, UpdateUserDTO, UserListItemDTO } from './users.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prismaClient: PrismaService) {}

  async getById(userId: string) {
    return await this.prismaClient.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        created_at: true,
        updated_at: true,
        created_projects: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    })
  }

  async getByEmail(email: string) {
    return await this.prismaClient.user.findFirst({ where: { email } })
  }

  async getAll(query?: QueryPaginationDTO) {
    const { skip, take } = paginate(query)

    const users = await this.prismaClient.user.findMany({
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    })

    const total = await this.prismaClient.user.count()

    return paginateOutput<UserListItemDTO>(users, total, query)
  }

  async create(data: CreateUserDTO) {
    return await this.prismaClient.user.create({ data })
  }

  async update(userId: string, data: UpdateUserDTO) {
    return await this.prismaClient.user.update({
      where: {
        id: userId,
      },
      data,
    })
  }

  async delete(userId: string) {
    return await this.prismaClient.user.delete({ where: { id: userId } })
  }
}
