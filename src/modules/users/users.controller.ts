import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { CreateUserDTO, UpdateUserDTO, UserFullDTO, UserListItemDTO } from './users.dto'
import { UsersService } from './users.service'

@Controller({
  version: '1',
  path: 'users',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly requestContext: RequestContextService,
  ) {}

  @Get()
  @ApiResponse({ type: [UserListItemDTO] })
  getAll() {
    return this.userService.getAll()
  }

  @Get(':user_id')
  @ApiResponse({ type: UserFullDTO })
  async getById(@Param('user_id', ParseUUIDPipe) userId: string) {
    const user = await this.userService.getById(userId)

    if (!user) throw new NotFoundException('User not found')

    return user
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data)
  }

  @Put(':user_id')
  async update(@Param('user_id', ParseUUIDPipe) userId: string, @Body() data: UpdateUserDTO) {
    return this.userService.update(userId, data)
  }

  @Delete(':user_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('user_id', ParseUUIDPipe) userId: string) {
    return this.userService.delete(userId)
  }

  @Post('/avatar')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User avatar uploaded successfully',
    type: UserListItemDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const user = this.requestContext.getUser()

    const response = await this.cloudinaryService.upload(file, user.id)

    await this.userService.update(user.id, {
      ...user,
      avatar: response.url,
    })

    return this.userService.getById(user.id)
  }
}
