'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Menu, Globe, ChevronDown, User, LogOut, UserPlus, LogIn, Search, X, ArrowRight, ArrowLeft, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useI18n, type Lang } from '@/lib/i18n'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface NavItem {
  labelKey: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.home', href: '/#home' },
  { labelKey: 'nav.destinations', href: '/#destinations' },
  { labelKey: 'nav.experiences', href: '/#experiences' },
  { labelKey: 'nav.honeymoon', href: '/#honeymoon' },
  { labelKey: 'nav.contact', href: '/#contact' },
]

const LANGUAGES: { code: Lang; flag: string; label: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'ar', flag: '🇪🇬', label: 'العربية' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
]

/* ------------------------------------------------------------------ */
/*  Wave SVG Icon (brand mark)                                         */
/* ------------------------------------------------------------------ */

function WaveIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sun circle */}
      <circle cx="20" cy="12" r="5" fill="currentColor" opacity="0.9" />
      {/* Three wave lines */}
      <path
        d="M4 24c3-4 6 4 9 0s6 4 9 0 6 4 9 0 6 4 9 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M4 30c3-4 6 4 9 0s6 4 9 0 6 4 9 0 6 4 9 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Language Switcher                                                  */
/* ------------------------------------------------------------------ */

function LanguageSwitcher() {
  const { lang, setLang } = useI18n()
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground/80 transition-colors hover:bg-white/5 hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50"
          aria-label="Switch language"
        >
          <Globe className="size-3.5" />
          <span className="hidden sm:inline uppercase tracking-wider">{current.code}</span>
          <ChevronDown className="size-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-strong min-w-[160px]">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`cursor-pointer transition-colors ${lang === l.code
              ? 'text-cyan bg-cyan/10'
              : 'text-foreground/80 hover:text-cyan'
              }`}
          >
            <span className="mr-2 text-base">{l.flag}</span>
            {l.label}
            {lang === l.code && (
              <span className="ml-auto text-cyan text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ------------------------------------------------------------------ */
/*  Desktop Nav Link                                                   */
/* ------------------------------------------------------------------ */

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem
  active: boolean
  onClick: () => void
}) {
  const { t } = useI18n()

  return (
    <a
      href={item.href}
      onClick={onClick}
      className={`group relative px-1.5 xl:px-3 py-1 text-[13px] xl:text-sm font-medium tracking-wide transition-colors ${active
        ? 'text-cyan'
        : 'text-foreground/80 hover:text-cyan'
        }`}
    >
      {t(item.labelKey)}

      {/* Underline animation */}
      <span
        className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-cyan transition-all duration-300 ${active ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-70'
          }`}
      />
    </a>
  )
}

/* ------------------------------------------------------------------ */
/*  Mobile Menu Content                                                */
/* ------------------------------------------------------------------ */

function MobileMenuContent({
  activeSection,
  onNavClick,
}: {
  activeSection: string
  onNavClick: () => void
}) {
  const { t, lang, setLang } = useI18n()
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <div className="flex h-full flex-col px-6 pt-12 pb-8">
      {/* Logo */}
      <SheetHeader className="mb-10">
        <SheetTitle className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-14 w-14 md:h-16 md:w-16 rounded-md overflow-hidden shadow-lg border border-cyan/20">
            <Image src="/images/image.png" alt="Dahab Dream" fill className="object-cover" />
          </div>
          <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 backdrop-blur-md border border-white/20 shadow-lg">
            <span className="bg-gradient-to-r from-white via-cyan-300 to-white bg-clip-text text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-transparent drop-shadow-md">
              Dahab Dream Tour
            </span>
          </span>
        </SheetTitle>
      </SheetHeader>

      {/* Auth Info (Mobile) */}
      {isAuthenticated && (
        <div className="mb-8 flex items-center gap-3 rounded-xl bg-white/5 p-4 border border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan/20 text-cyan">
            <User className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">{user?.name}</span>
            <span className="text-xs text-foreground/50">{user?.email}</span>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.href
          return (
            <SheetClose key={item.href} asChild>
              <a
                href={item.href}
                onClick={onNavClick}
                className={`relative rounded-lg px-4 py-3 text-base font-medium transition-all ${isActive
                  ? 'bg-cyan/10 text-cyan'
                  : 'text-foreground/70 hover:bg-white/5 hover:text-cyan'
                  }`}
              >
                {t(item.labelKey)}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-cyan" />
                )}
              </a>
            </SheetClose>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="my-6 h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />

      {/* Auth Actions (Mobile) */}
      <div className="mb-6 flex flex-col gap-3">
        {isAuthenticated ? (
          <>
            <SheetClose asChild>
              <a href="/profile">
                <Button variant="ghost" className="w-full justify-start text-cyan hover:text-cyan hover:bg-cyan/5">
                  <User className="mr-3 size-5" />
                  {dir === 'rtl' ? 'الصفحة الشخصية' : 'Profile'}
                </Button>
              </a>
            </SheetClose>
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start text-foreground/70 hover:text-destructive hover:bg-destructive/5"
            >
              <LogOut className="mr-3 size-5" />
              {t('nav.logout')}
            </Button>
          </>
        ) : (
          <SheetClose asChild>
            <a href="/login">
              <Button variant="ghost" className="w-full justify-start text-foreground/70">
                <LogIn className="mr-3 size-5" />
                {t('nav.login')}
              </Button>
            </a>
          </SheetClose>
        )}
      </div>

      {/* Language & Theme switcher (mobile) */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">
            {t('nav.language')}
          </p>
          <div className="flex gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${lang === l.code
                  ? 'border-cyan/40 bg-cyan/10 text-cyan'
                  : 'border-transparent bg-white/5 text-foreground/60 hover:bg-white/10 hover:text-foreground'
                  }`}
              >
                <span>{l.flag}</span>
                {l.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        
        {/* Mobile Theme Toggle */}
        <div className="flex flex-col items-end">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">
            {isRTL ? 'المظهر' : 'Theme'}
          </p>
          <ThemeToggle />
        </div>
      </div>

      {/* CTA */}
      {!isAuthenticated && (
        <div className="mt-auto">
          <SheetClose asChild>
            <a href="#contact">
              <Button
                size="lg"
                className="cta-glow w-full rounded-lg border border-cyan/30 bg-cyan/10 text-cyan backdrop-blur-sm transition-all hover:bg-cyan/20 hover:border-cyan/50"
              >
                {t('nav.planTrip')}
              </Button>
            </a>
          </SheetClose>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Theme Switcher                                                     */
/* ------------------------------------------------------------------ */

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full bg-white/5" />
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-foreground/80 hover:bg-white/10 hover:text-cyan transition-all"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Navbar                                                        */
/* ------------------------------------------------------------------ */

export default function Navbar() {
  const { t, lang, dir } = useI18n()
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('#home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  
  const observerRef = useRef<IntersectionObserver | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?location=${encodeURIComponent(searchQuery.trim())}`)
      setShowMobileSearch(false)
      setMobileOpen(false)
      setSearchQuery('')
    }
  }

  // Focus search input when mobile search is opened
  useEffect(() => {
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showMobileSearch])

  /* ---- Scroll listener for glass effect ---- */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ---- IntersectionObserver for active section tracking ---- */
  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Find the most visible section
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

      if (visible.length > 0) {
        const id = visible[0].target.id
        if (id) {
          setActiveSection(`#${id}`)
        }
      }
    }

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    })

    // Observe sections after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      NAV_ITEMS.forEach((item) => {
        // Strip leading slash if present to make it a valid selector for querySelector
        const selector = item.href.startsWith('/') ? item.href.slice(1) : item.href
        const el = document.querySelector(selector)
        if (el) {
          observerRef.current?.observe(el)
        }
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      observerRef.current?.disconnect()
    }
  }, [])

  /* ---- Close mobile menu on nav click ---- */
  const handleNavClick = useCallback(() => {
    setMobileOpen(false)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 keep-dark"
      >
        {/* Subtle gradient line at bottom of navbar */}
        <div className="absolute bottom-0 left-0 right-0 h-px opacity-100">
          <div className="h-full bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
        </div>

        <nav className="w-full flex h-14 lg:h-16 items-center justify-between px-4 md:px-8 lg:px-12 transition-all duration-500 glass-strong shadow-lg shadow-black/20">
          <div className="flex items-center gap-6 lg:gap-10">
            {/* ---- LEFT: Logo ---- */}
            <a href="/" className="group flex items-center justify-center gap-2 no-underline shrink-0">
              <div className="relative flex h-8 w-8 md:h-10 md:w-10 rounded-md overflow-hidden shadow-lg shadow-black/20 border border-cyan/20 transition-transform duration-300 group-hover:scale-105">
                <Image src="/images/image.png" alt="Dahab Dream Tour" fill className="object-cover" priority />
              </div>
              <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-2.5 py-0.5 md:px-3 md:py-1 backdrop-blur-md border border-white/20 shadow-sm transition-all duration-300 group-hover:bg-white/15">
                <span className="bg-gradient-to-r from-white via-[#00D4FF] to-white bg-clip-text text-[9px] md:text-[10px] font-bold uppercase tracking-[0.05em] md:tracking-[0.15em] text-transparent drop-shadow-sm max-w-[100px] sm:max-w-none line-clamp-1 sm:line-clamp-none">
                  {t('brand.name')}
                </span>
              </span>
            </a>

            {/* ---- CENTER: Desktop Nav Links ---- */}
            <div className="hidden items-center gap-0.5 xl:gap-3 md:flex min-w-0">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={activeSection === item.href}
                  onClick={handleNavClick}
                />
              ))}
            </div>
          </div>

          {/* ---- RIGHT: Language + CTA + Mobile trigger ---- */}
          <div className="flex items-center gap-1 lg:gap-2 xl:gap-4 min-w-0 justify-end flex-1">
            <form 
              onSubmit={handleSearch}
              className="relative hidden lg:flex items-center group flex-1 max-w-[180px] xl:max-w-[350px] transition-all duration-300 focus-within:max-w-[280px] xl:focus-within:max-w-[450px]"
            >
              <div className="absolute inset-0 bg-cyan/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <input
                type="text"
                placeholder={t('nav.search') + '...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative w-full h-8 xl:h-9 px-3 xl:px-4 pl-8 xl:pl-9 rounded-xl bg-white/5 border border-white/10 text-[10px] xl:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/40 focus:ring-1 focus:ring-cyan/40 transition-all shadow-lg shadow-black/5"
              />
              <Search className="absolute left-2.5 xl:left-3 h-3 xl:h-3.5 w-3 xl:w-3.5 text-white/40 group-focus-within:text-cyan transition-colors" />
            </form>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/70 hover:bg-white/5 hover:text-cyan transition-all lg:hidden"
              aria-label="Open search"
            >
              <Search className="size-5" />
            </button>

            {/* Language switcher (desktop) */}
            <div className="hidden sm:flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>

            {/* Auth Buttons (Desktop) */}
            <div className="hidden items-center gap-3 md:flex">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center w-9 xl:w-10 h-9 xl:h-10 rounded-full bg-cyan/10 border border-cyan/20 text-cyan hover:bg-cyan/20 transition-all focus:outline-none shadow-[0_0_15px_rgba(0,212,255,0.15)] hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                      <User className="size-4 xl:size-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-strong min-w-[220px] p-2 mt-2 border-white/10 shadow-2xl">
                    <div className="px-3 py-2.5 mb-2 border-b border-white/10 bg-white/5 rounded-lg">
                      <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/5 focus:bg-white/5 transition-colors text-white py-2.5 px-3 rounded-md">
                      <a href="/profile" className="flex items-center w-full">
                        <User className="mr-2.5 size-4 text-cyan" />
                        <span className="font-medium text-sm">{dir === 'rtl' ? 'الصفحة الشخصية' : 'Profile'}</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400 hover:text-red-400 hover:bg-red-400/10 focus:bg-red-400/10 focus:text-red-400 transition-colors mt-1 py-2.5 px-3 rounded-md">
                      <LogOut className="mr-2.5 size-4" />
                      <span className="font-medium text-sm">{dir === 'rtl' ? 'تسجيل خروج' : 'Logout'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  asChild
                  className="text-foreground/70 hover:text-cyan hover:bg-white/5"
                >
                  <a href="/login">
                    <LogIn className="mr-2 size-4" />
                    {t('nav.login')}
                  </a>
                </Button>
              )}
            </div>

            {/* CTA button (desktop) */}
            <Button
              asChild
              className="cta-glow hidden lg:inline-flex rounded-full bg-cyan px-3 xl:px-6 py-1.5 xl:py-2 text-[10px] xl:text-xs font-black uppercase tracking-widest text-navy transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] active:scale-95 shrink-0"
            >
              <a href="#contact">
                {t('nav.planTrip')}
              </a>
            </Button>

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-foreground/80 hover:bg-white/5 hover:text-cyan"
                    aria-label="Open menu"
                  >
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side={dir === 'rtl' ? 'left' : 'right'}
                  className={`w-[320px] bg-navy/95 p-0 backdrop-blur-xl sm:w-[360px] ${
                    dir === 'rtl' ? 'border-r' : 'border-l'
                  } border-cyan/10`}
                >
                  <MobileMenuContent
                    activeSection={activeSection}
                    onNavClick={handleNavClick}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Spacer to prevent content from going under the fixed navbar */}
      <div className="h-14 lg:h-16" />
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[60] bg-navy/95 backdrop-blur-2xl p-6 md:p-12 overflow-y-auto"
          >
            <div className="mx-auto max-w-4xl flex flex-col gap-10 md:gap-16 pt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest">{t('nav.search')}</h2>
                <button 
                  onClick={() => setShowMobileSearch(false)}
                  className="h-12 w-12 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                >
                  <X className="size-8" />
                </button>
              </div>

              <form onSubmit={handleSearch} className="relative group">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t('search.title') + '...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-20 bg-transparent border-b-2 border-white/10 text-3xl md:text-5xl font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-cyan transition-all duration-500"
                />
                <button 
                  type="submit"
                  className={`absolute ${dir === 'rtl' ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 h-14 w-14 flex items-center justify-center rounded-full bg-cyan text-navy shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:scale-110 active:scale-95 transition-all`}
                >
                  {dir === 'rtl' ? <ArrowLeft className="size-7" /> : <ArrowRight className="size-7" />}
                </button>
              </form>

              <div className="flex flex-col gap-6">
                <span className="text-xs font-black text-cyan uppercase tracking-[0.3em] opacity-60">
                  {t('search.popular')}
                </span>
                <div className="flex flex-wrap gap-3">
                  {['Dahab', 'Sharm El Sheikh', 'Hurghada', 'Luxor', 'Cairo', 'Aswan'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term)
                        router.push(`/search?location=${encodeURIComponent(term)}`)
                        setShowMobileSearch(false)
                        setSearchQuery('')
                      }}
                      className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm md:text-base font-bold text-white/70 hover:bg-cyan/10 hover:border-cyan/30 hover:text-cyan hover:-translate-y-1 transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
