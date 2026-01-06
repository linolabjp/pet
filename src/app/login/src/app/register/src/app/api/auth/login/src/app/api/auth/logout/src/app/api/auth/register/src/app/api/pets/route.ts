import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.userType !== 'owner') {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, species, breed, age, weight, notes } = body

    if (!name || !species) {
      return NextResponse.json(
        { error: '必須項目を入力してください' },
        { status: 400 }
      )
    }

    const pet = await prisma.pet.create({
      data: {
        ownerId: session.id,
        name,
        species,
        breed: breed || null,
        age: age || null,
        weight: weight || null,
        notes: notes || null,
      },
    })

    return NextResponse.json({ pet })
  } catch (error) {
    console.error('Pet creation error:', error)
    return NextResponse.json(
      { error: 'ペット登録に失敗しました' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const pets = await prisma.pet.findMany({
      where: { ownerId: session.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ pets })
  } catch (error) {
    console.error('Pet fetch error:', error)
    return NextResponse.json(
      { error: 'ペット情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}
