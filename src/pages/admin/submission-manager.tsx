import { useState, useEffect } from 'react'
import { fetchSubmissions, updateSubmissionStatus } from '@/services/contact-submissions'
import type { ContactSubmission } from '@/types/database'
import { Toast } from '@/components/ui/confirm-dialog'

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  new: { text: '新预约', color: 'bg-accent/10 text-accent' },
  read: { text: '已读', color: 'bg-blue-500/10 text-blue-500' },
  replied: { text: '已回复', color: 'bg-green-500/10 text-green-600' },
  archived: { text: '已归档', color: 'bg-muted text-muted-foreground' },
}

export function SubmissionManager() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const loadSubmissions = async () => {
    try {
      const data = await fetchSubmissions()
      setSubmissions(data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { loadSubmissions() }, [])

  const handleStatusChange = async (id: string, status: ContactSubmission['status']) => {
    try {
      await updateSubmissionStatus(id, status)
      setToast({ message: '状态已更新', type: 'success' })
      loadSubmissions()
    } catch {
      setToast({ message: '更新失败', type: 'error' })
    }
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="font-serif text-2xl text-foreground mb-6">预约记录</h1>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded" />)}</div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">暂无预约记录</p>
          <p className="text-sm">新的预约提交后会显示在这里</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => {
            const statusInfo = STATUS_LABELS[sub.status] || STATUS_LABELS.new
            return (
              <div key={sub.id} className="bg-card rounded-lg border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-foreground font-medium text-sm">{sub.name}</span>
                    <span className="text-muted-foreground text-xs ml-2">{sub.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${statusInfo.color}`}>{statusInfo.text}</span>
                    <select
                      value={sub.status}
                      onChange={(e) => handleStatusChange(sub.id, e.target.value as ContactSubmission['status'])}
                      className="text-xs border rounded px-2 py-1 bg-background"
                    >
                      <option value="new">新预约</option>
                      <option value="read">已读</option>
                      <option value="replied">已回复</option>
                      <option value="archived">已归档</option>
                    </select>
                  </div>
                </div>
                {sub.costume_type && <p className="text-xs text-accent mb-1">类型：{sub.costume_type}</p>}
                {sub.message && <p className="text-sm text-muted-foreground">{sub.message}</p>}
                <p className="text-[10px] text-muted-foreground/50 mt-2">{new Date(sub.created_at).toLocaleString('zh-CN')}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
