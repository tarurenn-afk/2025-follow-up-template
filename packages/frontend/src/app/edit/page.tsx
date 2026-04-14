'use client'

import {
  Button,
  Stack,
  Title,
  Container,
  TextInput,
  Group
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import Link from 'next/link'
import { useState, useEffect } from 'react' //状態確認
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { updateTodo } from '@/app/todoSQL/updateTodo'
import type { EditTodo, Todo } from '@/shared/types'

export default function Page() {
  const [title, setTitle] = useState<EditTodo['title']>('')
  const [content, setContent] = useState<EditTodo['content']>('')
  const [limitedDate, setLimitedDate] = useState<EditTodo['limitedDate']>('')
  const searchParams = useSearchParams()
  const rawId = searchParams.get('id')
  const id = Number(rawId)
  const router = useRouter()
  const today = new Date()
  const formatted = today
    .toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    .split('/')
    .join('-')

  useEffect(() => {
    if (!id) return
    const fetchTodo = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/todos/${id}`
        )
        if (!res.ok) throw new Error('Failed to fetch todo')
        const todos: Todo = await res.json()
        setTitle(todos.title)
        setContent(todos.content)
        setLimitedDate(todos.limitedDate)
      } catch (error) {
        console.error(error)
      }
    }
    fetchTodo()
  }, [id])

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('タイトルを入力してください')
      return
    }
    if (!limitedDate.trim()) {
      alert('期限日を入力してください')
      return
    }
    const check: EditTodo = {
      id,
      title,
      content,
      limitedDate
    }
    try {
      await updateTodo(check)
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
        <form onSubmit={handleSubmit}>
          <TextInput
            label='タイトル'
            description='20文字以内で書いてください'
            placeholder='テキストを入力'
            value={title}
            maxLength={20}
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
          <hr />
          <TextInput
            label='内容'
            description='200文字以内で書いてください'
            placeholder='テキストを入力'
            value={content}
            maxLength={200}
            onChange={(event) => setContent(event.currentTarget.value)}
          />
          <hr />
          <DatePickerInput
            label='期限'
            description='期限の日付を入力してください'
            placeholder='テキスト入力'
            value={limitedDate}
            minDate={formatted}
            onChange={(date) => {
              if (date) setLimitedDate(date)
            }}
          />
          <hr />
          <Group gap='sm'>
            <Button variant='filled' type='submit'>
              更新
            </Button>

            <Link href='/todo'>
              <Button variant='filled'>戻る</Button>
            </Link>
          </Group>
        </form>
      </Stack>
    </Container>
  )
}
