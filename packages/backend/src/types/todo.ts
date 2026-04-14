import type { RowDataPacket } from 'mysql2'
import type { Todo } from '@/types'

export interface TodoEntity extends Todo, RowDataPacket {}
