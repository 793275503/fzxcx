import { useState } from 'react'
import { useNavLinksAdmin, useNavLinkMutations } from '@/hooks/use-nav-links'
import { Plus, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Toast } from '@/components/ui/confirm-dialog'

export function NavLinkManager() {
  const { navLinks, isLoading } = useNavLinksAdmin()
  const { upsertNavLink, deleteNavLink } = useNavLinkMutations()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [newLink, setNewLink] = useState({ label: '', href: '' })

  const handleAdd = async () => {
    if (!newLink.label || !newLink.href) return
    try {
      await upsertNavLink({ ...newLink, sort_order: navLinks.length, is_active: true })
      setNewLink({ label: '', href: '' })
      setToast({ message: '添加成功', type: 'success' })
    } catch {
      setToast({ message: '添加失败', type: 'error' })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteNavLink(deleteId)
      setToast({ message: '删除成功', type: 'success' })
    } catch {
      setToast({ message: '删除失败', type: 'error' })
    }
    setDeleteId(null)
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="font-serif text-2xl text-foreground mb-6">导航栏管理</h1>

      <div className="bg-card rounded-lg border p-4 mb-6">
        <p className="text-xs text-muted-foreground tracking-wider mb-3">添加导航项</p>
        <div className="flex gap-3">
          <input type="text" value={newLink.label} onChange={(e) => setNewLink(s => ({ ...s, label: e.target.value }))} placeholder="名称（如：首页）" className="w-40 px-3 py-2 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
          <input type="text" value={newLink.href} onChange={(e) => setNewLink(s => ({ ...s, href: e.target.value }))} placeholder="链接（如：#hero）" className="flex-1 px-3 py-2 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
          <button onClick={handleAdd} className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-sm text-accent-foreground" style={{ background: 'var(--gradient-gold)' }}><Plus size={14} />添加</button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}</div>
      ) : (
        <div className="space-y-2">
          {navLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-4 bg-card rounded-lg border p-3">
              <span className="text-foreground text-sm w-32">{link.label}</span>
              <span className="text-muted-foreground text-xs flex-1">{link.href}</span>
              <button onClick={() => setDeleteId(link.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="确认删除" description="确定要删除该导航项吗？" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
