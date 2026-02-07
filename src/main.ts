import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableVersioning({ type: VersioningType.URI })
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Task Manager')
    .setDescription('Task manager developed with nestjs.')
    .setVersion('1.0')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/v1/docs', app, documentFactory)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
