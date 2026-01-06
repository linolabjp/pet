import { NextRequest, NextResponse } from 'next/server'
import { destroySession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await destroySession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'ログアウトに失敗しました' },
      { status: 500 }
    )
  }
}
