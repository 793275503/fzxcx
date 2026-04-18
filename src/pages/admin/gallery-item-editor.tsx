import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGalleryItem, useGalleryMutations } from '@/hooks/use-gallery'
import { useCategoriesAdmin } from '@/hooks/use-categories'
import { ImageUpload } from '@/components/ui/image-upload'
import { Toast } from '@/components/ui/confirm-dialog'

export function GalleryItemEditor() {
  const { id } = useParams()
  const isNew = !id
  const { item, isLoading } = useGalleryItem(id || '')
  const { categories } = useCategoriesAdmin()
  const { upsertGalleryItem } = useGalleryMutations()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    category_id: '',
    description: '',
    image_url: '',
    sort_order: 0,
    is_featured: false,
    is_active: true,
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title,
        category_id: item.category_id,
        description: item.description,
        image_url: item.image_url,
        sort_order: item.sort_order,
        is_featured: item.is_featured,
        is_active: item.is_active,
      })
    }
  }, [item])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.category_id || !form.image_url) return
    setSaving(true)
    try {
      await upsertGalleryItem({ id: isNew ? undefined : id, ...form })
      setToast({ message: '保存成功', type: 'success' })
      setTimeout(() => navigate('/admin/gallery'), 800)
    } catch {
      setToast({ message: '保存失败', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (!isNew && isLoading) {
    return <div className="text-muted-foreground text-sm">加载中...</div>
  }

  return (
    <div className="max-w-2xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="font-serif text-2xl text-foreground mb-6">
        {isNew ? '添加案例' : '编辑案例'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">标题 *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm(s => ({ ...s, title: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            required
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">分类 *</label>
          <select
            value={form.category_id}
            onChange={(e) => setForm(s => ({ ...s, category_id: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            required
          >
            <option value="">选择分类</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">描述</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm(s => ({ ...s, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">图片 *</label>
          <ImageUpload bucket="gallery" value={form.image_url} onChange={(url) => setForm(s => ({ ...s, image_url: url }))} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">排序</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm(s => ({ ...s, sort_order: Number(e.target.value) }))}
              className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col justify-end gap-3">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm(s => ({ ...s, is_featured: e.target.checked }))} className="accent-accent" />
              推荐案例
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm(s => ({ ...s, is_active: e.target.checked }))} className="accent-accent" />
              显示
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-sm tracking-wider rounded-sm text-accent-foreground hover:shadow-[var(--shadow-elegant)] transition-all disabled:opacity-50"
            style={{ background: 'var(--gradient-gold)' }}
          >
            {saving ? '保存中...' : '保存'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/gallery')}
            className="px-6 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}
