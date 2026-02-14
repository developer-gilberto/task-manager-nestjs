import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { SignInDTO, SignUpDTO } from './auth.dto'
import { AuthService } from './auth.service'

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  protected(@Req() req: any) {
    return { message: `Authenticated! Welcome ${req.user.name}` }
  }
}
