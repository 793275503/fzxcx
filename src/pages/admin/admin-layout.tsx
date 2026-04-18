import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Image, FolderOpen, MonitorSmartphone, Building2, Phone, Navigation, FileText, MessageSquare, Settings, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { label: '仪表盘', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: '案例管理', icon: Image, href: '/admin/gallery' },
  { label: '分类管理', icon: FolderOpen, href: '/admin/categories' },
  { label: '首屏编辑', icon: MonitorSmartphone, href: '/admin/hero' },
  { label: '关于编辑', icon: Building2, href: '/admin/about' },
  { label: '联系方式', icon: Phone, href: '/admin/contact-info' },
  { label: '导航栏', icon: Navigation, href: '/admin/nav-links' },
  { label: '页脚编辑', icon: FileText, href: '/admin/footer' },
  { label: '预约记录', icon: MessageSquare, href: '/admin/submissions' },
  { label: '网站配置', icon: Settings, href: '/admin/site-config' },
]

export function AdminLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-40 w-60 bg-foreground text-primary-foreground flex flex-col transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-4 border-b border-primary-foreground/10">
          <h2 className="font-serif text-lg text-primary-foreground">星耀演出服</h2>
          <p className="text-primary-foreground/40 text-[10px] tracking-[0.15em] mt-0.5">管理后台</p>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto admin-sidebar">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent border-r-2 border-accent'
                  : 'text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5'
              )}
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-primary-foreground/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs">
              {(user?.email?.[0] || 'A').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-primary-foreground/80 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-primary-foreground/40 hover:text-primary-foreground text-xs transition-colors"
          >
            <LogOut size={14} />
            退出登录
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-border bg-card flex items-center px-4 lg:px-6 gap-3">
          <button
            className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1" />
          <a href="/" className="text-xs text-muted-foreground hover:text-accent transition-colors">
            查看官网 →
          </a>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
