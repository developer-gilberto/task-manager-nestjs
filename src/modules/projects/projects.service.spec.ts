import { faker } from '@faker-js/faker'
import { Test, TestingModule } from '@nestjs/testing'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { Project } from 'src/generated/prisma/client'
import { PrismaService } from 'src/prisma.service'
import { paginateOutput } from 'src/utils/pagination.utils'
import { ProjectsService } from './projects.service'

describe('ProjectsService', () => {
  let service: ProjectsService
  let prismaClient: PrismaService

  const mockedProjects = faker.helpers.multiple<Project>(
    () => {
      return {
        id: faker.string.uuid(),
        name: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        created_by_id: 'user-id-1234',
        created_at: new Date(),
        updated_at: new Date(),
      }
    },
    { count: 10 },
  )

  const mockPaginationQuery: QueryPaginationDTO = {
    page: '1',
    page_size: '10',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: {
            project: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
            },
            projectCollaborator: {
              create: jest.fn(),
            },
            task: {
              deleteMany: jest.fn(),
            },
          },
        },
        {
          provide: RequestContextService,
          useValue: {
            getUserId: jest.fn().mockReturnValue('user-id-1234'),
          },
        },
      ],
    }).compile()

    service = module.get<ProjectsService>(ProjectsService)
    prismaClient = module.get<PrismaService>(PrismaService)
  })

  test('should be able to return a paginated list of projects', async () => {
    jest.spyOn(prismaClient.project, 'findMany').mockResolvedValue(mockedProjects)

    jest.spyOn(prismaClient.project, 'count').mockResolvedValue(mockedProjects.length)

    const result = await service.getAll(mockPaginationQuery)

    expect(result).toEqual(
      paginateOutput<Project>(mockedProjects, mockedProjects.length, mockPaginationQuery),
    )

    expect(prismaClient.project.findMany).toHaveBeenCalledTimes(1)
  })

  test('should be able to return a project by id', async () => {
    const project = mockedProjects[0]

    jest.spyOn(prismaClient.project, 'findFirst').mockResolvedValue(project)

    const result = await service.getById(project.id)

    expect(result).toEqual(project)
    expect(prismaClient.project.findFirst).toHaveBeenCalledTimes(1)
  })

  test('should be able to create a new project', async () => {
    const project = mockedProjects[0]

    jest.spyOn(prismaClient.project, 'create').mockResolvedValue(project)

    const result = await service.create({
      name: project.name,
      description: project.description as string,
    })

    expect(result).toEqual(project)
    expect(prismaClient.project.create).toHaveBeenCalledTimes(1)
  })

  test('should be able to update a project', async () => {
    const project = mockedProjects[0]

    jest.spyOn(prismaClient.project, 'update').mockResolvedValue(project)

    const result = await service.update(project.id, {
      name: project.name,
      description: project.description as string,
    })

    expect(result).toEqual(project)
    expect(prismaClient.project.update).toHaveBeenCalledTimes(1)
  })

  test('should be able to delete a project', async () => {
    const project = mockedProjects[0]

    await service.delete(project.id)

    expect(prismaClient.task.deleteMany).toHaveBeenCalledTimes(1)
    expect(prismaClient.project.delete).toHaveBeenCalledTimes(1)
  })
})
