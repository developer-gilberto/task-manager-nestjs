import { faker } from '@faker-js/faker'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { Comment } from 'src/generated/prisma/client'

export const mockPaginationQuery: QueryPaginationDTO = { page: '1', page_size: '10' }

export const mockedComments = faker.helpers.multiple<Comment>(
  () => ({
    id: faker.string.uuid(),
    content: faker.lorem.sentence(),
    author_id: 'user-1',
    created_at: new Date(),
    updated_at: new Date(),
    task_id: 'task-1',
  }),
  { count: 5 },
)
