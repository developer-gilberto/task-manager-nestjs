import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('HealthCheck', () => {
    it('should return "API v1 is running! Documentation available at:  /api/v1/docs"', () => {
      expect(appController.getHealthCheck()).toEqual({
        message: 'API v1 is running! Documentation available at:  /api/v1/docs',
      })
    })
  })
})
