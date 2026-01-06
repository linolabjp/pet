import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function WalkersPage() {
  const session = await getSession()

  if (!session || session.userType !== 'owner') {
    redirect('/login')
  }

  const walkers = await prisma.user.findMany({
    where: {
      userType: 'walker',
      walkerProfile: {
        approvalStatus: 'approved',
      },
    },
    include: {
      walkerProfile: true,
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ウォーカー一覧</h1>

      {walkers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">現在、ウォーカーの登録がありません</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {walkers.map((walker) => (
            <div key={walker.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">{walker.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {walker.walkerProfile?.qualification === 'veterinarian'
                      ? '獣医師'
                      : '動物看護師'}
                  </span>
                  {walker.walkerProfile?.experienceYears && (
                    <span>経験 {walker.walkerProfile.experienceYears}年</span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">対応エリア:</span> {walker.walkerProfile?.area}
                </p>
              </div>

              {walker.walkerProfile?.introduction && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {walker.walkerProfile.introduction}
                  </p>
                </div>
              )}

              <div className="text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                詳細を見る
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/owner/home"
          className="text-blue-600 hover:underline"
        >
          ← ホームに戻る
        </Link>
      </div>
    </div>
  )
}
