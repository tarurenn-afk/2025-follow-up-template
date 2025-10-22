'use client'

import { Table, Title, Container, Button } from '@mantine/core'
import { useSample } from '@/app/hooks/use'

export default function Page() {
  const { users, error, isLoading } = useSample()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error fetching users: {error.message}</div>

  return (
    <Container size='md' mt='xl'>
      <Title order={2} mb='md'>
        User List
      </Title>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Button variant='green-fill'>追加</Button>
        </Table.Thead>
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
              <Table.Td>{user.name}</Table.Td>
              <Table.Td>{user.eMail}</Table.Td>
              <Table.Td>{new Date(user.createdAt).toDateString()}</Table.Td>
              <Table.Td>{new Date(user.createdAt).toDateString()}</Table.Td>
              <Table.Td>
                <Button>更新</Button>
                <Button>削除</Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  )
}
