import 'dotenv/config'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { CONSTANTS } from './constants'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableVersioning({ type: VersioningType.URI })
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Task Manager')
    .setDescription('Task manager developed with nestjs.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'jwt',
    )
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/v1/docs', app, documentFactory)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: CONSTANTS.EMAIL_QUEUE,
      queueOptions: { durable: true },
    },
  })

  await app.startAllMicroservices()

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
