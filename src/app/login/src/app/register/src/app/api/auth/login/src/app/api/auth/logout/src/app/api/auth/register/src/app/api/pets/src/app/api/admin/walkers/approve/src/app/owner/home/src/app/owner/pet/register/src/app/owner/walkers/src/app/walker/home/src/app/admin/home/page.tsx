import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminHomePage() {
  const session = await getSession()

  if (!session || session.userType !== 'admin') {
    redirect('/login')
  }

  const pendingWalkers = await prisma.walkerProfile.count({
    where: { approvalStatus: 'pending' },
  })

  const stats = {
    totalOwners: await prisma.user.count({ where: { userType: 'owner' } }),
    totalWalkers: await prisma.user.count({ where: { userType: 'walker' } }),
    approvedWalkers: await prisma.walkerProfile.count({ where: { approvalStatus: 'approved' } }),
    totalRequests: await prisma.walkRequest.count(),
    openRequests: await prisma.walkRequest.count({ where: { status: 'open' } }),
    completedRequests: await prisma.walkRequest.count({ where: { status: 'completed' } }),
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">管理者ダッシュボード</h1>

      <section className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold">{stats.totalOwners}</div>
          <div className="text-sm text-gray-600">飼い主</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">🩺</div>
          <div className="text-2xl font-bold">{stats.totalWalkers}</div>
          <div className="text-sm text-gray-600">ウォーカー登録数</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold">{stats.approvedWalkers}</div>
          <div className="text-sm text-gray-600">承認済みウォーカー</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">📋</div>
          <div className="text-2xl font-bold">{stats.totalRequests}</div>
          <div className="text-sm text-gray-600">総リクエスト数</div>
        </div>
      </section>

      {pendingWalkers > 0 && (
        <section className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">⚠️ 審査待ちのウォーカーがいます</h3>
              <p className="text-sm">{pendingWalkers}件の審査が必要です</p>
            </div>
            <Link
              href="/admin/walkers"
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              審査画面へ
            </Link>
          </div>
        </section>
      )}

      <section className="grid md:grid-cols-3 gap-4 mb-6">
        <Link
          href="/admin/walkers"
          className="bg-blue-600 text-white p-6 rounded-lg text-center hover:bg-blue-700"
        >
          <div className="text-3xl mb-2">👨‍⚕️</div>
          <div className="font-bold">ウォーカー審査</div>
          {pendingWalkers > 0 && (
            <div className="text-sm mt-1">({pendingWalkers}件待機中)</div>
          )}
        </Link>
        <Link
          href="/admin/requests"
          className="bg-green-600 text-white p-6 rounded-lg text-center hover:bg-green-700"
        >
          <div className="text-3xl mb-2">📋</div>
          <div className="font-bold">全リクエスト</div>
        </Link>
        <Link
          href="/admin/users"
          className="bg-purple-600 text-white p-6 rounded-lg text-center hover:bg-purple-700"
        >
          <div className="text-3xl mb-2">👥</div>
          <div className="font-bold">ユーザー管理</div>
        </Link>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">リクエストステータス</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.openRequests}</div>
            <div className="text-sm text-gray-600">募集中</div>
          </div>
          <div className="border rounded p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalRequests - stats.openRequests - stats.completedRequests}
            </div>
            <div className="text-sm text-gray-600">確定済み</div>
          </div>
          <div className="border rounded p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completedRequests}</div>
            <div className="text-sm text-gray-600">完了</div>
          </div>
        </div>
      </section>
    </div>
  )
}
