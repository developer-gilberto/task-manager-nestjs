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
} from '@nestjs/common'
import { TaskDTO } from './tasks.dto'
import { TasksService } from './tasks.service'

@Controller({
  version: '1',
  path: 'projects/:project_id/tasks',
})
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllProjects(@Param('project_id', ParseUUIDPipe) projectId: string) {
    return await this.tasksService.getAllByProject(projectId)
  }

  @Get(':task_id')
  async getById(
    @Param('project_id', ParseUUIDPipe) projectId: string,
    @Param('task_id', ParseUUIDPipe) taskId: string,
  ) {
    return await this.tasksService.getById(projectId, taskId)
  }

  @Post()
  async create(@Param('project_id', ParseUUIDPipe) projectId: string, @Body() data: TaskDTO) {
    return await this.tasksService.create(projectId, data)
  }

  @Put(':task_id')
  async update(
    @Param('project_id', ParseUUIDPipe) ProjectId: string,
    @Param('task_id', ParseUUIDPipe) taskId: string,
    @Body() data: TaskDTO,
  ) {
    return await this.tasksService.update(ProjectId, taskId, data)
  }

  @Delete(':task_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('project_id', ParseUUIDPipe) projectId: string,
    @Param('task_id', ParseUUIDPipe) taskId: string,
  ) {
    return await this.tasksService.delete(projectId, taskId)
  }
}
