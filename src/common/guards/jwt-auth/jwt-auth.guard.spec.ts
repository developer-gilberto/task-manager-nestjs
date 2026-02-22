import { ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { JwtAuthGuard } from './jwt-auth.guard'

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard
  let requestContextService: RequestContextService
  let mockExecutionContext: ExecutionContext

  beforeEach(() => {
    requestContextService = {
      setUser: jest.fn(),
    } as any

    guard = new JwtAuthGuard(requestContextService)

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 1, user_name: 'test-user' },
        }),
      }),
    } as ExecutionContext
  })

  test('should return true and set user when authentication successfully', async () => {
    const superCanActivate = jest.spyOn(AuthGuard('jwt').prototype, 'canActivate')
    superCanActivate.mockResolvedValue(true)

    const result = await guard.canActivate(mockExecutionContext)

    expect(result).toBe(true)
    expect(requestContextService.setUser).toHaveBeenCalledWith({
      id: 1,
      user_name: 'test-user',
    })
  })

  test('should return false and not set user when authentication fails', async () => {
    jest.spyOn(AuthGuard('jwt').prototype, 'canActivate').mockResolvedValue(false)

    const result = await guard.canActivate(mockExecutionContext)

    expect(result).toBe(false)
    expect(requestContextService.setUser).not.toHaveBeenCalled()
  })

  test('should throw an error when super.canActivate throws', async () => {
    const error = new Error('Authentication failed')

    jest.spyOn(AuthGuard('jwt').prototype, 'canActivate').mockRejectedValue(error)

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(error)

    expect(requestContextService.setUser).not.toHaveBeenCalled()
  })
})
