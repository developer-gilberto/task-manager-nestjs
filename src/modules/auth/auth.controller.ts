import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import type { User } from 'src/generated/prisma/client'
import { UsersService } from '../users/users.service'
import { ForgotPasswordDTO, ResetPasswordDTO, SignInDTO, SignUpDTO } from './auth.dto'
import { AuthService } from './auth.service'

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() data: SignUpDTO) {
    return await this.authService.signup(data)
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() data: SignInDTO) {
    return await this.authService.signin(data)
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('jwt')
  protected(@AuthenticatedUser() user: User) {
    return { message: `Authenticated! Welcome ${user.name}` }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  async me(@AuthenticatedUser() user: User) {
    const userData = await this.userService.getById(user.id)

    if (!userData) throw new UnauthorizedException('User not found')

    return {
      id: userData.id,
      name: userData.name,
      avatar: userData.avatar,
      email: userData.email,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() data: ForgotPasswordDTO) {
    return this.authService.forgotPassword(data.email)
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() data: ResetPasswordDTO) {
    return this.authService.resetPassword(data.token, data.new_password)
  }
}
