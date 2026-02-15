import { Injectable, Scope } from '@nestjs/common'
import type { User } from 'src/generated/prisma/client'

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private user: User

  setUser(user: User): void {
    this.user = user
  }

  getUser(): User {
    return this.user
  }

  getUserId(): string {
    return this.user.id
  }
}
