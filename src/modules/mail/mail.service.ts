import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { CONSTANTS } from 'src/constants'

@Injectable()
export class MailService {
  constructor(@Inject(CONSTANTS.EMAIL_SERVICE) private readonly client: ClientProxy) {}

  async sendForgotPasswordRequest(email: string, token: string) {
    const url = `${CONSTANTS.BASE_URL}${process.env.RESET_PASSWORD_PATH!}?token=${token}`

    this.client.emit(CONSTANTS.SEND_PASSWORD_RESET, { email, url })
  }
}
