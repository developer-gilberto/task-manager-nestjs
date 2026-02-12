import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CollaboratorRole } from 'src/generated/prisma/enums'

export class AddCollaboratorDTO {
  @ApiProperty({ description: 'User ID to add as collaborator' })
  @IsString()
  @IsNotEmpty()
  user_id: string

  @ApiProperty({
    description: 'Collaborator role',
    enum: CollaboratorRole,
    default: CollaboratorRole.EDITOR,
    required: false,
  })
  @IsEnum(CollaboratorRole)
  @IsOptional()
  role?: CollaboratorRole = CollaboratorRole.EDITOR
}

export class UpdateCollaboratorDTO {
  @ApiProperty({
    description: 'New collaborator role',
    enum: CollaboratorRole,
  })
  @IsEnum(CollaboratorRole)
  @IsNotEmpty()
  role: CollaboratorRole
}

class CollaboratorUserDTO {
  @ApiProperty() id: string
  @ApiProperty() name: string
  @ApiProperty() email: string
  @ApiProperty({ nullable: true }) avatar: string
}

export class CollaboratorListItemDTO {
  @ApiProperty() id: string
  @ApiProperty({ enum: CollaboratorRole }) role: CollaboratorRole
  @ApiProperty() project_id: string
  @ApiProperty() user_id: string
  @ApiProperty({ format: 'date-time' }) created_at: string
  @ApiProperty({ type: CollaboratorUserDTO }) user: CollaboratorUserDTO
}
