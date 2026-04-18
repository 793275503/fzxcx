import { ArrowUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSite } from '@/contexts/site-context'
import { useCategories } from '@/hooks/use-categories'

export function Footer() {
  const { brandName, brandTagline, navLinks, contactInfo, footer } = useSite()
  const { categories } = useCategories()
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <footer className="bg-foreground text-primary-foreground/70 border-t border-primary-foreground/10">
      <div className="container py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-serif text-xl text-primary-foreground mb-3">{brandName}</h3>
            <p className="text-xs tracking-[0.2em] text-accent/70 mb-4">PERFORMANCE COSTUME</p>
            <p className="text-primary-foreground/50 text-sm leading-relaxed">
              {brandTagline}
            </p>
          </div>

          <div>
            <h4 className="text-primary-foreground text-sm font-medium tracking-wider mb-4">快速导航</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-primary-foreground/50 text-sm hover:text-accent transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-primary-foreground text-sm font-medium tracking-wider mb-4">定制服务</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <span className="text-primary-foreground/50 text-sm">{cat.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-primary-foreground text-sm font-medium tracking-wider mb-4">联系方式</h4>
            <div className="space-y-2 text-sm text-primary-foreground/50">
              {contactInfo.slice(0, 3).map((c) => (
                <p key={c.label}>{c.label}：{c.value}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="divider-gold w-full mt-10 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-primary-foreground/30 text-xs">
          <p>{footer.copyright}</p>
          {footer.icp && <p>{footer.icp}</p>}
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 w-10 h-10 rounded-sm bg-accent text-accent-foreground flex items-center justify-center shadow-[var(--shadow-elegant)] transition-all duration-300 hover:-translate-y-1 z-40 ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="回到顶部"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  )
}
