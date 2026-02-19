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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { ValidateId } from 'src/common/decorators/validate-id.decorator'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { ValidateIdInterceptor } from 'src/common/interceptors/validate-id.interceptor'
import { Project } from 'src/generated/prisma/client'
import { ProjectFullDTO, ProjectListItemDTO, ProjectsRequestDTO } from './projects.dto'
import { ProjectsService } from './projects.service'

interface RequestWithProject extends Request {
  project: Project
}

@Controller({
  version: '1',
  path: 'projects',
})
@UseInterceptors(ValidateIdInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get()
  @ApiResponse({ type: [ProjectListItemDTO] })
  async getAll(@Query() query?: QueryPaginationDTO) {
    return await this.projectService.getAll(query)
  }

  @Get(':project_id')
  @ApiResponse({ type: ProjectFullDTO })
  @ValidateId()
  async getById(@Param('project_id', ParseUUIDPipe) projectId: string) {
    return this.projectService.getById(projectId)
  }

  @Post()
  @ApiResponse({ type: ProjectListItemDTO })
  async create(@Body() data: ProjectsRequestDTO) {
    return await this.projectService.create(data)
  }

  @Put(':project_id')
  @ApiResponse({ type: ProjectListItemDTO })
  @ValidateId()
  async update(@Req() req: RequestWithProject, @Body() data: ProjectsRequestDTO) {
    return this.projectService.update(req.project.id, data)
  }

  @Delete(':project_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateId()
  async delete(@Req() req: RequestWithProject) {
    return this.projectService.delete(req.project.id)
  }
}
