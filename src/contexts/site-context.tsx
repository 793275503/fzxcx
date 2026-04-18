import { createContext, useContext, type ReactNode } from 'react'
import { useSiteConfig } from '@/hooks/use-site-config'
import { useNavLinks } from '@/hooks/use-nav-links'
import { useFooter } from '@/hooks/use-footer'
import { useContactInfo } from '@/hooks/use-contact-info'

interface SiteContextValue {
  brandName: string
  brandSubtitle: string
  brandTagline: string
  navLinks: { label: string; href: string }[]
  contactInfo: { label: string; value: string; sub: string }[]
  footer: {
    copyright: string
    icp: string
    wechatName: string
    wechatQrUrl: string
    wechatDesc: string
  }
}

const defaultContext: SiteContextValue = {
  brandName: '星耀演出服',
  brandSubtitle: 'PERFORMANCE COSTUME',
  brandTagline: '匠心定制，耀动舞台',
  navLinks: [
    { label: '首页', href: '#hero' },
    { label: '演出案例', href: '#gallery' },
    { label: '关于我们', href: '#about' },
    { label: '联系方式', href: '#contact' },
  ],
  contactInfo: [
    { label: '公司地址', value: '上海市静安区南京西路1688号', sub: '星耀演出服大厦 3层' },
    { label: '联系电话', value: '400-888-6688', sub: '周一至周日 9:00-21:00' },
    { label: '电子邮箱', value: 'service@xingyao.com', sub: '24小时内回复' },
    { label: '营业时间', value: '周一至周日', sub: '9:00 - 21:00（预约制）' },
  ],
  footer: {
    copyright: `© 2008-${new Date().getFullYear()} 星耀演出服 版权所有`,
    icp: '',
    wechatName: '星耀演出服',
    wechatQrUrl: '',
    wechatDesc: '获取最新演出服饰定制资讯与优惠活动',
  },
}

const SiteContext = createContext<SiteContextValue>(defaultContext)

export function SiteProvider({ children }: { children: ReactNode }) {
  const { getValue } = useSiteConfig()
  const { navLinks } = useNavLinks()
  const { contactInfo } = useContactInfo()
  const { footer } = useFooter()

  const value: SiteContextValue = {
    brandName: getValue('brand_name') || defaultContext.brandName,
    brandSubtitle: getValue('brand_subtitle') || defaultContext.brandSubtitle,
    brandTagline: getValue('brand_tagline') || defaultContext.brandTagline,
    navLinks: navLinks.length > 0
      ? navLinks.map(n => ({ label: n.label, href: n.href }))
      : defaultContext.navLinks,
    contactInfo: contactInfo.length > 0
      ? contactInfo.map(c => ({ label: c.label, value: c.value, sub: c.sub }))
      : defaultContext.contactInfo,
    footer: {
      copyright: footer.copyright_text || defaultContext.footer.copyright,
      icp: footer.icp_number || defaultContext.footer.icp,
      wechatName: footer.wechat_name || defaultContext.footer.wechatName,
      wechatQrUrl: footer.wechat_qr_url || defaultContext.footer.wechatQrUrl,
      wechatDesc: footer.wechat_description || defaultContext.footer.wechatDesc,
    },
  }

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  return useContext(SiteContext)
}
