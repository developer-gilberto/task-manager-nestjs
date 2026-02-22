import { faker } from '@faker-js/faker'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { Task, TaskPriority, TaskStatus } from 'src/generated/prisma/client'

export const mockPaginationQuery: QueryPaginationDTO = { page: '1', page_size: '10' }

export const mockedTasks = faker.helpers.multiple<Task>(() => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  status: faker.helpers.arrayElement(Object.values(TaskStatus)),
  priority: faker.helpers.arrayElement(Object.values(TaskPriority)),
  due_date: faker.date.future(),
  created_at: new Date(),
  updated_at: new Date(),
  project_id: 'project-1',
  assignee_id: 'user-1',
  assignee: {
    id: 'user-1',
    name: faker.person.fullName(),
    email: faker.internet.email,
    avatar: '',
  },
}))
