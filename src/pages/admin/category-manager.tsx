import { useState } from 'react'
import { useCategoriesAdmin, useCategoryMutations } from '@/hooks/use-categories'
import { Plus, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Toast } from '@/components/ui/confirm-dialog'

export function CategoryManager() {
  const { categories, isLoading } = useCategoriesAdmin()
  const { upsertCategory, deleteCategory } = useCategoryMutations()
  const [newName, setNewName] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleAdd = async () => {
    if (!newName || !newSlug) return
    try {
      await upsertCategory({ name: newName, slug: newSlug, sort_order: categories.length, is_active: true })
      setNewName('')
      setNewSlug('')
      setToast({ message: '添加成功', type: 'success' })
    } catch {
      setToast({ message: '添加失败', type: 'error' })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteCategory(deleteId)
      setToast({ message: '删除成功', type: 'success' })
    } catch {
      setToast({ message: '删除失败，可能存在关联案例', type: 'error' })
    }
    setDeleteId(null)
  }

  const handleToggle = async (id: string, name: string, slug: string, isActive: boolean) => {
    try {
      await upsertCategory({ id, name, slug, sort_order: 0, is_active: !isActive })
      setToast({ message: isActive ? '已隐藏' : '已显示', type: 'success' })
    } catch {
      setToast({ message: '操作失败', type: 'error' })
    }
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="font-serif text-2xl text-foreground mb-6">分类管理</h1>

      <div className="bg-card rounded-lg border p-4 mb-6">
        <p className="text-xs text-muted-foreground tracking-wider mb-3">添加新分类</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="分类名称（如：舞蹈演出服）"
            className="flex-1 px-3 py-2 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <input
            type="text"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            placeholder="英文标识（如：dance）"
            className="w-40 px-3 py-2 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button onClick={handleAdd} className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-sm text-accent-foreground" style={{ background: 'var(--gradient-gold)' }}>
            <Plus size={14} />
            添加
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}</div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-4 bg-card rounded-lg border p-3">
              <div className="flex-1">
                <span className="text-foreground text-sm">{cat.name}</span>
                <span className="text-muted-foreground text-xs ml-2">/{cat.slug}</span>
              </div>
              <button
                onClick={() => handleToggle(cat.id, cat.name, cat.slug, cat.is_active)}
                className={`text-xs px-2 py-1 rounded ${cat.is_active ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}
              >
                {cat.is_active ? '显示' : '隐藏'}
              </button>
              <button onClick={() => setDeleteId(cat.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="确认删除"
        description="删除分类后，关联的案例将变为未分类。确定删除吗？"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
