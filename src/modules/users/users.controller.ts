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
} from '@nestjs/common'
import { UsersService } from './users.service'

@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAll() {
    return this.userService.getAll()
  }

  @Get(':user_id')
  async getById(@Param('user_id', ParseUUIDPipe) userId: string) {
    const user = await this.userService.getById(userId)

    if (!user) throw new NotFoundException('User not found')

    return user
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: any) {
    return this.userService.create(data)
  }

  @Put(':user_id')
  async update(@Param('user_id', ParseUUIDPipe) userId: string, @Body() data: any) {
    return this.userService.update(userId, data)
  }

  @Delete(':user_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('user_id', ParseUUIDPipe) userId: string) {
    return this.userService.delete(userId)
  }
}
