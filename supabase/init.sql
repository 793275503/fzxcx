-- 星耀演出服 - Supabase 数据库初始化脚本
-- 在 Supabase SQL Editor 中运行此脚本

-- ========================================
-- 1. 创建表
-- ========================================

-- 网站配置
CREATE TABLE IF NOT EXISTS site_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '""',
  config_group text NOT NULL DEFAULT 'general',
  updated_at timestamptz DEFAULT now()
);

-- 导航链接
CREATE TABLE IF NOT EXISTS nav_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  href text NOT NULL,
  sort_order int DEFAULT 0,
  is_active bool DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- 演出服分类
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  sort_order int DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 案例展示
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  sort_order int DEFAULT 0,
  is_featured bool DEFAULT false,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Hero 首屏内容
CREATE TABLE IF NOT EXISTS hero_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tagline text NOT NULL DEFAULT 'Performance Costume Since 2008',
  headline_zh text NOT NULL DEFAULT '匠心定制\n耀动舞台',
  headline_en text DEFAULT '',
  subheadline text NOT NULL DEFAULT '为舞台而生，为角色而制',
  cta_primary_text text DEFAULT '探索案例',
  cta_primary_href text DEFAULT '#gallery',
  cta_secondary_text text DEFAULT '预约咨询',
  cta_secondary_href text DEFAULT '#contact',
  background_url text NOT NULL DEFAULT '/images/hero-banner.png',
  is_active bool DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- 关于我们
CREATE TABLE IF NOT EXISTS about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_title text NOT NULL DEFAULT '关于星耀演出服',
  subtitle_en text DEFAULT 'About Us',
  description jsonb NOT NULL DEFAULT '[]',
  image_url text NOT NULL DEFAULT '/images/about-atelier.png',
  stats jsonb NOT NULL DEFAULT '[]',
  is_active bool DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- 联系方式
CREATE TABLE IF NOT EXISTS contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name text NOT NULL DEFAULT 'Phone',
  label text NOT NULL,
  value text NOT NULL,
  sub text DEFAULT '',
  sort_order int DEFAULT 0,
  is_active bool DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- 页脚内容
CREATE TABLE IF NOT EXISTS footer_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  copyright_text text NOT NULL DEFAULT '',
  icp_number text DEFAULT '',
  wechat_name text DEFAULT '星耀演出服',
  wechat_qr_url text DEFAULT '',
  wechat_description text DEFAULT '获取最新演出服饰定制资讯与优惠活动',
  is_active bool DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- 预约提交
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  costume_type text DEFAULT '',
  message text DEFAULT '',
  status text DEFAULT 'new' CHECK (status IN ('new','read','replied','archived')),
  created_at timestamptz DEFAULT now(),
  read_at timestamptz,
  notes text
);

-- ========================================
-- 2. RLS 策略
-- ========================================

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 公开只读策略
CREATE POLICY "Public read site_config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Public read nav_links" ON nav_links FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read gallery_items" ON gallery_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public read hero_content" ON hero_content FOR SELECT USING (is_active = true);
CREATE POLICY "Public read about_content" ON about_content FOR SELECT USING (is_active = true);
CREATE POLICY "Public read contact_info" ON contact_info FOR SELECT USING (is_active = true);
CREATE POLICY "Public read footer_content" ON footer_content FOR SELECT USING (is_active = true);

-- 预约表单公开插入
CREATE POLICY "Public insert submissions" ON contact_submissions FOR INSERT WITH CHECK (true);

-- 管理员全权限（需要登录）
CREATE POLICY "Admin all site_config" ON site_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all nav_links" ON nav_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all gallery_items" ON gallery_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all hero_content" ON hero_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all about_content" ON about_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all contact_info" ON contact_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all footer_content" ON footer_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all submissions" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');

-- ========================================
-- 3. 初始数据
-- ========================================

INSERT INTO site_config (key, value, config_group) VALUES
  ('brand_name', '"星耀演出服"', 'brand'),
  ('brand_subtitle', '"PERFORMANCE COSTUME"', 'brand'),
  ('brand_tagline', '"匠心定制，耀动舞台"', 'brand'),
  ('seo_title', '"星耀演出服 | 演出服装定制专家"', 'seo'),
  ('seo_description', '"专业演出服装定制，舞蹈演出服、合唱演出服、话剧演出服、民族演出服，为舞台而生。"', 'seo');

INSERT INTO nav_links (label, href, sort_order) VALUES
  ('首页', '#hero', 1),
  ('演出案例', '#gallery', 2),
  ('关于我们', '#about', 3),
  ('联系方式', '#contact', 4);

INSERT INTO categories (name, slug, sort_order) VALUES
  ('舞蹈演出服', 'dance', 1),
  ('合唱演出服', 'choir', 2),
  ('话剧演出服', 'theater', 3),
  ('民族演出服', 'ethnic', 4),
  ('节目主持人服', 'host', 5),
  ('交响乐团演出服', 'orchestra', 6);

INSERT INTO hero_content (tagline, headline_zh, subheadline, background_url) VALUES
  ('Performance Costume Since 2008', '匠心定制\n耀动舞台', '为舞台而生，为角色而制', '/images/hero-banner.png');

INSERT INTO about_content (section_title, subtitle_en, description, image_url, stats) VALUES (
  '关于星耀演出服',
  'About Us',
  '["星耀演出服创立于2008年，是一家专注于演出服装定制的品牌工坊。我们秉承"为舞台而生"的理念，将传统手工技艺与舞台艺术需求完美融合。", "从面料甄选到版型设计，从试穿调整到最终交付，每一个环节都由资深裁缝师亲自把控。我们与国内外顶级面料商建立了长期合作关系，确保每一套演出服都拥有最上乘的材质基础。", "无论是舞蹈演出、合唱表演，还是话剧舞台与民族风展示，星耀都以极致的工艺标准，为演出者打造闪耀舞台的专属服饰。"]'::jsonb,
  '/images/about-atelier.png',
  '[{"icon":"Clock","value":16,"suffix":"+","label":"年舞台服饰经验"},{"icon":"Users","value":8000,"suffix":"+","label":"演出团体合作"},{"icon":"Scissors","value":50,"suffix":"+","label":"资深裁缝师"},{"icon":"Award","value":98,"suffix":"%","label":"客户满意度"}]'::jsonb
);

INSERT INTO contact_info (icon_name, label, value, sub, sort_order) VALUES
  ('MapPin', '公司地址', '上海市静安区南京西路1688号', '星耀演出服大厦 3层', 1),
  ('Phone', '联系电话', '400-888-6688', '周一至周日 9:00-21:00', 2),
  ('Mail', '电子邮箱', 'service@xingyao.com', '24小时内回复', 3),
  ('Clock', '营业时间', '周一至周日', '9:00 - 21:00（预约制）', 4);

INSERT INTO footer_content (copyright_text, icp_number, wechat_name, wechat_description) VALUES
  '© 2008-2026 星耀演出服 版权所有', '', '星耀演出服', '获取最新演出服饰定制资讯与优惠活动');

-- ========================================
-- 4. 创建 Storage 存储桶
-- ========================================
-- 在 Supabase Dashboard → Storage 中手动创建以下存储桶：
-- gallery (公开)
-- hero (公开)
-- about (公开)
-- misc (公开)
