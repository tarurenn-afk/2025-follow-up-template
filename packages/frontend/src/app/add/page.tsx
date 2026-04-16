'use client'

import {
  Button,
  Stack,
  Title,
  Container,
  Group,
  TextInput,
  Select
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { additionTodo } from '@/todoSQL/additionTodo'
import type { Todo, AddTodoRequest } from '@/shared/types'
import dayjs from 'dayjs'

export default function Page() {
  const [title, setTitle] = useState<Todo['title']>('')
  const [content, setContent] = useState<Todo['content']>('')
  const [priority, setPriority] = useState<Todo['priority']>('')
  const [limitedDate, setLimitedDate] = useState<Todo['limitedDate']>('')
  const router = useRouter()
  const today = new Date()
  const dateFormat = (date: Date | null) => {
    return dayjs(date).format('YYYY-MM-DD')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('タイトルを入力してください')
      return
    }
    if (!priority.trim()) {
      alert('優先度を入力してください')
      return
    }
    if (!limitedDate.trim()) {
      alert('期限日を入力してください。')
      return
    }

    const check: AddTodoRequest = {
      title,
      content,
      priority,
      limitedDate
    }

    try {
      await additionTodo(check)
      router.push('/todo')
    } catch {
      alert('送信失敗')
    }
  }
  return (
    <Container size='md' mt='xl'>
      <Title order={2} mb='md'>
        追加画面
      </Title>

      <Stack gap='md'>
        <form onSubmit={handleSubmit}>
          <TextInput
            label='タイトル'
            description='20文字以内で書いてください'
            placeholder='テキスト入力'
            value={title}
            maxLength={20}
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
          <hr />
          <TextInput
            label='内容'
            description='200文字以内で書いてください'
            placeholder='テキスト入力'
            value={content}
            maxLength={200}
            onChange={(event) => setContent(event.currentTarget.value)}
          />
          <hr />
          <Select
            label='優先度'
            description='優先度を選択してください'
            placeholder='テキスト選択'
            data={['高', '中', '低']}
            value={priority}
            onChange={(value) => {
              if (value) setPriority(value as AddTodoRequest['priority'])
            }}
          />
          <hr />
          <DatePickerInput
            label='期限'
            description='期限の日付を入力してください'
            placeholder='テキスト入力'
            value={limitedDate}
            minDate={dateFormat(today)}
            onChange={(date) => {
              if (date) setLimitedDate(date)
            }}
          />
          <hr />
          <Group gap='sm'>
            <Button variant='filled' type='submit'>
              追加
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
