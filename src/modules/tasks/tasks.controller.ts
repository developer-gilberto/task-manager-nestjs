import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { ValidateId } from 'src/common/decorators/validate-id.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { ValidateIdInterceptor } from 'src/common/interceptors/validate-id.interceptor'
import { Project, Task } from 'src/generated/prisma/client'
import { TaskDTO } from './tasks.dto'
import { TasksService } from './tasks.service'

interface RequestWithProjectAndTask extends Request {
  project: Project
  task: Task
}

@Controller({
  version: '1',
  path: 'projects/:project_id/tasks',
})
@UseInterceptors(ValidateIdInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ValidateId()
  async getAllProjects(@Param('project_id', ParseUUIDPipe) projectId: string) {
    return await this.tasksService.getAllByProject(projectId)
  }

  @Get(':task_id')
  @ValidateId()
  async getById(@Req() req: RequestWithProjectAndTask) {
    return req.task
  }

  @Post()
  @ValidateId()
  async create(@Param('project_id', ParseUUIDPipe) projectId: string, @Body() data: TaskDTO) {
    return await this.tasksService.create(projectId, data)
  }

  @Put(':task_id')
  @ValidateId()
  async update(
    @Param('project_id', ParseUUIDPipe) ProjectId: string,
    @Param('task_id', ParseUUIDPipe) taskId: string,
    @Body() data: TaskDTO,
  ) {
    return await this.tasksService.update(ProjectId, taskId, data)
  }

  @Delete(':task_id')
  @ValidateId()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('project_id', ParseUUIDPipe) projectId: string,
    @Param('task_id', ParseUUIDPipe) taskId: string,
  ) {
    return await this.tasksService.delete(projectId, taskId)
  }
}
