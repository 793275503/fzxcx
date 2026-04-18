import { useState, useEffect } from 'react'
import { useSiteConfig } from '@/hooks/use-site-config'
import { upsertSiteConfig } from '@/services/site-config'
import { Toast } from '@/components/ui/confirm-dialog'

const CONFIG_ITEMS = [
  { key: 'brand_name', label: '品牌名称', config_group: 'brand' },
  { key: 'brand_subtitle', label: '英文副标题', config_group: 'brand' },
  { key: 'brand_tagline', label: '品牌标语', config_group: 'brand' },
  { key: 'seo_title', label: 'SEO 标题', config_group: 'seo' },
  { key: 'seo_description', label: 'SEO 描述', config_group: 'seo' },
]

export function SiteConfigEditor() {
  const { configs, isLoading } = useSiteConfig()
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const values: Record<string, string> = {}
    CONFIG_ITEMS.forEach(item => {
      const config = configs.find(c => c.key === item.key)
      values[item.key] = config ? String(config.value) : ''
    })
    setForm(values)
  }, [configs])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      for (const item of CONFIG_ITEMS) {
        await upsertSiteConfig({ key: item.key, value: form[item.key] || '', config_group: item.config_group })
      }
      setToast({ message: '保存成功', type: 'success' })
    } catch {
      setToast({ message: '保存失败', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return <div className="text-muted-foreground text-sm">加载中...</div>

  return (
    <div className="max-w-2xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="font-serif text-2xl text-foreground mb-6">网站配置</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {['brand', 'seo'].map(group => {
          const items = CONFIG_ITEMS.filter(i => i.config_group === group)
          return (
            <div key={group}>
              <h3 className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-3">
                {group === 'brand' ? '品牌设置' : 'SEO 设置'}
              </h3>
              <div className="space-y-4 bg-card rounded-lg border p-4">
                {items.map(item => (
                  <div key={item.key}>
                    <label className="text-xs text-muted-foreground block mb-1.5">{item.label}</label>
                    <input
                      type="text"
                      value={form[item.key] || ''}
                      onChange={(e) => setForm(s => ({ ...s, [item.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        <button type="submit" disabled={saving} className="px-6 py-2.5 text-sm tracking-wider rounded-sm text-accent-foreground hover:shadow-[var(--shadow-elegant)] transition-all disabled:opacity-50" style={{ background: 'var(--gradient-gold)' }}>
          {saving ? '保存中...' : '保存'}
        </button>
      </form>
    </div>
  )
}
