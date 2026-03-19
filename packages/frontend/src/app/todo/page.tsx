'use client'

import { Table, Title, Container, Button } from '@mantine/core'
import { useHooks } from '@/app/hooks/useHooks'
import { deleteSQL } from '@/app/todoSQL/deleteSQL'
import Link from 'next/link'

function formatDateTime(dateString: string) {
  // ゼロパディング（例: 5 -> 05）を行うヘルパー関数
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // getMonth() は 0 から始まるため +1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
export default function Page() {
  const { users, error, isLoading } = useHooks()
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error fetching users: {error.message}</div>

  const handleDelete = async (id: number) => {
    const ok = confirm(`Id.${id} のTodoリストを削除しますか？`)
    if (!ok) return

    await deleteSQL(id)
    window.location.reload()
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
            <Table.Th>作成日</Table.Th>
            <Table.Th>更新日</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users?.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td>{user.id}</Table.Td>
              <Table.Td>{user.title}</Table.Td>
              <Table.Td>{user.content}</Table.Td>
              <Table.Td>{formatDateTime(user.createdAt)}</Table.Td>
              <Table.Td>{formatDateTime(user.updatedAt)}</Table.Td>
              <Table.Td>
                <Link href={`/edit?id=${user.id}`}>
                  <Button variant='filled'>編集</Button>
                </Link>
              </Table.Td>
              <Table.Td>
                <Button variant='filled' onClick={() => handleDelete(user.id)}>
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
