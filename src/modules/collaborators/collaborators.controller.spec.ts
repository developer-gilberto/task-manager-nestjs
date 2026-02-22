import { Test, TestingModule } from '@nestjs/testing'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { ProjectCollaborator } from 'src/generated/prisma/client'
import { PrismaService } from 'src/prisma.service'
import { paginateOutput } from 'src/utils/pagination.utils'
import { CollaboratorsController } from './collaborators.controller'
import { mockedCollaborators, mockPaginationQuery } from './collaborators.mock'
import { CollaboratorsModule } from './collaborators.module'
import { CollaboratorsService } from './collaborators.service'

describe('CollaboratorsController', () => {
  let controller: CollaboratorsController
  let service: CollaboratorsService
  const projectId = 'project-1'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CollaboratorsModule],
    })
      .overrideProvider(CollaboratorsService)
      .useValue(service)
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .overrideProvider(RequestContextService)
      .useValue({ getUserId: jest.fn().mockReturnValue('user-1') })
      .compile()

    controller = module.get<CollaboratorsController>(CollaboratorsController)
    service = module.get<CollaboratorsService>(CollaboratorsService)
  })

  describe('findAll', () => {
    it('should return a paginated list of collaborators', async () => {
      const mockedResponse = paginateOutput<ProjectCollaborator>(
        mockedCollaborators,
        mockedCollaborators.length,
        mockPaginationQuery,
      )

      jest.spyOn(service, 'getAllByProject').mockResolvedValue(mockedResponse as any)

      const response = await controller.getAllByProject(projectId, mockPaginationQuery)

      expect(response).toEqual(mockedResponse)
      expect(service.getAllByProject).toHaveBeenCalledTimes(1)
    })
  })

  describe('create', () => {
    it('should be able to create a new collaborator', async () => {
      const collaborator = mockedCollaborators[0]

      jest.spyOn(service, 'create').mockResolvedValue(collaborator as any)

      const response = await controller.create(projectId, {
        user_id: 'user-1',
        role: 'EDITOR',
      })

      expect(response).toEqual(collaborator)
      expect(service.create).toHaveBeenCalledTimes(1)
    })

    it('should be able to handle validation errors', async () => {
      const error = new Error('UserId is required')

      jest.spyOn(service, 'create').mockRejectedValue(error)

      await expect(controller.create(projectId, { user_id: '' })).rejects.toThrow(
        'UserId is required',
      )
    })
  })

  describe('update', () => {
    it('should be able to update a collaborator', async () => {
      const collaborator = mockedCollaborators[0]

      jest.spyOn(service, 'update').mockResolvedValue(collaborator as any)

      const response = await controller.update(projectId, collaborator.id, {
        role: 'OWNER',
      })

      expect(response).toEqual(collaborator)
      expect(service.update).toHaveBeenCalledTimes(1)
    })
  })

  describe('delete', () => {
    it('should be able to delete a collaborator', async () => {
      jest.spyOn(service, 'delete').mockImplementation()
      await controller.delete(projectId, mockedCollaborators[0].id)
      expect(service.delete).toHaveBeenCalledTimes(1)
    })
  })
})
