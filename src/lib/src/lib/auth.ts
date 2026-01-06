import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

export interface SessionUser {
  id: string
  email: string
  name: string
  userType: 'owner' | 'walker' | 'admin'
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('session')
  
  if (!sessionCookie) {
    return null
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value)
    const expiresAt = new Date(sessionData.expiresAt)
    if (expiresAt < new Date()) {
      return null
    }
    return sessionData.user
  } catch {
    return null
  }
}

export async function createSession(user: SessionUser) {
  const cookieStore = cookies()
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24)

  const sessionData = {
    user,
    expiresAt: expiresAt.toISOString(),
  }

  cookieStore.set('session', JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
  })
}

export async function destroySession() {
  const cookieStore = cookies()
  cookieStore.delete('session')
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function login(email: string, password: string): Promise<SessionUser | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.passwordHash)
  
  if (!isValid) {
    return null
  }

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    userType: user.userType as 'owner' | 'walker' | 'admin',
  }

  await createSession(sessionUser)
  return sessionUser
}

export function getRedirectPath(userType: string): string {
  switch (userType) {
    case 'owner':
      return '/owner/home'
    case 'walker':
      return '/walker/home'
    case 'admin':
      return '/admin/home'
    default:
      return '/'
  }
}
