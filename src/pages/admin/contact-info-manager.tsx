import { useState } from 'react'
import { useContactInfoAdmin, useContactInfoMutations } from '@/hooks/use-contact-info'
import { Plus, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Toast } from '@/components/ui/confirm-dialog'

const ICON_OPTIONS = ['MapPin', 'Phone', 'Mail', 'Clock']

export function ContactInfoManager() {
  const { contactInfo, isLoading } = useContactInfoAdmin()
  const { upsertContactInfo, deleteContactInfo } = useContactInfoMutations()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [newItem, setNewItem] = useState({ icon_name: 'Phone', label: '', value: '', sub: '' })

  const handleAdd = async () => {
    if (!newItem.label || !newItem.value) return
    try {
      await upsertContactInfo({ ...newItem, sort_order: contactInfo.length, is_active: true })
      setNewItem({ icon_name: 'Phone', label: '', value: '', sub: '' })
      setToast({ message: '添加成功', type: 'success' })
    } catch {
      setToast({ message: '添加失败', type: 'error' })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteContactInfo(deleteId)
      setToast({ message: '删除成功', type: 'success' })
    } catch {
      setToast({ message: '删除失败', type: 'error' })
    }
    setDeleteId(null)
  }

  const handleUpdate = async (id: string, field: string, value: string) => {
    const item = contactInfo.find(c => c.id === id)
    if (!item) return
    try {
      await upsertContactInfo({ ...item, [field]: value })
    } catch {
      setToast({ message: '更新失败', type: 'error' })
    }
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="font-serif text-2xl text-foreground mb-6">联系方式管理</h1>

      <div className="bg-card rounded-lg border p-4 mb-6">
        <p className="text-xs text-muted-foreground tracking-wider mb-3">添加联系方式</p>
        <div className="flex gap-2 flex-wrap">
          <select value={newItem.icon_name} onChange={(e) => setNewItem(s => ({ ...s, icon_name: e.target.value }))} className="px-2 py-2 rounded-sm border bg-background text-sm">
            {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
          </select>
          <input type="text" value={newItem.label} onChange={(e) => setNewItem(s => ({ ...s, label: e.target.value }))} placeholder="标签" className="w-28 px-2 py-2 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
          <input type="text" value={newItem.value} onChange={(e) => setNewItem(s => ({ ...s, value: e.target.value }))} placeholder="值" className="flex-1 min-w-[120px] px-2 py-2 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
          <input type="text" value={newItem.sub} onChange={(e) => setNewItem(s => ({ ...s, sub: e.target.value }))} placeholder="补充" className="w-36 px-2 py-2 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
          <button onClick={handleAdd} className="flex items-center gap-1 px-3 py-2 text-sm rounded-sm text-accent-foreground" style={{ background: 'var(--gradient-gold)' }}><Plus size={14} />添加</button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}</div>
      ) : (
        <div className="space-y-2">
          {contactInfo.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-card rounded-lg border p-3">
              <span className="text-xs text-accent w-20">{item.icon_name}</span>
              <input type="text" value={item.label} onChange={(e) => handleUpdate(item.id, 'label', e.target.value)} className="w-24 px-2 py-1 rounded border bg-background text-sm" />
              <input type="text" value={item.value} onChange={(e) => handleUpdate(item.id, 'value', e.target.value)} className="flex-1 px-2 py-1 rounded border bg-background text-sm" />
              <input type="text" value={item.sub} onChange={(e) => handleUpdate(item.id, 'sub', e.target.value)} className="w-36 px-2 py-1 rounded border bg-background text-sm" />
              <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="确认删除" description="确定要删除该联系方式吗？" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
