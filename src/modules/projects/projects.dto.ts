import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { TaskPriority, TaskStatus } from 'src/generated/prisma/enums'

export class ProjectsRequestDTO {
  @ApiProperty({ description: 'Project name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Project description', required: false })
  @IsString()
  description: string
}

export class ProjectListItemDTO {
  @ApiProperty() id: string
  @ApiProperty() name: string
  @ApiProperty() description: string
  @ApiProperty({ format: 'date-time' }) created_at: string
  @ApiProperty({ format: 'date-time' }) updated_at: string
}

export class ProjectTaskDTO {
  @ApiProperty() id: string
  @ApiProperty() title: string
  @ApiProperty({ nullable: true, required: false }) description?: string
  @ApiProperty({ enum: TaskStatus, default: TaskStatus.TO_DO }) status: string
  @ApiProperty({ enum: TaskPriority, default: TaskPriority.MEDIUM }) priority: string
  @ApiProperty({ nullable: true, required: false, format: 'date-time' }) due_date?: string
  @ApiProperty({ format: 'date-time' }) created_at: string
  @ApiProperty({ format: 'date-time' }) updated_at: string
}

export class ProjectFullDTO extends ProjectListItemDTO {
  @ApiProperty({ type: [ProjectTaskDTO] }) tasks: ProjectTaskDTO[]
}
