import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function OwnerHomePage() {
  const session = await getSession()

  if (!session || session.userType !== 'owner') {
    redirect('/login')
  }

  const pets = await prisma.pet.findMany({
    where: { ownerId: session.id },
  })

  const requests = await prisma.walkRequest.findMany({
    where: { ownerId: session.id },
    include: {
      pet: true,
      selectedWalker: true,
      applications: {
        include: {
          walker: {
            include: {
              walkerProfile: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">飼い主ホーム</h1>

      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">ペット情報</h2>
        {pets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">ペットが登録されていません</p>
            <Link
              href="/owner/pet/register"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              ペットを登録する
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pets.map((pet) => (
              <div key={pet.id} className="border rounded p-4">
                <h3 className="font-bold text-lg">{pet.name}</h3>
                <p className="text-gray-600">
                  {pet.species} / {pet.breed || '未設定'} / {pet.age || '?'}歳 / {pet.weight || '?'}kg
                </p>
                {pet.notes && <p className="text-sm text-gray-500 mt-2">{pet.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid md:grid-cols-3 gap-4 mb-6">
        <Link
          href="/owner/request/create"
          className="bg-green-600 text-white p-6 rounded-lg text-center hover:bg-green-700"
        >
          <div className="text-3xl mb-2">📝</div>
          <div className="font-bold">新規リクエスト作成</div>
        </Link>
        <Link
          href="/owner/walkers"
          className="bg-blue-600 text-white p-6 rounded-lg text-center hover:bg-blue-700"
        >
          <div className="text-3xl mb-2">👥</div>
          <div className="font-bold">ウォーカー一覧</div>
        </Link>
        <Link
          href="/owner/pet/register"
          className="bg-purple-600 text-white p-6 rounded-lg text-center hover:bg-purple-700"
        >
          <div className="text-3xl mb-2">🐕</div>
          <div className="font-bold">ペット登録</div>
        </Link>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">散歩リクエスト一覧</h2>
        {requests.length === 0 ? (
          <p className="text-gray-600 text-center py-8">まだリクエストがありません</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">{request.pet.name}の散歩</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(request.preferredDate).toLocaleString('ja-JP')}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      request.status === 'open'
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : request.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {request.status === 'open'
                      ? '募集中'
                      : request.status === 'confirmed'
                      ? '確定'
                      : request.status === 'completed'
                      ? '完了'
                      : 'キャンセル'}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{request.address}</p>
                <p className="text-sm text-gray-500 mt-2">
                  応募: {request.applications.length}件
                  {request.selectedWalker && ` / 担当: ${request.selectedWalker.name}さん`}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
