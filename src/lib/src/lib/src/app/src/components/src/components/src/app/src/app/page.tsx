import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession, getRedirectPath } from '@/lib/auth'

export default async function Home() {
  const session = await getSession()

  if (session) {
    redirect(getRedirectPath(session.userType))
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          🐕 獣医師・動物看護師による<br />ペット散歩代行サービス
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          プロフェッショナルな有資格者が、愛するペットの散歩をサポートします
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            はじめる
          </Link>
          <Link
            href="/login"
            className="bg-gray-200 text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-300"
          >
            ログイン
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-4xl mb-4">🩺</div>
          <h3 className="text-xl font-bold mb-2">有資格者のみ</h3>
          <p className="text-gray-600">
            全員が獣医師または動物看護師の資格を持つプロフェッショナル
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-4xl mb-4">💝</div>
          <h3 className="text-xl font-bold mb-2">安心・安全</h3>
          <p className="text-gray-600">
            ペットの健康管理に精通したスタッフによる丁寧なケア
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-bold mb-2">詳細レポート</h3>
          <p className="text-gray-600">
            散歩後には写真付きの詳細レポートをお届けします
          </p>
        </div>
      </section>

      <section className="bg-green-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">ウォーカー募集中</h2>
        <p className="text-gray-700 mb-6">
          獣医師・動物看護師の資格をお持ちの方、<br />
          空き時間を活用してペットのケアをしませんか？
        </p>
        <Link
          href="/register"
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 inline-block"
        >
          ウォーカーとして登録
        </Link>
      </section>
    </div>
  )
}
