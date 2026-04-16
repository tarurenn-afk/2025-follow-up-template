export type User = {
  user_no: number
  userId: string
  passwordHash: string
}

export type CheckUserRequest = {
  userId: string
  passwordHash: string
}

export type AddUserRequest = {
  userId: string
  passwordHash: string
}
