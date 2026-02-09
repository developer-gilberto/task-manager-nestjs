import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHealthCheck(): { message: string } {
    return {
      message: 'API v1 is running! Documentation available at:  /api/v1/docs',
    }
  }
}
