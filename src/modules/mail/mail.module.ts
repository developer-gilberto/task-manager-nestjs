import * as path from 'node:path'
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { CONSTANTS } from 'src/constants'
import { MailConsumer } from './mail.consumer'
import { MailService } from './mail.service'

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: CONSTANTS.IS_PRODUCTION,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: CONSTANTS.EMAIL_SENDER,
      },
      template: {
        dir: path.join(__dirname, './templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ClientsModule.register([
      {
        name: CONSTANTS.EMAIL_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: CONSTANTS.EMAIL_QUEUE,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [MailConsumer],
  providers: [MailService],
  exports: [MailService, ClientsModule],
})
export class MailModule {}
