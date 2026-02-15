import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaClient: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    })
  }

  async validate(payload: { user_id: string, purpose: string }) {
    if (payload.purpose === 'password_reset') throw new UnauthorizedException('Invalid token')

    const user = await this.prismaClient.user.findUnique({
      where: {
        id: payload.user_id,
      },
    })

    if (!user) return null

    return user
  }
}
