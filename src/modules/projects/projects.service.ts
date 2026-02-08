import { Injectable } from '@nestjs/common'
import { ProjectsRequestDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  getAll() {
    return ['test1', 'test2']
  }

  getById(id: string) {
    return 'test1'
  }

  create(data: ProjectsRequestDTO) {
    return 'created test1'
  }

  update(id: string, data: ProjectsRequestDTO) {
    return 'updated test1'
  }

  delete(id: string) {
    return 'deleted test1'
  }
}
