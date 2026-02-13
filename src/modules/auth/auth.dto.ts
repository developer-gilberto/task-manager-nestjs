import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { UserRole } from 'src/generated/prisma/enums'

export class SignUpDTO {
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
  @MinLength(6)
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

export class SignInDTO {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string
}

export class ForgotPasswordDTO {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string
}

export class ResetPasswordDTO {
  @ApiProperty({ description: 'Reset password' })
  @IsString()
  @IsNotEmpty()
  token: string

  @ApiProperty({ description: 'New password', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  new_password: string
}
