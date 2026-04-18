import { useEffect, useRef, useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useContactInfo } from '@/hooks/use-contact-info'
import { useCategories } from '@/hooks/use-categories'
import { useSite } from '@/contexts/site-context'
import { submitContactForm } from '@/services/contact-submissions'
import type { ContactFormInput } from '@/types/database'

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number | string }>> = {
  MapPin, Phone, Mail, Clock,
}

const DEFAULT_CONTACT = [
  { icon_name: 'MapPin', label: '公司地址', value: '上海市静安区南京西路1688号', sub: '星耀演出服大厦 3层' },
  { icon_name: 'Phone', label: '联系电话', value: '400-888-6688', sub: '周一至周日 9:00-21:00' },
  { icon_name: 'Mail', label: '电子邮箱', value: 'service@xingyao.com', sub: '24小时内回复' },
  { icon_name: 'Clock', label: '营业时间', value: '周一至周日', sub: '9:00 - 21:00（预约制）' },
]

export function Contact() {
  const { contactInfo } = useContactInfo()
  const { categories } = useCategories()
  const { footer } = useSite()
  const [visible, setVisible] = useState(false)
  const [formState, setFormState] = useState<ContactFormInput>({
    name: '', phone: '', costume_type: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const sectionRef = useRef<HTMLElement>(null)

  const displayContact = contactInfo.length > 0 ? contactInfo : DEFAULT_CONTACT
  const typeOptions = categories.length > 0
    ? categories.map(c => ({ value: c.slug, label: c.name }))
    : [
        { value: 'dance', label: '舞蹈演出服' },
        { value: 'choir', label: '合唱演出服' },
        { value: 'theater', label: '话剧演出服' },
        { value: 'ethnic', label: '民族演出服' },
        { value: 'host', label: '节目主持人服' },
        { value: 'other', label: '其他' },
      ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.name || !formState.phone) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await submitContactForm(formState)
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormState({ name: '', phone: '', costume_type: '', message: '' })
      }, 3000)
    } catch {
      setSubmitError('提交失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-20 md:py-28 bg-foreground text-primary-foreground"
    >
      <div className="container">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-accent text-xs tracking-[0.3em] font-light mb-3 uppercase">
            Contact Us
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-4">
            联系我们
          </h2>
          <div className="divider-gold w-20 mx-auto mb-6" />
          <p className="text-primary-foreground/60 text-sm md:text-base max-w-md mx-auto">
            期待与您共同打造闪耀舞台的演出服饰
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className={cn(
            'transition-all duration-1000',
            visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          )}>
            <div className="space-y-6">
              {displayContact.map((item, i) => {
                const Icon = iconMap[item.icon_name] || MapPin
                return (
                  <div
                    key={item.label}
                    className={cn(
                      'flex items-start gap-4 transition-all duration-700',
                      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    )}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-sm flex items-center justify-center bg-accent/10 border border-accent/20">
                      <Icon className="text-accent" size={18} />
                    </div>
                    <div>
                      <p className="text-primary-foreground/50 text-xs tracking-wider mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-primary-foreground text-sm md:text-base font-medium">
                        {item.value}
                      </p>
                      {item.sub && (
                        <p className="text-primary-foreground/40 text-xs mt-0.5">{item.sub}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 p-5 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10">
              <p className="text-accent text-xs tracking-wider mb-3">微信公众号</p>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded bg-primary-foreground/10 border border-primary-foreground/15 flex items-center justify-center overflow-hidden">
                  {footer.wechatQrUrl ? (
                    <img src={footer.wechatQrUrl} alt="微信二维码" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary-foreground/30 text-[10px] text-center leading-tight">
                      微信扫码<br />关注我们
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-primary-foreground/80 text-sm">搜索关注</p>
                  <p className="text-accent text-base font-serif mt-1">{footer.wechatName}</p>
                  <p className="text-primary-foreground/40 text-xs mt-2">{footer.wechatDesc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            'transition-all duration-1000 delay-200',
            visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          )}>
            <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-lg bg-primary-foreground/[0.04] border border-primary-foreground/10">
              <h3 className="font-serif text-xl mb-6 text-primary-foreground">预约咨询</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-primary-foreground/50 text-xs tracking-wider block mb-1.5">姓名 *</label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => setFormState(s => ({ ...s, name: e.target.value }))}
                    placeholder="请输入您的姓名"
                    className="w-full px-4 py-2.5 rounded-sm bg-primary-foreground/[0.06] border border-primary-foreground/10 text-primary-foreground text-sm placeholder:text-primary-foreground/30 focus:outline-none focus:border-accent/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-primary-foreground/50 text-xs tracking-wider block mb-1.5">手机号 *</label>
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState(s => ({ ...s, phone: e.target.value }))}
                    placeholder="请输入您的手机号码"
                    className="w-full px-4 py-2.5 rounded-sm bg-primary-foreground/[0.06] border border-primary-foreground/10 text-primary-foreground text-sm placeholder:text-primary-foreground/30 focus:outline-none focus:border-accent/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-primary-foreground/50 text-xs tracking-wider block mb-1.5">定制类型</label>
                  <select
                    value={formState.costume_type}
                    onChange={(e) => setFormState(s => ({ ...s, costume_type: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-sm bg-primary-foreground/[0.06] border border-primary-foreground/10 text-primary-foreground text-sm focus:outline-none focus:border-accent/50 transition-colors appearance-none"
                  >
                    <option value="" className="bg-foreground">请选择定制类型</option>
                    {typeOptions.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-foreground">{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-primary-foreground/50 text-xs tracking-wider block mb-1.5">留言</label>
                  <textarea
                    value={formState.message}
                    onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))}
                    placeholder="请描述您的定制需求"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-sm bg-primary-foreground/[0.06] border border-primary-foreground/10 text-primary-foreground text-sm placeholder:text-primary-foreground/30 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                  />
                </div>
              </div>

              {submitError && (
                <p className="text-destructive-foreground text-xs mt-3 bg-destructive/20 p-2 rounded">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={submitted || submitting}
                className="w-full mt-6 py-3 rounded-sm text-accent-foreground text-sm tracking-widest font-medium transition-all duration-300 hover:shadow-[var(--shadow-elegant)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{ background: 'var(--gradient-gold)' }}
              >
                {submitting ? '提交中...' : submitted ? '提交成功，我们会尽快联系您' : '提交预约'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
