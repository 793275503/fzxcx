import { useState, useEffect } from 'react'
import { useFooter, useFooterMutations } from '@/hooks/use-footer'
import { ImageUpload } from '@/components/ui/image-upload'
import { Toast } from '@/components/ui/confirm-dialog'

export function FooterEditor() {
  const { footer } = useFooter()
  const { upsertFooter } = useFooterMutations()
  const [form, setForm] = useState(footer)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => { setForm(footer) }, [footer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await upsertFooter({ ...form, id: form.id || undefined })
      setToast({ message: '保存成功', type: 'success' })
    } catch {
      setToast({ message: '保存失败', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="font-serif text-2xl text-foreground mb-6">页脚编辑</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">版权信息</label>
          <input type="text" value={form.copyright_text} onChange={(e) => setForm(s => ({ ...s, copyright_text: e.target.value }))} className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">ICP备案号</label>
          <input type="text" value={form.icp_number} onChange={(e) => setForm(s => ({ ...s, icp_number: e.target.value }))} className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">微信公众号名称</label>
          <input type="text" value={form.wechat_name} onChange={(e) => setForm(s => ({ ...s, wechat_name: e.target.value }))} className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">微信描述</label>
          <input type="text" value={form.wechat_description} onChange={(e) => setForm(s => ({ ...s, wechat_description: e.target.value }))} className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">微信二维码</label>
          <ImageUpload bucket="misc" value={form.wechat_qr_url} onChange={(url) => setForm(s => ({ ...s, wechat_qr_url: url }))} />
        </div>
        <button type="submit" disabled={saving} className="px-6 py-2.5 text-sm tracking-wider rounded-sm text-accent-foreground hover:shadow-[var(--shadow-elegant)] transition-all disabled:opacity-50" style={{ background: 'var(--gradient-gold)' }}>
          {saving ? '保存中...' : '保存'}
        </button>
      </form>
    </div>
  )
}
