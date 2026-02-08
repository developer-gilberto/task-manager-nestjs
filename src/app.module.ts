import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppController2 } from './app2.controller'
import { ProjectsModule } from './modules/projects/projects.module'
import { PrismaService } from './prisma.service'
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [ProjectsModule, TasksModule],
  controllers: [AppController, AppController2],
  providers: [AppService, PrismaService],
})
export class AppModule {}
