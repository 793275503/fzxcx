import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSite } from '@/contexts/site-context'

export function Navbar() {
  const { brandName, brandSubtitle, navLinks } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-background/95 backdrop-blur-md shadow-[var(--shadow-nav)] border-b border-border/50'
            : 'bg-transparent'
        )}
      >
        <nav className="container flex items-center justify-between h-16 md:h-20">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleNavClick('#hero') }}
            className="flex items-center gap-2 group"
          >
            <span
              className={cn(
                'font-serif text-xl md:text-2xl font-bold tracking-wider transition-colors duration-300',
                scrolled ? 'text-foreground' : 'text-primary-foreground'
              )}
            >
              {brandName}
            </span>
            <span
              className={cn(
                'text-[10px] md:text-xs tracking-[0.2em] font-light transition-colors duration-300 hidden sm:block',
                scrolled ? 'text-muted-foreground' : 'text-primary-foreground/70'
              )}
            >
              {brandSubtitle}
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                  className={cn(
                    'text-sm tracking-widest font-light relative py-1 transition-colors duration-300',
                    'after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full',
                    scrolled
                      ? 'text-foreground/80 hover:text-foreground'
                      : 'text-primary-foreground/80 hover:text-primary-foreground'
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            className={cn(
              'md:hidden p-2 transition-colors duration-300',
              scrolled ? 'text-foreground' : 'text-primary-foreground'
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="菜单"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/98 backdrop-blur-lg transition-all duration-500 md:hidden flex flex-col items-center justify-center',
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        <ul className="flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <li
              key={link.href}
              style={{ transitionDelay: mobileOpen ? `${i * 80}ms` : '0ms' }}
              className={cn(
                'transition-all duration-500',
                mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              <a
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                className="font-serif text-2xl tracking-[0.15em] text-foreground/80 hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="divider-gold w-24 mt-10" />
      </div>
    </>
  )
}
