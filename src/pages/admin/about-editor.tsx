import { useState, useEffect } from 'react'
import { useAbout, useAboutMutations } from '@/hooks/use-about'
import { ImageUpload } from '@/components/ui/image-upload'
import { Toast } from '@/components/ui/confirm-dialog'
import { Plus, Trash2 } from 'lucide-react'

export function AboutEditor() {
  const { about } = useAbout()
  const { upsertAbout } = useAboutMutations()
  const [form, setForm] = useState(about)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => { setForm(about) }, [about])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await upsertAbout({ ...form, id: form.id || undefined })
      setToast({ message: '保存成功', type: 'success' })
    } catch {
      setToast({ message: '保存失败', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const updateParagraph = (index: number, value: string) => {
    const desc = [...form.description]
    desc[index] = value
    setForm(s => ({ ...s, description: desc }))
  }

  const addParagraph = () => setForm(s => ({ ...s, description: [...s.description, ''] }))
  const removeParagraph = (i: number) => setForm(s => ({ ...s, description: s.description.filter((_, idx) => idx !== i) }))

  const updateStat = (index: number, field: string, value: string | number) => {
    const stats = [...form.stats]
    stats[index] = { ...stats[index], [field]: value }
    setForm(s => ({ ...s, stats }))
  }

  const addStat = () => setForm(s => ({ ...s, stats: [...s.stats, { icon: 'Award', value: 0, suffix: '', label: '' }] }))
  const removeStat = (i: number) => setForm(s => ({ ...s, stats: s.stats.filter((_, idx) => idx !== i) }))

  return (
    <div className="max-w-2xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="font-serif text-2xl text-foreground mb-6">关于编辑</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">标题</label>
          <input type="text" value={form.section_title} onChange={(e) => setForm(s => ({ ...s, section_title: e.target.value }))} className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted-foreground tracking-wider">简介段落</label>
            <button type="button" onClick={addParagraph} className="text-xs text-accent hover:underline flex items-center gap-1"><Plus size={12} />添加段落</button>
          </div>
          {form.description.map((para, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <textarea value={para} onChange={(e) => updateParagraph(i, e.target.value)} rows={2} className="flex-1 px-3 py-2 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent resize-none" />
              <button type="button" onClick={() => removeParagraph(i)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>

        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">图片</label>
          <ImageUpload bucket="about" value={form.image_url} onChange={(url) => setForm(s => ({ ...s, image_url: url }))} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted-foreground tracking-wider">数据指标</label>
            <button type="button" onClick={addStat} className="text-xs text-accent hover:underline flex items-center gap-1"><Plus size={12} />添加指标</button>
          </div>
          {form.stats.map((stat, i) => (
            <div key={i} className="flex gap-2 mb-2 items-end">
              <input type="text" value={stat.icon} onChange={(e) => updateStat(i, 'icon', e.target.value)} placeholder="图标名" className="w-20 px-2 py-2 rounded-sm border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-accent" />
              <input type="number" value={stat.value} onChange={(e) => updateStat(i, 'value', Number(e.target.value))} placeholder="数值" className="w-20 px-2 py-2 rounded-sm border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-accent" />
              <input type="text" value={stat.suffix} onChange={(e) => updateStat(i, 'suffix', e.target.value)} placeholder="后缀" className="w-14 px-2 py-2 rounded-sm border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-accent" />
              <input type="text" value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="标签" className="flex-1 px-2 py-2 rounded-sm border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-accent" />
              <button type="button" onClick={() => removeStat(i)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving} className="px-6 py-2.5 text-sm tracking-wider rounded-sm text-accent-foreground hover:shadow-[var(--shadow-elegant)] transition-all disabled:opacity-50" style={{ background: 'var(--gradient-gold)' }}>
          {saving ? '保存中...' : '保存'}
        </button>
      </form>
    </div>
  )
}
