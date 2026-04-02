'use client'

import {
  Button,
  Stack,
  Title,
  Container,
  TextInput,
  Group
} from '@mantine/core'
import Link from 'next/link'
import { useState, useEffect } from 'react' //状態確認
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { updateSQL } from '@/app/todoSQL/updateSQL'
import type { Todo, EditTodo } from '@shared/types'

export default function Page() {
  const [title, setTitle] = useState<EditTodo['title']>('')
  const [content, setContent] = useState<EditTodo['content']>('')
  const searchParams = useSearchParams()
  const rawId = searchParams.get('id')
  const id = rawId ? Number(rawId) : null
  const router = useRouter()

  useEffect(() => {
    if (!id || isNaN(id)) return
    const fetchTodo = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/todos/${id}`
        )
        if (!res.ok) throw new Error('Failed to fetch todo')
        const todos: Todo = await res.json()
        setTitle(todos.title)
        setContent(todos.content)
      } catch (error) {
        console.error(error)
      }
    }
    fetchTodo()
  }, [id])

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('タイトルを入力してください。')
      return
    }
    const check: EditTodo = {
      id,
      title,
      content
    }
    try {
      // console.log(value)
      await updateSQL(check)
      router.push('/todo')
    } catch {
      alert('送信失敗')
    }
  }

  return (
    <Container size='md' mt='xl'>
      <Title order={2} mb='md'>
        編集画面
      </Title>

      <Stack gap='md'>
        <TextInput
          label='タイトル'
          placeholder='テキストを入力'
          value={title}
          maxLength={20}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />
        <TextInput
          label='内容'
          placeholder='テキストを入力'
          value={content}
          maxLength={200}
          onChange={(event) => setContent(event.currentTarget.value)}
        />

        <Group gap='sm'>
          <Button variant='filled' onClick={handleSubmit}>
            更新
          </Button>

          <Link href='/todo'>
            <Button variant='filled'>戻る</Button>
          </Link>
        </Group>
      </Stack>
    </Container>
  )
}
