import { useEffect, useRef, useState } from 'react'
import { Award, Scissors, Clock, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAbout } from '@/hooks/use-about'

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number | string }>> = {
  Clock, Users, Scissors, Award,
}

export function About() {
  const { about, isLoading } = useAbout()
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-20 md:py-28"
      style={{ background: 'var(--gradient-section)' }}
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div
            className={cn(
              'transition-all duration-1000',
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            )}
          >
            <div className="relative">
              <img
                src={about.image_url}
                alt={about.section_title}
                className="rounded-lg shadow-[var(--shadow-card-hover)] w-full object-cover aspect-[4/3]"
                loading="lazy"
              />
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-accent/30 rounded-lg -z-10 hidden md:block" />
            </div>
          </div>

          <div
            className={cn(
              'transition-all duration-1000 delay-200',
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            )}
          >
            <p className="text-accent text-xs tracking-[0.3em] font-light mb-3 uppercase">
              {about.subtitle_en}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
              {about.section_title}
            </h2>
            <div className="divider-gold w-16 mb-6" />

            {isLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="h-4 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed">
                {about.description.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-8 md:mt-10">
              {about.stats.map((stat, i) => {
                const Icon = iconMap[stat.icon] || Award
                return (
                  <div
                    key={stat.label}
                    className={cn(
                      'p-4 rounded-lg bg-card border border-border/50 transition-all duration-700',
                      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    )}
                    style={{ transitionDelay: `${400 + i * 100}ms` }}
                  >
                    <Icon className="text-accent mb-2" size={20} />
                    <div className="font-serif text-2xl md:text-3xl text-foreground">
                      {stat.value}
                      <span className="text-accent text-lg">{stat.suffix}</span>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
