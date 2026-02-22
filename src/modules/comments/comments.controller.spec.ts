import { Test, TestingModule } from '@nestjs/testing'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { Comment } from 'src/generated/prisma/client'
import { PrismaService } from 'src/prisma.service'
import { paginateOutput } from 'src/utils/pagination.utils'
import { CommentsController } from './comments.controller'
import { mockedComments, mockPaginationQuery } from './comments.mock'
import { CommentsModule } from './comments.module'
import { CommentsService } from './comments.service'

describe('CommentsController', () => {
  let controller: CommentsController
  let service: CommentsService
  const taskId = 'task-1'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommentsModule],
    })
      .overrideProvider(CommentsService)
      .useValue(service)
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .overrideProvider(RequestContextService)
      .useValue({ getUserId: jest.fn().mockReturnValue('user-1') })
      .compile()

    controller = module.get<CommentsController>(CommentsController)
    service = module.get<CommentsService>(CommentsService)
  })

  describe('findAll', () => {
    it('should return a paginated list of comments', async () => {
      const mockedResponse = paginateOutput<Comment>(
        mockedComments,
        mockedComments.length,
        mockPaginationQuery,
      )

      jest.spyOn(service, 'getAllByTask').mockResolvedValue(mockedResponse as any)

      const response = await controller.getAllByTask(taskId, mockPaginationQuery)

      expect(response).toEqual(mockedResponse)
      expect(service.getAllByTask).toHaveBeenCalledTimes(1)
    })
  })

  describe('getById', () => {
    it('should be able to return a single comment by Id', async () => {
      const comment = mockedComments[0]
      const commentId = comment.id

      jest.spyOn(service, 'getById').mockResolvedValue(comment as any)
      const response = await controller.getById(taskId, commentId)

      expect(response).toEqual(comment)
      expect(service.getById).toHaveBeenCalledWith(taskId, commentId)
      expect(service.getById).toHaveBeenCalledTimes(1)
    })
  })

  describe('create', () => {
    it('should be able to create a new comment', async () => {
      const comment = mockedComments[0]

      jest.spyOn(service, 'create').mockResolvedValue(comment as any)

      const response = await controller.create(taskId, {
        content: comment.content,
      })

      expect(response).toEqual(comment)
      expect(service.create).toHaveBeenCalledTimes(1)
    })

    it('should be able to handle validation errors', async () => {
      const error = new Error('Content is required')

      jest.spyOn(service, 'create').mockRejectedValue(error)

      await expect(controller.create(taskId, { content: '' })).rejects.toThrow(
        'Content is required',
      )
    })
  })

  describe('update', () => {
    it('should be able to update a comment', async () => {
      const comment = mockedComments[0]

      jest.spyOn(service, 'update').mockResolvedValue(comment as any)

      const response = await controller.update(taskId, comment.id, {
        content: comment.content,
      })

      expect(response).toEqual(comment)
      expect(service.update).toHaveBeenCalledTimes(1)
    })
  })

  describe('delete', () => {
    it('should be able to delete a comment', async () => {
      jest.spyOn(service, 'delete').mockImplementation()
      await controller.delete(taskId, mockedComments[0].id)
      expect(service.delete).toHaveBeenCalledTimes(1)
    })
  })
})
