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
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.projectService.getAll()
  }

  @Get(':id')
  @ApiResponse({ type: ProjectListItemDTO })
  @HttpCode(HttpStatus.OK)
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.getById(id)
  }

  @Post()
  @ApiResponse({ type: ProjectListItemDTO })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: ProjectsRequestDTO) {
    return this.projectService.create(data)
  }

  @Put(':id')
  @ApiResponse({ type: ProjectListItemDTO })
  @HttpCode(HttpStatus.OK)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() data: ProjectsRequestDTO) {
    return this.projectService.update(id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.delete(id)
  }
}
