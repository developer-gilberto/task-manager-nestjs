import { ExecutionContext, NotFoundException } from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { Reflector } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { of } from 'rxjs'
import { CONSTANTS } from 'src/constants'
import { PrismaService } from 'src/prisma.service'
import { ValidateIdInterceptor } from './validate-id.interceptor'

describe('ValidateIdInterceptor', () => {
  let interceptor: ValidateIdInterceptor
  let reflector: Reflector
  let prismaClient: PrismaService

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn(),
    getHandler: jest.fn(),
  } as unknown as ExecutionContext

  const mockCallHandler = {
    handle: jest.fn(() => of({})),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateIdInterceptor,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            project: {
              findFirst: jest.fn(),
            },
            task: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile()

    interceptor = module.get<ValidateIdInterceptor>(ValidateIdInterceptor)
    reflector = module.get<Reflector>(Reflector)
    prismaClient = module.get<PrismaService>(PrismaService)
  })

  test('should skip validation if decorator is not present', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false)

    const result = await interceptor.intercept(mockExecutionContext, mockCallHandler)

    expect(reflector.get).toHaveBeenCalledWith(
      CONSTANTS.VALIDATE_ID_KEY,
      mockExecutionContext.getHandler(),
    )
    expect(result).toBeDefined()
    expect(prismaClient.project.findFirst).not.toHaveBeenCalled()
  })

  test('should validate project id and throw if project is not found', async () => {
    const mockRequest = {
      params: {
        project_id: 'project-id-1234',
      },
    }

    jest.spyOn(reflector, 'get').mockReturnValue(true)
    jest.spyOn(mockExecutionContext, 'switchToHttp').mockReturnValue({
      getRequest: () => mockRequest,
    } as HttpArgumentsHost)
    jest.spyOn(prismaClient.project, 'findFirst').mockResolvedValue(null)

    await expect(interceptor.intercept(mockExecutionContext, mockCallHandler)).rejects.toThrow(
      NotFoundException,
    )

    expect(prismaClient.project.findFirst).toHaveBeenCalledWith({
      where: { id: 'project-id-1234' },
    })
  })

  test('should validate project and continue if project exists', async () => {
    const mockRequest = {
      params: {
        project_id: 'project-id-1234',
      },
    }

    jest.spyOn(reflector, 'get').mockReturnValue(true)
    jest.spyOn(mockExecutionContext, 'switchToHttp').mockReturnValue({
      getRequest: () => mockRequest,
    } as HttpArgumentsHost)
    jest
      .spyOn(prismaClient.project, 'findFirst')
      .mockResolvedValue({ id: 'project-id-1234' } as any)

    const result = await interceptor.intercept(mockExecutionContext, mockCallHandler)

    expect(result).toBeDefined()
    expect(prismaClient.project.findFirst).toHaveBeenCalledWith({
      where: { id: 'project-id-1234' },
    })
  })

  test('should validate task id and throw if task is not found', async () => {
    const mockRequest = {
      params: {
        project_id: 'project-id-1234',
        task_id: 'task-id-1234',
      },
    }

    jest.spyOn(reflector, 'get').mockReturnValue(true)
    jest.spyOn(mockExecutionContext, 'switchToHttp').mockReturnValue({
      getRequest: () => mockRequest,
    } as HttpArgumentsHost)
    jest
      .spyOn(prismaClient.project, 'findFirst')
      .mockResolvedValue({ id: 'project-id-1234' } as any)
    jest.spyOn(prismaClient.task, 'findFirst').mockResolvedValue(null)

    await expect(interceptor.intercept(mockExecutionContext, mockCallHandler)).rejects.toThrow(
      NotFoundException,
    )

    expect(prismaClient.task.findFirst).toHaveBeenCalledWith({
      where: { project_id: 'project-id-1234', id: 'task-id-1234' },
    })
  })

  test('should validate both project and task and continue if both exists', async () => {
    const mockRequest = {
      params: {
        project_id: 'project-id-1234',
        task_id: 'task-id-1234',
      },
    }

    jest.spyOn(reflector, 'get').mockReturnValue(true)
    jest.spyOn(mockExecutionContext, 'switchToHttp').mockReturnValue({
      getRequest: () => mockRequest,
    } as HttpArgumentsHost)
    jest
      .spyOn(prismaClient.project, 'findFirst')
      .mockResolvedValue({ id: 'project-id-1234' } as any)
    jest.spyOn(prismaClient.task, 'findFirst').mockResolvedValue({ id: 'task-id-1234' } as any)

    const result = await interceptor.intercept(mockExecutionContext, mockCallHandler)

    expect(result).toBeDefined()
    expect(prismaClient.project.findFirst).toHaveBeenCalledWith({
      where: { id: 'project-id-1234' },
    })
    expect(prismaClient.task.findFirst).toHaveBeenCalledWith({
      where: { project_id: 'project-id-1234', id: 'task-id-1234' },
    })
  })
})
