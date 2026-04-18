export interface SiteConfig {
  id: string
  key: string
  value: string | number | Record<string, unknown> | unknown[]
  config_group: string
  updated_at: string
}

export interface NavLink {
  id: string
  label: string
  href: string
  sort_order: number
  is_active: boolean
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  title: string
  category_id: string
  description: string
  image_url: string
  sort_order: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  categories?: Category
}

export interface HeroContent {
  id: string
  tagline: string
  headline_zh: string
  headline_en: string
  subheadline: string
  cta_primary_text: string
  cta_primary_href: string
  cta_secondary_text: string
  cta_secondary_href: string
  background_url: string
  is_active: boolean
  updated_at: string
}

export interface AboutStat {
  icon: string
  value: number
  suffix: string
  label: string
}

export interface AboutContent {
  id: string
  section_title: string
  subtitle_en: string
  description: string[]
  image_url: string
  stats: AboutStat[]
  is_active: boolean
  updated_at: string
}

export interface ContactInfoItem {
  id: string
  icon_name: string
  label: string
  value: string
  sub: string
  sort_order: number
  is_active: boolean
  updated_at: string
}

export interface FooterContent {
  id: string
  copyright_text: string
  icp_number: string
  wechat_name: string
  wechat_qr_url: string
  wechat_description: string
  is_active: boolean
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  phone: string
  costume_type: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
  read_at: string | null
  notes: string | null
}

// Form types
export interface ContactFormInput {
  name: string
  phone: string
  costume_type: string
  message: string
}

export interface GalleryItemInput {
  id?: string
  title: string
  category_id: string
  description: string
  image_url: string
  sort_order: number
  is_featured: boolean
  is_active: boolean
}

export interface CategoryInput {
  id?: string
  name: string
  slug: string
  sort_order: number
  is_active: boolean
}
