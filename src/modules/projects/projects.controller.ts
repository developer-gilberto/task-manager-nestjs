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
  getAll() {
    return this.projectService.getAll()
  }

  @Get(':id')
  @ApiResponse({ type: ProjectListItemDTO })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const project = await this.projectService.getById(id)

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }

    return project
  }

  @Post()
  @ApiResponse({ type: ProjectListItemDTO })
  create(@Body() data: ProjectsRequestDTO) {
    return this.projectService.create(data)
  }

  @Put(':id')
  @ApiResponse({ type: ProjectListItemDTO })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: ProjectsRequestDTO) {
    const project = await this.projectService.getById(id)

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }

    return this.projectService.update(id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const project = await this.projectService.getById(id)

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }

    return this.projectService.delete(id)
  }
}
