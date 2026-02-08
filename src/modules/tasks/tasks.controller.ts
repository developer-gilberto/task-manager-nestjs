import { Controller } from '@nestjs/common'

@Controller({
  version: '1',
  path: 'projects/:project_id/tasks',
})
export class TasksController {}
