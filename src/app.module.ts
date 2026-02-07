import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppController2 } from './app2.controller'
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [ProjectsModule],
  controllers: [AppController, AppController2],
  providers: [AppService],
})
export class AppModule {}
