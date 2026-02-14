import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { CONSTANTS } from 'src/constants'
import { PrismaService } from 'src/prisma.service'
import { UsersService } from '../users/users.service'
import { SignInDTO, SignUpDTO } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaClient: PrismaService,
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
}
