import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CommentRequestDTO {
  @ApiProperty({ description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  content: string
}

class CommentAuthorDTO {
  @ApiProperty() id: string
  @ApiProperty() name: string
  @ApiProperty() email: string
  @ApiProperty({ nullable: true }) avatar: string | null
}

export class CommentListItemDTO {
  @ApiProperty() id: string
  @ApiProperty() content: string
  @ApiProperty() task_id: string
  @ApiProperty() author_id: string
  @ApiProperty({ format: 'date-time' }) created_at: Date
  @ApiProperty({ format: 'date-time' }) updated_at: Date

  @ApiProperty({ type: CommentAuthorDTO })
  author: CommentAuthorDTO
}

class CommentTaskDTO {
  @ApiProperty() id: string
  @ApiProperty() title: string
  @ApiProperty() project_id: string
}

export class CommentFullDTO extends CommentListItemDTO {
  @ApiProperty({ type: CommentTaskDTO })
  task: CommentTaskDTO
}
