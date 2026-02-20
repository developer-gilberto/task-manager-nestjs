import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { TaskPriority, TaskStatus } from 'src/generated/prisma/enums'

export class TaskRequestDTO {
  @ApiProperty({ description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ description: 'Task description', required: false })
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    default: TaskStatus.TO_DO,
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.TO_DO

  @ApiProperty({
    description: 'Task priority',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    required: false,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.MEDIUM

  @ApiProperty({ description: 'Task due date' })
  @IsDateString()
  @IsOptional()
  due_date?: string

  @ApiProperty({ description: 'Assignee user id', required: false })
  @IsString()
  @IsOptional()
  assignee_id?: string
}

class TaskBaseDTO {
  @ApiProperty() id: string
  @ApiProperty() title: string
  @ApiProperty({ nullable: true, required: false }) description?: string | null
  @ApiProperty({ enum: TaskStatus }) status: TaskStatus
  @ApiProperty({ enum: TaskPriority }) priority: TaskPriority
  @ApiProperty({ nullable: true, required: false, format: 'date-time' }) due_date?: Date | null
  @ApiProperty({ format: 'date-time' }) created_at: Date
  @ApiProperty({ format: 'date-time' }) updated_at: Date
}

export class TaskAssigneeDTO {
  @ApiProperty() id: string
  @ApiProperty() name: string
  @ApiProperty() email: string
  @ApiProperty({ nullable: true, required: false }) avatar?: string | null
}

export class TaskListItemDTO extends TaskBaseDTO {
  @ApiProperty({ type: TaskAssigneeDTO, nullable: true, required: false })
  assignee?: TaskAssigneeDTO | null
}

export class TaskCommentUserDTO extends TaskAssigneeDTO {}

export class TaskCommentDTO {
  @ApiProperty() id: string
  @ApiProperty() content: string
  @ApiProperty({ format: 'date-time' }) created_at: Date
  @ApiProperty({ type: TaskCommentUserDTO }) user: TaskCommentUserDTO
}

export class TaskFullDTO extends TaskBaseDTO {
  @ApiProperty({ type: TaskAssigneeDTO, nullable: true, required: false })
  assignee?: TaskAssigneeDTO | null

  @ApiProperty({ type: [TaskCommentDTO] })
  comments: TaskCommentDTO
}
