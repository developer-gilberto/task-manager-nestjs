import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { UserRole } from 'src/generated/prisma/enums'

export class CreateUserDTO {
  @ApiProperty({ description: 'User name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'User email', uniqueItems: true })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ description: 'User password', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.ADMIN,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.ADMIN
}

export class UpdateUserDTO {
  @ApiProperty({
    description: 'User name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.ADMIN,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole

  avatar?: string
}

export class UserListItemDTO {
  @ApiProperty() id: string
  @ApiProperty() name: string
  @ApiProperty() email: string
  @ApiProperty() avatar: string
  @ApiProperty() role: UserRole
  @ApiProperty() created_at: string
  @ApiProperty() updated_at: string
}

class UserProjectDTO {
  @ApiProperty() id: string
  @ApiProperty() name: string
  @ApiProperty({ nullable: true, required: false }) description: string
}

export class UserFullDTO extends UserListItemDTO {
  @ApiProperty({ type: [UserProjectDTO] })
  created_projects: UserProjectDTO[]
}
