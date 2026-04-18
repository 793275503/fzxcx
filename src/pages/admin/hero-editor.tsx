import { useState, useEffect } from 'react'
import { useHero, useHeroMutations } from '@/hooks/use-hero'
import { ImageUpload } from '@/components/ui/image-upload'
import { Toast } from '@/components/ui/confirm-dialog'

export function HeroEditor() {
  const { hero } = useHero()
  const { upsertHero } = useHeroMutations()
  const [form, setForm] = useState(hero)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => { setForm(hero) }, [hero])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await upsertHero({ ...form, id: form.id || undefined })
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
      <h1 className="font-serif text-2xl text-foreground mb-6">首屏编辑</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">标签文字</label>
          <input type="text" value={form.tagline} onChange={(e) => setForm(s => ({ ...s, tagline: e.target.value }))} className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">主标题（换行用\n）</label>
          <input type="text" value={form.headline_zh} onChange={(e) => setForm(s => ({ ...s, headline_zh: e.target.value }))} className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">副标题</label>
          <input type="text" value={form.subheadline} onChange={(e) => setForm(s => ({ ...s, subheadline: e.target.value }))} className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">主按钮文字</label>
            <input type="text" value={form.cta_primary_text} onChange={(e) => setForm(s => ({ ...s, cta_primary_text: e.target.value }))} className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">副按钮文字</label>
            <input type="text" value={form.cta_secondary_text} onChange={(e) => setForm(s => ({ ...s, cta_secondary_text: e.target.value }))} className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">背景图片</label>
          <ImageUpload bucket="hero" value={form.background_url} onChange={(url) => setForm(s => ({ ...s, background_url: url }))} />
        </div>
        <button type="submit" disabled={saving} className="px-6 py-2.5 text-sm tracking-wider rounded-sm text-accent-foreground hover:shadow-[var(--shadow-elegant)] transition-all disabled:opacity-50" style={{ background: 'var(--gradient-gold)' }}>
          {saving ? '保存中...' : '保存'}
        </button>
      </form>
    </div>
  )
}
