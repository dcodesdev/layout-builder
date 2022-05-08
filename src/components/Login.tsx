import { useLocalStorage } from '@mantine/hooks'
import { useState } from 'react'
import { User } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { Input, Button, Container } from '@mantine/core'

export const Login = () => {
  const [users, setUsers] = useLocalStorage<User[]>({
    key: 'users',
    defaultValue: [],
  })

  const [, setUser] = useLocalStorage<User>({
    key: 'user',
    defaultValue: null,
  })

  const [name, setName] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()

    if (name.trim().length === 0) {
      return
    }

    const newUser: User = { id: uuidv4(), name }
    setUsers([...users, newUser])
    setUser(newUser)
  }

  return (
    <Container className="py-10 flex justify-center">
      <div className="w-full flex flex-col max-w-sm gap-2 mt-40">
        <form onSubmit={submitHandler} className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-center mb-5">Login</h2>
          <Input
            onChange={(e) => {
              setName(e.target.value)
            }}
            placeholder="Name"
            value={name}
          />
          <Button type="submit" variant="outline">
            Sign In
          </Button>
        </form>
        <hr className="my-5" />
        {users.map((user) => (
          <div
            onClick={() => {
              setUser(user)
            }}
            className="flex items-center hover:bg-slate-100 p-2 rounded-lg cursor-pointer gap-2"
            key={user.id}
          >
            <img
              className="h-10 object-contain"
              src={`https://avatars.dicebear.com/api/adventurer/${user.name}.svg`}
              alt={user.name}
            />
            <p>{user.name}</p>
          </div>
        ))}
      </div>
    </Container>
  )
}
