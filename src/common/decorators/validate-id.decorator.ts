import { SetMetadata } from '@nestjs/common'
import { CONSTANTS } from 'src/constants'

export const ValidateId = (...args: string[]) => SetMetadata(CONSTANTS.VALIDATE_ID_KEY, args)
