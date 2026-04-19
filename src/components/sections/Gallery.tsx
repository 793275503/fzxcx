import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useGallery } from '@/hooks/use-gallery'
import { useCategories } from '@/hooks/use-categories'

const DEFAULT_ITEMS = [
  { id: '1', title: '舞蹈演出系列', category_name: '舞蹈演出服', category_slug: 'dance', description: '飘逸面料与精致绣工，为舞者打造自由灵动的舞台形象', image_url: '/images/case-dance.png' },
  { id: '2', title: '合唱演出系列', category_name: '合唱演出服', category_slug: 'choir', description: '统一和谐的设计语言，让合唱团在舞台上展现庄重与优雅', image_url: '/images/case-choir.png' },
  { id: '3', title: '话剧演出系列', category_name: '话剧演出服', category_slug: 'theater', description: '精准还原角色形象，以服饰赋能戏剧表达', image_url: '/images/case-theater.png' },
  { id: '4', title: '民族演出系列', category_name: '民族演出服', category_slug: 'ethnic', description: '传统工艺与现代舞台审美融合，展现民族文化之美', image_url: '/images/case-ethnic.png' },
  { id: '5', title: '主持人服系列', category_name: '节目主持人服', category_slug: 'host', description: '端庄大气与个性风格兼具，为镜头前的您量身定制', image_url: '/images/case-host.png' },
]

const DEFAULT_CATEGORIES = ['全部', '舞蹈演出服', '合唱演出服', '话剧演出服', '民族演出服', '节目主持人服']

export function Gallery() {
  const { items, isLoading: galleryLoading } = useGallery()
  const { categories } = useCategories()
  const [activeCategory, setActiveCategory] = useState('全部')
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())

  const displayItems = items.length > 0
    ? items.map(item => ({
        id: item.id,
        title: item.title,
        category_name: item.categories?.name || '',
        category_slug: item.categories?.slug || '',
        description: item.description,
        image_url: item.image_url,
      }))
    : DEFAULT_ITEMS

  const categoryNames = categories.length > 0
    ? ['全部', ...categories.map(c => c.name)]
    : DEFAULT_CATEGORIES

  const filteredItems = activeCategory === '全部'
    ? displayItems
    : displayItems.filter(item => item.category_name === activeCategory)

  // 切换分类时用延迟动画逐个显示
  useEffect(() => {
    setVisibleItems(new Set())
    const timers = filteredItems.map((item, index) =>
      setTimeout(() => {
        setVisibleItems(prev => new Set(prev).add(item.id))
      }, 80 * index)
    )
    return () => timers.forEach(clearTimeout)
  }, [filteredItems])

  return (
    <section id="gallery" className="py-20 md:py-28">
      <div className="container">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-accent text-xs tracking-[0.3em] font-light mb-3 uppercase">
            Our Portfolio
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            演出案例
          </h2>
          <div className="divider-gold w-20 mx-auto mb-6" />
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            每一套演出服，都是匠心与角色的对话
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-14">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm tracking-wider rounded-sm transition-all duration-300',
                activeCategory === cat
                  ? 'bg-foreground text-primary-foreground shadow-[var(--shadow-card)]'
                  : 'bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {galleryLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="aspect-[3/4] rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                data-id={item.id}
                className={cn(
                  'group cursor-pointer transition-all duration-700',
                  visibleItems.has(item.id)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8',
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="img-overlay rounded-lg overflow-hidden aspect-[3/4]">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="inline-block text-[10px] tracking-[0.2em] text-accent/80 uppercase mb-1.5">
                      {item.category_name}
                    </span>
                    <h3 className="font-serif text-lg md:text-xl text-primary-foreground mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-primary-foreground/60 text-xs md:text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
