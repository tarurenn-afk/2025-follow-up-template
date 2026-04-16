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
import type { AddUser } from '@/shared/types'
import { writeUser } from '@/todoSQL/writeUser'

export default function Page() {
  const [userId, setUserId] = useState<AddUser['userId']>('')
  const [passwordHash, setPasswordHash] = useState<AddUser['passwordHash']>('')
  const router = useRouter()
  const handleSubmit = async () => {
    if (!userId.trim()) {
      alert('ユーザーIDを入力してください')
      return
    }
    if (!passwordHash.trim()) {
      alert('パスワードを入力してください')
      return
    }

    const check: AddUser = {
      userId,
      passwordHash
    }

    try {
      await writeUser(check)
      router.push('/todo')
      console.log(router)
    } catch {
      alert('送信失敗')
    }
  }
  return (
    <Container size='md' mt='xl'>
      <Title order={2} mb='md'>
        ユーザー登録画面
      </Title>

      <Stack gap='md'>
        <form>
          <TextInput
            label='ユーザーID入力'
            placeholder='テキスト入力'
            value={userId}
            maxLength={20}
            onChange={(event) =>
              setUserId(event.currentTarget.value.replace(/[^a-zA-Z0-9_]/g, ''))
            }
          />
          <hr />
          <TextInput
            label='パスワード入力'
            placeholder='テキスト入力'
            value={passwordHash}
            maxLength={20}
            onChange={(event) =>
              setPasswordHash(
                event.currentTarget.value.replace(/[^a-zA-Z0-9_]/g, '')
              )
            }
          />
          <hr />
          <Group gap='sm'>
            <Button variant='filled' onClick={handleSubmit}>
              追加
            </Button>
            <Link href='/login'>
              <Button variant='filled'>戻る</Button>
            </Link>
          </Group>
        </form>
      </Stack>
    </Container>
  )
}
