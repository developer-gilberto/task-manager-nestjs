import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { MailerService } from '@nestjs-modules/mailer'
import { CONSTANTS } from 'src/constants'

@Controller()
export class MailConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @EventPattern(CONSTANTS.SEND_PASSWORD_RESET)
  async handlePasswordReset(@Payload() data: { email: string; url: string }) {
    await this.mailerService.sendMail({
      to: data.email,
      subject: 'Redefinição de senha',
      template: 'forgot-password.hbs',
      context: {
        url: data.url,
      },
    })
  }
}
