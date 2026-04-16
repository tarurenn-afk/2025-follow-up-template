'use client'

import { Table, Title, Container, Button } from '@mantine/core'
import { useTodos } from '@/hooks/useTodos'
import { deleteTodo } from '@/todoSQL/deleteTodo'
import Link from 'next/link'
import dayjs from 'dayjs'

export default function Page() {
  const today = new Date()
  const dateFormat = (date: string) => {
    return dayjs(date).format('YYYY-MM-DD')
  }
  const datetimeFormat = (date: string) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  }
  const dateDiff = (date: string) => {
    const dif = Number(dayjs(date).diff(dayjs(today), 'day'))
    return dif
  }

  const colorSetting = (limit: number) => {
    if (limit > 7) return 'rgb(0, 255, 0)'
    if (limit <= 7 && limit > 0) return 'rgb(255, 255, 0)'
    if (limit <= 0) return 'rgb(255,0,0)'
  }

  const { todos, error, isLoading, mutate } = useTodos()
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error fetching users: {error.message}</div>
  const handleDelete = async (id: number) => {
    const ok = confirm(`Id.${id}のTodoリストを削除しますか？`)
    if (!ok) return
    await deleteTodo(id)
    mutate()
  }
  return (
    <Container size='md' mt='xl'>
      <Title order={2} mb='md'>
        ToDoリスト
      </Title>
      <Link href='/add'>
        <Button variant='filled'>追加</Button>
      </Link>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>番号</Table.Th>
            <Table.Th>タイトル</Table.Th>
            <Table.Th>内容</Table.Th>
            <Table.Th>優先度</Table.Th>
            <Table.Th>期限日</Table.Th>
            <Table.Th>作成日</Table.Th>
            <Table.Th>更新日</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {todos?.map((todo) => (
            <Table.Tr
              key={todo.id}
              style={{
                backgroundColor: colorSetting(dateDiff(todo.limitedDate))
              }}
            >
              <Table.Td>{todo.id}</Table.Td>
              <Table.Td>{todo.title}</Table.Td>
              <Table.Td>{todo.content}</Table.Td>
              <Table.Td>{todo.priority}</Table.Td>
              <Table.Td>{dateFormat(todo.limitedDate)}</Table.Td>
              <Table.Td>{datetimeFormat(todo.createdAt)}</Table.Td>
              <Table.Td>{datetimeFormat(todo.updatedAt)}</Table.Td>
              <Table.Td>
                <Link href={`/edit?id=${todo.id}`}>
                  <Button variant='filled'>編集</Button>
                </Link>
              </Table.Td>

              <Table.Td>
                <Button variant='filled' onClick={() => handleDelete(todo.id)}>
                  削除
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  )
}
