import { Test, TestingModule } from '@nestjs/testing'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { Project } from 'src/generated/prisma/client'
import { PrismaService } from 'src/prisma.service'
import { paginateOutput } from 'src/utils/pagination.utils'
import { ProjectsController } from './projects.controller'
import { mockedProjects, mockPaginationQuery } from './projects.mocks'
import { ProjectsModule } from './projects.module'
import { ProjectsService } from './projects.service'

describe('ProjectsController', () => {
  let controller: ProjectsController
  let service: ProjectsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectsModule],
    })
      .overrideProvider(ProjectsService)
      .useValue(service)
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .overrideProvider(RequestContextService)
      .useValue({ getUserId: jest.fn().mockReturnValue('user-id-1234') })
      .compile()

    controller = module.get<ProjectsController>(ProjectsController)
    service = module.get<ProjectsService>(ProjectsService)
  })

  describe('getAll', () => {
    test('should return a paginated list of projects', async () => {
      const mockedResponse = paginateOutput<Project>(
        mockedProjects,
        mockedProjects.length,
        mockPaginationQuery,
      )

      jest.spyOn(service, 'getAll').mockResolvedValue(mockedResponse)

      const response = await controller.getAll()

      expect(response).toEqual(mockedResponse)
      expect(service.getAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('getById', () => {
    test('should be able to return a single project by id', async () => {
      const project = mockedProjects[0]

      jest.spyOn(service, 'getById').mockResolvedValue({
        ...project,
        tasks: [],
      })

      const response = await controller.getById(project.id)

      expect(response).toEqual({
        ...project,
        tasks: [],
      })
      expect(service.getById).toHaveBeenCalledWith(project.id)
      expect(service.getById).toHaveBeenCalledTimes(1)
    })
  })

  describe('create', () => {
    test('should be able to create a new project', async () => {
      const project = mockedProjects[0]

      jest.spyOn(service, 'create').mockResolvedValue(project)

      const response = await controller.create({
        name: project.name,
        description: project.description as string,
      })

      expect(response).toEqual(project)
      expect(service.create).toHaveBeenCalledTimes(1)
    })

    test('should be able to handle validation errors', async () => {
      const error = new Error('Name is required')

      jest.spyOn(service, 'create').mockRejectedValue(error)

      await expect(
        controller.create({
          name: '',
          description: '',
        }),
      ).rejects.toThrow('Name is required')
    })
  })

  describe('update', () => {
    test('should be able to update a project', async () => {
      const project = { ...mockedProjects[0], tasks: [] }

      jest.spyOn(service, 'update').mockResolvedValue(project)

      const response = await controller.update(project.id, {
        name: project.name,
        description: project.description as string,
      })

      expect(response).toEqual(project)
      expect(service.update).toHaveBeenCalledTimes(1)
    })
  })

  describe('delete', () => {
    test('should be able to delete a project', async () => {
      const project = mockedProjects[0]

      jest.spyOn(service, 'delete').mockImplementation()

      await controller.delete(project.id)

      expect(service.delete).toHaveBeenCalledTimes(1)
    })
  })
})
