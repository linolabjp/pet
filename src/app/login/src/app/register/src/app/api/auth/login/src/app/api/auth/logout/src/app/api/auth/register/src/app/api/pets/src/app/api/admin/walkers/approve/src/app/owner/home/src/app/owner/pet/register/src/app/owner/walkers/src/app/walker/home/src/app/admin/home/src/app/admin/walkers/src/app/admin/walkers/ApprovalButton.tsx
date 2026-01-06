'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ApprovalButtonProps {
  walkerId: string
}

export default function ApprovalButton({ walkerId }: ApprovalButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleApproval = async (status: 'approved' | 'rejected') => {
    if (!confirm(`本当に${status === 'approved' ? '承認' : '却下'}しますか?`)) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/walkers/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walkerId, status }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('処理に失敗しました')
      }
    } catch (error) {
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleApproval('approved')}
        disabled={loading}
        className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        ✓ 承認
      </button>
      <button
        onClick={() => handleApproval('rejected')}
        disabled={loading}
        className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        × 却下
      </button>
    </div>
  )
}
