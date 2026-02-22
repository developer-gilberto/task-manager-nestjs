import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma.service'
import { MailModule } from '../mail/mail.module'
import { MailService } from '../mail/mail.service'
import { mockedUsers } from '../users/users.mocks'
import { UsersService } from '../users/users.service'
import { AuthService } from './auth.service'

jest.mock('bcrypt')

describe('AuthService', () => {
  let service: AuthService
  let userService: UsersService
  let mailService: MailService
  let prisma: PrismaService
  let jwtService: JwtService

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret'
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              update: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('123'),
            verify: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            getByEmail: jest.fn(),
            getById: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendForgotPasswordRequest: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userService = module.get<UsersService>(UsersService)
    prisma = module.get<PrismaService>(PrismaService)
    mailService = module.get<MailService>(MailService)
    jwtService = module.get<JwtService>(JwtService)
  })

  test('should be able to sign up a new user', async () => {
    const user = mockedUsers[0]

    jest.spyOn(prisma.user, 'create').mockResolvedValue(user)
    jest.spyOn(userService, 'create').mockResolvedValue(user)

    const result = await service.signup(user)

    expect(result).toEqual({ token: '123' })
    expect(userService.create).toHaveBeenCalledTimes(1)
  })

  describe('signIn', () => {
    test('should be able to login with the correct credentials', async () => {
      const user = mockedUsers[0]
      jest.spyOn(userService, 'getByEmail').mockResolvedValue(user)

      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      const result = await service.signin({
        email: user.email,
        password: '123',
      })

      expect(result).toEqual({ user_auth_token: '123' })
      expect(userService.getByEmail).toHaveBeenCalledTimes(1)
    })

    test('should return an exception if credentials are wrong', async () => {
      const user = mockedUsers[0]
      jest.spyOn(userService, 'getByEmail').mockResolvedValue(user)

      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(
        service.signin({
          email: user.email,
          password: '123',
        }),
      ).rejects.toThrow(UnauthorizedException)

      expect(userService.getByEmail).toHaveBeenCalledTimes(1)
    })
  })

  describe('forgotPassword', () => {
    test('should be able to request the e-mail to reset the password', async () => {
      const user = mockedUsers[0]
      jest.spyOn(userService, 'getByEmail').mockResolvedValue(user)
      jest.spyOn(mailService, 'sendForgotPasswordRequest').mockImplementation()

      const result = await service.forgotPassword(user.email)

      expect(result).toEqual({
        message: 'Password request email sent',
      })
      expect(userService.getByEmail).toHaveBeenCalledTimes(1)
    })

    test('should return NotFoundException if user not exists', async () => {
      const user = mockedUsers[0]
      jest.spyOn(userService, 'getByEmail').mockResolvedValue(null)

      await expect(service.forgotPassword(user.email)).rejects.toThrow(NotFoundException)
    })

    test('should be able to reset the password from e-mail link', async () => {
      const user = mockedUsers[0]
      jest.spyOn(userService, 'getById').mockResolvedValue(user as any)
      jest.spyOn(prisma.user, 'update').mockResolvedValue(user as any)
      jest.spyOn(jwtService, 'verify').mockReturnValue({
        purpose: 'password_reset',
      })
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      const result = await service.resetPassword('123', '123')

      expect(result).toEqual(user)
      expect(userService.getById).toHaveBeenCalledTimes(1)
      expect(prisma.user.update).toHaveBeenCalledTimes(1)
    })

    test('should throw an error if the token is invalid', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({
        purpose: 'test',
      })

      await expect(service.resetPassword('123', '123')).rejects.toThrow(BadRequestException)
    })

    test('should throw an error if user not exists', async () => {
      jest.spyOn(userService, 'getById').mockResolvedValue(null)
      jest.spyOn(jwtService, 'verify').mockReturnValue({
        purpose: 'password_reset',
      })

      await expect(service.resetPassword('123', '123')).rejects.toThrow(BadRequestException)
    })
  })
})
