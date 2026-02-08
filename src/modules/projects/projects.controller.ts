import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ProjectListItemDTO, ProjectsRequestDTO } from './projects.dto'
import { ProjectsService } from './projects.service'

@Controller({
  version: '1',
  path: 'projects',
})
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get()
  @ApiResponse({ type: [ProjectListItemDTO] })
  async getAll() {
    return await this.projectService.getAll()
  }

  @Get(':project_id')
  @ApiResponse({ type: ProjectListItemDTO })
  async getById(@Param('project_id', ParseUUIDPipe) projectId: string) {
    const project = await this.projectService.getById(projectId)

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }

    return project
  }

  @Post()
  @ApiResponse({ type: ProjectListItemDTO })
  async create(@Body() data: ProjectsRequestDTO) {
    return await this.projectService.create(data)
  }

  @Put(':project_id')
  @ApiResponse({ type: ProjectListItemDTO })
  async update(
    @Param('project_id', ParseUUIDPipe) projectId: string,
    @Body() data: ProjectsRequestDTO,
  ) {
    const project = await this.projectService.getById(projectId)

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }

    return this.projectService.update(projectId, data)
  }

  @Delete(':project_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('project_id', ParseUUIDPipe) projectId: string) {
    const project = await this.projectService.getById(projectId)

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }

    return this.projectService.delete(projectId)
  }
}
