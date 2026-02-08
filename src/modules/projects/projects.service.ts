import { Injectable } from '@nestjs/common'

@Injectable()
export class ProjectsService {
  getAll() {
    return ['test1', 'test2']
  }

  getById(id: string) {
    return 'test1'
  }

  create(data: any) {
    return 'created test1'
  }

  update(id: string, data: any) {
    return 'updated test1'
  }

  delete(id: string) {
    return 'deleted test1'
  }
}
