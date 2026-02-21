import { faker } from '@faker-js/faker'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { Project } from 'src/generated/prisma/client'

export const mockedProjects = faker.helpers.multiple<Project>(
  () => {
    return {
      id: faker.string.uuid(),
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      created_by_id: 'user-id-1234',
      created_at: new Date(),
      updated_at: new Date(),
    }
  },
  { count: 10 },
)

export const mockPaginationQuery: QueryPaginationDTO = {
  page: '1',
  page_size: '10',
}
