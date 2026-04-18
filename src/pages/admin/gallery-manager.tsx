import { useNavigate, Link } from 'react-router-dom'
import { useGalleryAdmin, useGalleryMutations } from '@/hooks/use-gallery'
import { useCategoriesAdmin } from '@/hooks/use-categories'
import { useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Toast } from '@/components/ui/confirm-dialog'

export function GalleryManager() {
  const { items, isLoading } = useGalleryAdmin()
  const { categories } = useCategoriesAdmin()
  const { deleteGalleryItem, toggleGalleryItem } = useGalleryMutations()
  const navigate = useNavigate()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const catMap = Object.fromEntries(categories.map(c => [c.id, c.name]))

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteGalleryItem(deleteId)
      setToast({ message: '删除成功', type: 'success' })
    } catch {
      setToast({ message: '删除失败', type: 'error' })
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await toggleGalleryItem({ id, isActive: !isActive })
      setToast({ message: isActive ? '已隐藏' : '已显示', type: 'success' })
    } catch {
      setToast({ message: '操作失败', type: 'error' })
    }
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-foreground">案例管理</h1>
        <Link
          to="/admin/gallery/new"
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-sm text-accent-foreground hover:shadow-[var(--shadow-elegant)] transition-all"
          style={{ background: 'var(--gradient-gold)' }}
        >
          <Plus size={16} />
          添加案例
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">暂无案例</p>
          <p className="text-sm">点击"添加案例"创建第一条</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-card rounded-lg border p-3 hover:shadow-[var(--shadow-card)] transition-shadow">
              <img src={item.image_url} alt={item.title} className="w-16 h-20 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <h3 className="text-foreground font-medium text-sm truncate">{item.title}</h3>
                <p className="text-muted-foreground text-xs mt-0.5">{catMap[item.category_id] || '未分类'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggle(item.id, item.is_active)} className="p-1.5 text-muted-foreground hover:text-accent transition-colors" title={item.is_active ? '隐藏' : '显示'}>
                  {item.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => navigate(`/admin/gallery/${item.id}`)} className="p-1.5 text-muted-foreground hover:text-accent transition-colors" title="编辑">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors" title="删除">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="确认删除"
        description="删除后无法恢复，确定要删除该案例吗？"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}
