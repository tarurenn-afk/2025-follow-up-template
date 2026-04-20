'use client'

import { Table, Title, Container, Button, Stack } from '@mantine/core'
import { useTodos } from '@/hooks/useTodos'
import { deleteTodo } from '@/todoSQL/deleteTodo'
import { logoutUser } from '@/todoSQL/logoutUser'
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
    if (limit > 14) return 'rgb(0, 255, 0)'
    if (limit <= 14 && limit > 7) return 'rgb(255, 255, 0)'
    if (limit <= 7 && limit >= 0) return 'rgb(251, 99, 99)'
    if (limit < 0) return 'rgb(120, 120, 120)'
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
  const handleLogout = async () => {
    const ok = confirm(`ログアウトしますか？`)
    if (!ok) return
    await logoutUser()
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
      <Link href={'/Login'}>
        <Button
          variant='filled'
          onClick={() => {
            handleLogout()
          }}
        >
          ログアウト
        </Button>
      </Link>
      <Table
        striped
        highlightOnHover
        withTableBorder
        layout='fixed'
        width='100%'
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: '5%' }}>No</Table.Th>
            <Table.Th style={{ width: '10%' }}>タイトル</Table.Th>
            <Table.Th style={{ width: '23%' }}>内容</Table.Th>
            <Table.Th style={{ width: '7%' }}>優先度</Table.Th>
            <Table.Th style={{ width: '10%' }}>期限日</Table.Th>
            <Table.Th style={{ width: '10%' }}>作成日</Table.Th>
            <Table.Th style={{ width: '10%' }}>更新日</Table.Th>
            <Table.Th style={{ width: '9%' }}>公開設定</Table.Th>
            <Table.Th style={{ width: '9%' }}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {todos?.map((todo) => (
            <Table.Tr
              key={todo.id}
              style={{
                backgroundColor: colorSetting(dateDiff(todo.limitedDate)),
                textAlign: 'center',
                wordWrap: 'break-word',
                whiteSpace: 'normal',
                height: '100px'
              }}
            >
              <Table.Td>{todo.id}</Table.Td>
              <Table.Td>{todo.title}</Table.Td>
              <Table.Td>{todo.content}</Table.Td>
              <Table.Td>{todo.priority}</Table.Td>
              <Table.Td>{dateFormat(todo.limitedDate)}</Table.Td>
              <Table.Td>{datetimeFormat(todo.createdAt)}</Table.Td>
              <Table.Td>{datetimeFormat(todo.updatedAt)}</Table.Td>
              <Table.Td>{todo.publicOn ? '公開' : '非公開'}</Table.Td>

              <Table.Td>
                <Stack gap='xs'>
                  <Link href={`/edit?id=${todo.id}`}>
                    <Button variant='filled' style={{ width: '80px' }}>
                      編集
                    </Button>
                  </Link>
                  <Button
                    variant='filled'
                    style={{ width: '80px' }}
                    onClick={() => handleDelete(todo.id)}
                  >
                    削除
                  </Button>
                </Stack>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  )
}
