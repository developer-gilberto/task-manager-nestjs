import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { CONSTANTS } from 'src/constants'
import { PrismaService } from 'src/prisma.service'
import { UsersService } from '../users/users.service'
import { SignInDTO, SignUpDTO } from './auth.dto'
import { MailService } from '../mail/mail.service'

interface TokenPayload {
  user_id: string
  email: string
  purpose: string
  iat: number
  exp: number
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly prismaClient: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  async signup(data: SignUpDTO) {
    const salt = CONSTANTS.PASSWORD_SALT
    const hash = await bcrypt.hash(data.password, salt)

    const newUser = await this.userService.create({
      ...data,
      password: hash,
    })

    return {
      token: this.jwtService.sign({ user_id: newUser.id }),
    }
  }

  async signin(data: SignInDTO) {
    const storedUser = await this.userService.getByEmail(data.email)

    if (!storedUser) throw new UnauthorizedException()

    const isValidPassword = await bcrypt.compare(data.password, storedUser.password)

    if (!isValidPassword) throw new UnauthorizedException()

    const token = this.jwtService.sign({ user_id: storedUser.id })

    return { user_auth_token: token }
  }

  async forgotPassword(email: string) {
    const user = await this.userService.getByEmail(email)

    if (!user) throw new NotFoundException('User not found')

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      purpose: 'password_reset'
    })

    await this.mailService.sendForgotPasswordRequest(user.email, token)

    return {
      message: 'Password request email sent'
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify<TokenPayload>(token)

      if (payload.purpose !== 'password_reset') throw new BadRequestException('Invalid token')

      const user = await this.userService.getById(payload.user_id)

      if (!user) throw new NotFoundException('User not found')

      const newHash = await bcrypt.hash(newPassword, CONSTANTS.PASSWORD_SALT)

      return await this.prismaClient.user.update({
        where: { id: user.id },
        data: {password: newHash}
      })
    } catch (err) {
      console.log(err)
      throw new BadRequestException('Invalid or expired token')
    }
  }
}
