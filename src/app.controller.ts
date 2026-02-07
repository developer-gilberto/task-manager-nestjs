import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { AppService } from './app.service'

@Controller({ version: '1' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Health check',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  getHealthCheck(): { message: string } {
    return this.appService.getHealthCheck()
  }
}
