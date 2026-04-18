import { useGalleryAdmin } from '@/hooks/use-gallery'
import { useCategoriesAdmin } from '@/hooks/use-categories'
import { Link } from 'react-router-dom'
import { Image, FolderOpen, MessageSquare, Plus } from 'lucide-react'

export function AdminDashboard() {
  const { items } = useGalleryAdmin()
  const { categories } = useCategoriesAdmin()

  const stats = [
    { label: '案例总数', value: items.length, icon: Image, href: '/admin/gallery' },
    { label: '分类数量', value: categories.length, icon: FolderOpen, href: '/admin/categories' },
    { label: '预约记录', value: '-', icon: MessageSquare, href: '/admin/submissions' },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground mb-6">仪表盘</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.href}
            className="bg-card rounded-lg border p-5 hover:shadow-[var(--shadow-card)] transition-shadow"
          >
            <stat.icon className="text-accent mb-2" size={20} />
            <p className="font-serif text-3xl text-foreground">{stat.value}</p>
            <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/admin/gallery/new"
          className="flex items-center gap-3 bg-card rounded-lg border p-4 hover:shadow-[var(--shadow-card)] transition-shadow"
        >
          <Plus className="text-accent" size={18} />
          <span className="text-sm text-foreground">添加新案例</span>
        </Link>
        <Link
          to="/admin/hero"
          className="flex items-center gap-3 bg-card rounded-lg border p-4 hover:shadow-[var(--shadow-card)] transition-shadow"
        >
          <Image className="text-accent" size={18} />
          <span className="text-sm text-foreground">编辑首屏横幅</span>
        </Link>
        <Link
          to="/admin/submissions"
          className="flex items-center gap-3 bg-card rounded-lg border p-4 hover:shadow-[var(--shadow-card)] transition-shadow"
        >
          <MessageSquare className="text-accent" size={18} />
          <span className="text-sm text-foreground">查看预约记录</span>
        </Link>
      </div>
    </div>
  )
}
