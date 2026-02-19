import { IsNumberString, IsOptional } from 'class-validator'

export class QueryPaginationDTO {
  @IsOptional()
  @IsNumberString()
  page?: string

  @IsOptional()
  @IsNumberString()
  page_size?: string
}

export class PaginatedResponseDTO<T> {
  data: T[]
  meta: {
    total: number
    last_page: number
    current_page: number
    total_per_page: number
    prev_page: number | null
    next_page: number | null
  }
}
