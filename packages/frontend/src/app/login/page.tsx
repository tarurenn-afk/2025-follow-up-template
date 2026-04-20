'use client'

import { Button, Stack, Title, Container, TextInput } from '@mantine/core'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { CheckUserRequest, User } from '@/shared/types'
import { nullUser } from '@/todoSQL/nullUser'
import { loginUser } from '@/todoSQL/loginUser'

export default function Page() {
  const [userId, setUserId] = useState<User['userId']>('')
  const [passwordHash, setPasswordHash] = useState<User['passwordHash']>('')
  const router = useRouter()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId.trim()) {
      alert('ユーザーIDを入力してください')
      return
    }
    if (!passwordHash.trim()) {
      alert('パスワードを入力してください')
      return
    }

    const check: CheckUserRequest = {
      userId,
      passwordHash
    }

    try {
      await loginUser(check)
      router.push('/todo')
      console.log('router')
    } catch {
      alert('送信失敗')
    }
  }
  const handleNoAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      nullUser
      router.push('/todo')
      console.log('router')
    } catch {
      alert('送信失敗')
    }
  }
  return (
    <Container size='md' mt='xl' style={{ width: '100%' }}>
      <Title order={2} mb='md'>
        ユーザー確認画面
      </Title>

      <Stack gap='md'>
        <Button
          variant='filled'
          onClick={handleNoAccount}
          style={{ width: '20%' }}
        >
          ログインせずに入る
        </Button>
        <form onSubmit={handleLogin}>
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
          <Button variant='filled' type='submit'>
            確認
          </Button>
        </form>
        <hr />
        <Link href='/newUser'>登録されていない方はこちら</Link>
      </Stack>
    </Container>
  )
}
