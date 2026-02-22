import { faker } from '@faker-js/faker'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { ProjectCollaborator } from 'src/generated/prisma/client'

export const mockPaginationQuery: QueryPaginationDTO = { page: '1', page_size: '10' }

export const mockedCollaborators = faker.helpers.multiple<ProjectCollaborator>(
  () => ({
    id: faker.string.uuid(),
    role: 'EDITOR',
    created_at: new Date(),
    project_id: 'project-1',
    user_id: 'user-1',
  }),
  { count: 5 },
)
