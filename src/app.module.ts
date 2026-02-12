import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppControllerV2 } from './app.v2.controller'
import { ProjectsModule } from './modules/projects/projects.module'
import { TasksModule } from './modules/tasks/tasks.module'
import { UsersModule } from './modules/users/users.module'
import { PrismaService } from './prisma.service'
import { CollaboratorsModule } from './modules/collaborators/collaborators.module';

@Module({
  imports: [ProjectsModule, TasksModule, UsersModule, CollaboratorsModule],
  controllers: [AppController, AppControllerV2],
  providers: [AppService, PrismaService],
})
export class AppModule {}
