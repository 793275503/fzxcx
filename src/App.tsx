import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SiteProvider } from '@/contexts/site-context'

import { Navbar } from '@/components/sections/Navbar'
import { Hero } from '@/components/sections/Hero'
import { Gallery } from '@/components/sections/Gallery'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'

import { AdminLayout } from '@/pages/admin/admin-layout'
import { AdminLogin } from '@/pages/admin/admin-login'
import { AdminDashboard } from '@/pages/admin/admin-dashboard'
import { GalleryManager } from '@/pages/admin/gallery-manager'
import { GalleryItemEditor } from '@/pages/admin/gallery-item-editor'
import { CategoryManager } from '@/pages/admin/category-manager'
import { HeroEditor } from '@/pages/admin/hero-editor'
import { AboutEditor } from '@/pages/admin/about-editor'
import { ContactInfoManager } from '@/pages/admin/contact-info-manager'
import { NavLinkManager } from '@/pages/admin/nav-link-manager'
import { FooterEditor } from '@/pages/admin/footer-editor'
import { SubmissionManager } from '@/pages/admin/submission-manager'
import { SiteConfigEditor } from '@/pages/admin/site-config-editor'

import { AdminGuard } from '@/guards/admin-guard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

function PublicSite() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main>
        <Hero />
        <Gallery />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SiteProvider>
        <BrowserRouter>
          <Routes>
            {/* Public site */}
            <Route path="/" element={<PublicSite />} />

            {/* Admin - login (no guard) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin - guarded routes */}
            <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="gallery/new" element={<GalleryItemEditor />} />
              <Route path="gallery/:id" element={<GalleryItemEditor />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="hero" element={<HeroEditor />} />
              <Route path="about" element={<AboutEditor />} />
              <Route path="contact-info" element={<ContactInfoManager />} />
              <Route path="nav-links" element={<NavLinkManager />} />
              <Route path="footer" element={<FooterEditor />} />
              <Route path="submissions" element={<SubmissionManager />} />
              <Route path="site-config" element={<SiteConfigEditor />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SiteProvider>
    </QueryClientProvider>
  )
}

export default App
