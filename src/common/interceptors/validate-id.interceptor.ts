import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { CONSTANTS } from 'src/constants'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class ValidateIdInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaClient: PrismaService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Request>> {
    const hasDecoratorValidateId = this.reflector.get<boolean>(
      CONSTANTS.VALIDATE_ID_KEY,
      context.getHandler(),
    )

    if (!hasDecoratorValidateId) return next.handle()

    const request = context.switchToHttp().getRequest()
    const { project_id } = request.params

    const project = await this.prismaClient.project.findFirst({ where: { id: project_id } })

    if (!project) throw new NotFoundException('Project not found')

    const { task_id } = request.params

    if (task_id) {
      const task = await this.prismaClient.task.findFirst({
        where: {
          project_id,
          id: task_id,
        },
      })

      if (!task) throw new NotFoundException('Task not found')

      request.task = task
    }

    request.project = project

    return next.handle()
  }
}
