'use client'

import {
  Button,
  Stack,
  Title,
  Container,
  Group,
  TextInput
} from '@mantine/core'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { writeSQL } from '@/app/todoSQL/writeSQL'
import type { AddTodo } from '@shared/types'

export default function Page() {
  const [title, setTitle] = useState<AddTodo['title']>('')
  const [content, setContent] = useState<AddTodo['content']>('')
  const [limitedAt, setLimited] = useState<AddTodo['limited']>('')
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

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('タイトルを入力してください。')
      return
    }

    const check: AddTodo = {
      title,
      content,
      limitedAt
    }

    try {
      await writeSQL(check)
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
          <TextInput
            label='期限'
            description='期限の日付を入力してください'
            placeholder='テキスト入力'
            type='date'
            value={limitedAt}
            min={formatted}
            onChange={(event) => setLimited(event.currentTarget.value)}
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
