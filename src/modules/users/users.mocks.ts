import { faker } from '@faker-js/faker'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { User } from 'src/generated/prisma/client'

export const mockPaginationQuery: QueryPaginationDTO = {
  page: '1',
  page_size: '10',
}

export const mockedUsers = faker.helpers.multiple<User>(() => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatar: null,
  role: 'USER',
  created_at: new Date(),
  updated_at: new Date(),
  created_projects: [
    { id: 'proj-1', name: faker.lorem.sentence(), description: faker.lorem.sentence() },
  ],
  password: 'hashed',
}))
