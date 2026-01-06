import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function WalkerHomePage() {
  const session = await getSession()

  if (!session || session.userType !== 'walker') {
    redirect('/login')
  }

  const profile = await prisma.walkerProfile.findUnique({
    where: { userId: session.id },
  })

  const applications = await prisma.application.findMany({
    where: { walkerId: session.id },
    include: {
      request: {
        include: {
          pet: true,
          owner: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const confirmedWalks = await prisma.walkRequest.findMany({
    where: {
      selectedWalkerId: session.id,
      status: { in: ['confirmed', 'completed'] },
    },
    include: {
      pet: true,
      owner: true,
    },
    orderBy: { preferredDate: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ウォーカーホーム</h1>

      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">審査ステータス</h2>
        {profile?.approvalStatus === 'pending' && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
            現在審査中です。承認されるまでお待ちください。
          </div>
        )}
        {profile?.approvalStatus === 'approved' && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded">
            ✅ 承認済み - リクエストに応募できます
          </div>
        )}
        {profile?.approvalStatus === 'rejected' && (
          <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded">
            審査が承認されませんでした。詳細はお問い合わせください。
          </div>
        )}
      </section>

      {profile?.approvalStatus === 'approved' && (
        <section className="grid md:grid-cols-2 gap-4 mb-6">
          <Link
            href="/walker/requests"
            className="bg-blue-600 text-white p-6 rounded-lg text-center hover:bg-blue-700"
          >
            <div className="text-3xl mb-2">📋</div>
            <div className="font-bold">散歩リクエスト一覧</div>
          </Link>
          <Link
            href="/walker/confirmed"
            className="bg-green-600 text-white p-6 rounded-lg text-center hover:bg-green-700"
          >
            <div className="text-3xl mb-2">✅</div>
            <div className="font-bold">確定した散歩</div>
          </Link>
        </section>
      )}

      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">応募状況</h2>
        {applications.length === 0 ? (
          <p className="text-gray-600 text-center py-4">応募中のリクエストはありません</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="border rounded p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{app.request.pet.name}の散歩</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(app.request.preferredDate).toLocaleString('ja-JP')}
                    </p>
                    <p className="text-sm text-gray-700">{app.request.address}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      app.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : app.status === 'selected'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {app.status === 'pending'
                      ? '選考中'
                      : app.status === 'selected'
                      ? '選ばれました'
                      : '不採用'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">確定した散歩</h2>
        {confirmedWalks.length === 0 ? (
          <p className="text-gray-600 text-center py-4">確定した散歩はありません</p>
        ) : (
          <div className="space-y-4">
            {confirmedWalks.slice(0, 5).map((walk) => (
              <div key={walk.id} className="border rounded p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{walk.pet.name}の散歩</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(walk.preferredDate).toLocaleString('ja-JP')}
                    </p>
                    <p className="text-sm text-gray-700">{walk.address}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      walk.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {walk.status === 'confirmed' ? '予定' : '完了'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
