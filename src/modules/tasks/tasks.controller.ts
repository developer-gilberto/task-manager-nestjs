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
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger'
import { ValidateId } from 'src/common/decorators/validate-id.decorator'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { ValidateIdInterceptor } from 'src/common/interceptors/validate-id.interceptor'
import { ApiPaginatedResponse } from 'src/common/swagger/api-paginated-response'
import { TaskFullDTO, TaskListItemDTO, TaskRequestDTO } from './tasks.dto'
import { TasksService } from './tasks.service'

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
  @ApiPaginatedResponse(TaskListItemDTO)
  async getAllByProjects(
    @Param('project_id', ParseUUIDPipe) projectId: string,
    @Query() query?: QueryPaginationDTO,
  ) {
    return await this.tasksService.getAllByProject(projectId, query)
  }

  @Get(':task_id')
  @ValidateId()
  @ApiOkResponse({ type: TaskFullDTO })
  async getById(
    @Param('project_id', ParseUUIDPipe) ProjectId: string,
    @Param('task_id', ParseUUIDPipe) taskId: string,
  ) {
    return await this.tasksService.getById(ProjectId, taskId)
  }

  @Post()
  @ValidateId()
  @ApiCreatedResponse({ type: TaskListItemDTO })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('project_id', ParseUUIDPipe) projectId: string,
    @Body() data: TaskRequestDTO,
  ) {
    return await this.tasksService.create(projectId, data)
  }

  @Put(':task_id')
  @ValidateId()
  @ApiOkResponse({ type: TaskListItemDTO })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('project_id', ParseUUIDPipe) ProjectId: string,
    @Param('task_id', ParseUUIDPipe) taskId: string,
    @Body() data: TaskRequestDTO,
  ) {
    return await this.tasksService.update(ProjectId, taskId, data)
  }

  @Delete(':task_id')
  @ValidateId()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Task deleted successfully' })
  async delete(
    @Param('project_id', ParseUUIDPipe) projectId: string,
    @Param('task_id', ParseUUIDPipe) taskId: string,
  ) {
    return await this.tasksService.delete(projectId, taskId)
  }
}
