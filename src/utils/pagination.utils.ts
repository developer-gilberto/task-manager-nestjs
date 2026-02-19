import { NotFoundException } from '@nestjs/common'
import { PaginatedResponseDTO, QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 10

export function paginate(query?: QueryPaginationDTO): { skip: number; take: number } {
  const size = Math.abs(Number(query?.page_size ?? DEFAULT_PAGE_SIZE))
  const page = Math.abs(Number(query?.page ?? DEFAULT_PAGE_NUMBER))

  return {
    skip: size * (page - 1),
    take: size,
  }
}

export function paginateOutput<T>(
  data: T[],
  total: number,
  query?: QueryPaginationDTO,
): PaginatedResponseDTO<T> {
  const size = Math.abs(Number(query?.page_size ?? DEFAULT_PAGE_SIZE))
  const page = Math.abs(Number(query?.page ?? DEFAULT_PAGE_NUMBER))

  const last_page = Math.ceil(total / size)

  if (!data.length) {
    return {
      data,
      meta: {
        total,
        last_page,
        current_page: page,
        total_per_page: size,
        prev_page: null,
        next_page: null,
      },
    }
  }

  if (page > last_page)
    throw new NotFoundException(`Page ${page} not found. Last page is ${last_page}`)

  return {
    data,
    meta: {
      total,
      last_page,
      current_page: page,
      total_per_page: size,
      prev_page: page > 1 ? page - 1 : null,
      next_page: page < last_page ? page + 1 : null,
    },
  }
}
