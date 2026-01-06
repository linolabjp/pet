import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ApprovalButton from './ApprovalButton'

export default async function AdminWalkersPage() {
  const session = await getSession()

  if (!session || session.userType !== 'admin') {
    redirect('/login')
  }

  const walkers = await prisma.user.findMany({
    where: { userType: 'walker' },
    include: {
      walkerProfile: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const pendingWalkers = walkers.filter((w) => w.walkerProfile?.approvalStatus === 'pending')
  const approvedWalkers = walkers.filter((w) => w.walkerProfile?.approvalStatus === 'approved')
  const rejectedWalkers = walkers.filter((w) => w.walkerProfile?.approvalStatus === 'rejected')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ウォーカー審査</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-yellow-600">
          審査待ち ({pendingWalkers.length})
        </h2>
        {pendingWalkers.length === 0 ? (
          <p className="text-gray-600 bg-white rounded-lg shadow-md p-6">
            審査待ちのウォーカーはいません
          </p>
        ) : (
          <div className="space-y-4">
            {pendingWalkers.map((walker) => (
              <div key={walker.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{walker.name}</h3>
                    <p className="text-sm text-gray-600">{walker.email}</p>
                    <p className="text-sm text-gray-600">{walker.phone}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-semibold">
                    審査待ち
                  </span>
                </div>

                {walker.walkerProfile && (
                  <div className="mb-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">資格:</span>{' '}
                      {walker.walkerProfile.qualification === 'veterinarian' ? '獣医師' : '動物看護師'}
                    </p>
                    {walker.walkerProfile.experienceYears && (
                      <p className="text-sm">
                        <span className="font-semibold">経験年数:</span>{' '}
                        {walker.walkerProfile.experienceYears}年
                      </p>
                    )}
                    <p className="text-sm">
                      <span className="font-semibold">対応エリア:</span> {walker.walkerProfile.area}
                    </p>
                    {walker.walkerProfile.introduction && (
                      <p className="text-sm">
                        <span className="font-semibold">自己紹介:</span> {walker.walkerProfile.introduction}
                      </p>
                    )}
                  </div>
                )}

                <ApprovalButton walkerId={walker.id} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-green-600">
          承認済み ({approvedWalkers.length})
        </h2>
        {approvedWalkers.length === 0 ? (
          <p className="text-gray-600 bg-white rounded-lg shadow-md p-6">
            承認済みのウォーカーはいません
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {approvedWalkers.map((walker) => (
              <div key={walker.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{walker.name}</h3>
                    <p className="text-sm text-gray-600">{walker.email}</p>
                    <p className="text-xs text-gray-500">
                      {walker.walkerProfile?.qualification === 'veterinarian' ? '獣医師' : '動物看護師'} |{' '}
                      {walker.walkerProfile?.area}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                    承認済み
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {rejectedWalkers.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            却下 ({rejectedWalkers.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {rejectedWalkers.map((walker) => (
              <div key={walker.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{walker.name}</h3>
                    <p className="text-sm text-gray-600">{walker.email}</p>
                  </div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                    却下
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
