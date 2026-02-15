import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CONSTANTS } from 'src/constants';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendForgotPasswordRequest(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Redefinição de senha',
      template: 'forgot-password.hbs',
      context: {
        url: `${CONSTANTS.BASE_URL}${process.env.RESET_PASSWORD_PATH!}?token=${token}`
      }
    })
  }
}
