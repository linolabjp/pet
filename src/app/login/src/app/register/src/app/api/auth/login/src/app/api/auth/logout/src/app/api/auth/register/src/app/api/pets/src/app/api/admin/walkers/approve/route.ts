import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.userType !== 'admin') {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { walkerId, status } = body

    if (!walkerId || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: '無効なリクエストです' },
        { status: 400 }
      )
    }

    const profile = await prisma.walkerProfile.updateMany({
      where: { userId: walkerId },
      data: {
        approvalStatus: status,
        approvedAt: status === 'approved' ? new Date() : null,
      },
    })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Approval error:', error)
    return NextResponse.json(
      { error: '審査処理に失敗しました' },
      { status: 500 }
    )
  }
}
