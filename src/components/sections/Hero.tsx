import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { useHero } from '@/hooks/use-hero'

export function Hero() {
  const { hero, isLoading } = useHero()
  const [loaded, setLoaded] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleScrollDown = () => {
    document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' })
  }

  const headlineLines = hero.headline_zh.split('\n')

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {!isLoading && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
          style={{ backgroundImage: `url('${hero.background_url}')` }}
        />
      )}
      <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />

      <div className="absolute top-1/4 right-[8%] w-px h-32 bg-accent/20 hidden lg:block" />
      <div className="absolute bottom-1/4 left-[8%] w-px h-24 bg-accent/20 hidden lg:block" />

      <div className="relative z-10 container text-center">
        <div
          className={`transition-all duration-1000 ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-accent/90 text-xs sm:text-sm tracking-[0.35em] font-light mb-4 sm:mb-6 uppercase">
            {hero.tagline}
          </p>
        </div>

        <h1
          className={`font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight mb-6 sm:mb-8 transition-all duration-1000 delay-200 ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {headlineLines.map((line, i) => (
            <span key={i}>
              {i === headlineLines.length - 1 ? (
                <span className="text-gradient">{line}</span>
              ) : (
                line
              )}
              {i < headlineLines.length - 1 && <br />}
            </span>
          ))}
        </h1>

        <p
          className={`text-primary-foreground/70 text-sm sm:text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-8 sm:mb-10 transition-all duration-1000 delay-400 ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {hero.subheadline.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < hero.subheadline.split('\n').length - 1 && <br className="hidden sm:block" />}
            </span>
          ))}
        </p>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-500 ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <a
            href={hero.cta_primary_href}
            onClick={(e) => { e.preventDefault(); document.querySelector(hero.cta_primary_href)?.scrollIntoView({ behavior: 'smooth' }) }}
            className="px-8 py-3 text-accent-foreground text-sm tracking-widest font-medium rounded-sm hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: 'var(--gradient-gold)' }}
          >
            {hero.cta_primary_text}
          </a>
          <a
            href={hero.cta_secondary_href}
            onClick={(e) => { e.preventDefault(); document.querySelector(hero.cta_secondary_href)?.scrollIntoView({ behavior: 'smooth' }) }}
            className="px-8 py-3 border border-primary-foreground/30 text-primary-foreground text-sm tracking-widest font-light rounded-sm hover:bg-primary-foreground/10 transition-all duration-300"
          >
            {hero.cta_secondary_text}
          </a>
        </div>
      </div>

      <button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors animate-bounce"
        aria-label="向下滚动"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown size={18} />
      </button>
    </section>
  )
}
