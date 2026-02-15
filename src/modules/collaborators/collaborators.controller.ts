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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger'
import { ValidateId } from 'src/common/decorators/validate-id.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { ValidateIdInterceptor } from 'src/common/interceptors/validate-id.interceptor'
import {
  AddCollaboratorDTO,
  CollaboratorListItemDTO,
  UpdateCollaboratorDTO,
} from './collaborators.dto'
import { CollaboratorsService } from './collaborators.service'

@Controller({
  version: '1',
  path: 'projects/:project_id/collaborators',
})
@UseInterceptors(ValidateIdInterceptor)
@UseGuards(JwtAuthGuard)
export class CollaboratorsController {
  constructor(private readonly collaboratorService: CollaboratorsService) {}

  @Get()
  @ValidateId()
  @ApiResponse({ type: [CollaboratorListItemDTO] })
  async getAllByProject(@Param('project_id', ParseUUIDPipe) projectId: string) {
    return await this.collaboratorService.getAllByProject(projectId)
  }

  @Post()
  @ValidateId()
  @ApiCreatedResponse({ type: CollaboratorListItemDTO })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('project_id', ParseUUIDPipe) projectId: string,
    @Body() data: AddCollaboratorDTO,
  ) {
    return await this.collaboratorService.create(projectId, data)
  }

  @Put(':user_id')
  @ValidateId()
  @ApiOkResponse({ type: CollaboratorListItemDTO })
  async update(
    @Param('project_id', ParseUUIDPipe) projectId: string,
    @Param('user_id', ParseUUIDPipe) userId: string,
    @Body() data: UpdateCollaboratorDTO,
  ) {
    return await this.collaboratorService.update(projectId, userId, data)
  }

  @Delete(':user_id')
  @ValidateId()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('project_id', ParseUUIDPipe) projectId: string,
    @Param('user_id', ParseUUIDPipe) userId: string,
  ) {
    return await this.collaboratorService.delete(projectId, userId)
  }
}
