import type { LuggageStatus, Role, WorkflowFilter } from '../api/types'

export const queryKeys = {
  luggage: {
    all: ['luggage'] as const,
    lists: () => [...queryKeys.luggage.all, 'list'] as const,
    list: (status?: LuggageStatus) => [...queryKeys.luggage.lists(), status ?? 'all'] as const,
    detail: (id: string) => [...queryKeys.luggage.all, 'detail', id] as const,
    events: (id: string) => [...queryKeys.luggage.all, 'events', id] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filter: { role?: Role; blocked?: boolean; q?: string }) =>
      [...queryKeys.users.lists(), filter.role ?? 'all', filter.blocked ?? 'any', filter.q ?? ''] as const,
  },
  warehouse: {
    all: ['warehouse'] as const,
    queue: () => [...queryKeys.warehouse.all, 'queue'] as const,
    mine: () => [...queryKeys.warehouse.all, 'mine'] as const,
    today: () => [...queryKeys.warehouse.all, 'today'] as const,
  },
  driver: {
    all: ['driver'] as const,
    queue: () => [...queryKeys.driver.all, 'queue'] as const,
    mine: () => [...queryKeys.driver.all, 'mine'] as const,
  },
  workflow: {
    all: ['workflow'] as const,
    list: (filter: WorkflowFilter) =>
      [
        ...queryKeys.workflow.all,
        'list',
        filter.q ?? '',
        filter.customer ?? '',
        filter.phone ?? '',
        filter.status ?? 'all',
        filter.from ?? '',
        filter.to ?? '',
      ] as const,
  },
}
