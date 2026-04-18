import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    navigate('/admin/dashboard')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch {
      setError('登录失败，请检查邮箱和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-foreground mb-1">星耀演出服</h1>
          <p className="text-muted-foreground text-xs tracking-[0.2em]">管理后台</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-lg border p-6 space-y-4">
          {error && (
            <div className="text-destructive text-sm bg-destructive/5 p-3 rounded border border-destructive/10">
              {error}
            </div>
          )}
          <div>
            <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-sm border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="请输入密码"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm tracking-wider font-medium rounded-sm text-accent-foreground transition-all hover:shadow-[var(--shadow-elegant)] disabled:opacity-50"
            style={{ background: 'var(--gradient-gold)' }}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="text-center text-muted-foreground/50 text-xs mt-6">
          返回 <a href="/" className="text-accent hover:underline">官网首页</a>
        </p>
      </div>
    </div>
  )
}
