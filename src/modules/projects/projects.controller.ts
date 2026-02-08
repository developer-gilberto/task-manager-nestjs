import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ProjectsService } from './projects.service'

@Controller({
  version: '1',
  path: 'projects',
})
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get()
  getAll() {
    return this.projectService.getAll()
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.projectService.getById(id)
  }

  @Post()
  create(@Body() data: any) {
    return this.projectService.create(data)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.projectService.update(id, data)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.projectService.delete(id)
  }
}
