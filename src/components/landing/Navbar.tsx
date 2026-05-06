'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Menu, Globe, ChevronDown } from 'lucide-react'
import { useI18n, type Lang } from '@/lib/i18n'
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
  { labelKey: 'nav.home', href: '#home' },
  { labelKey: 'nav.destinations', href: '#destinations' },
  { labelKey: 'nav.experiences', href: '#experiences' },
  { labelKey: 'nav.honeymoon', href: '#honeymoon' },
  { labelKey: 'nav.contact', href: '#contact' },
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
          className="flex items-center gap-2 rounded-md px-3 py-2 lg:px-4 lg:py-3 text-base lg:text-lg font-semibold text-foreground/80 transition-colors hover:bg-white/5 hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50"
          aria-label="Switch language"
        >
          <Globe className="size-5 lg:size-6" />
          <span className="hidden sm:inline">{current.flag} {current.code.toUpperCase()}</span>
          <ChevronDown className="size-4 lg:size-5 opacity-60" />
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
      className={`group relative px-2 lg:px-3 py-2 text-[15px] lg:text-lg font-semibold tracking-wide transition-colors ${active
        ? 'text-cyan'
        : 'text-foreground/70 hover:text-cyan'
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

      {/* Language switcher (mobile) */}
      <div className="mb-6">
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

      {/* CTA */}
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
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Navbar                                                        */
/* ------------------------------------------------------------------ */

export default function Navbar() {
  const { t, lang, dir } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('#home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

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
        const el = document.querySelector(item.href)
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
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Subtle gradient line at bottom of navbar */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div className="h-full bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
        </div>

        <nav
          className={`w-full flex h-16 lg:h-20 items-center justify-between px-6 md:px-12 lg:px-16 transition-all duration-500 ${scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'glass'
            }`}
        >
          {/* ---- LEFT: Logo ---- */}
          <a href="#home" className="group flex items-center justify-center gap-3 no-underline">
            <div className="relative flex h-10 w-10 md:h-12 md:w-12 lg:h-[3.25rem] lg:w-[3.25rem] rounded-md overflow-hidden shadow-lg shadow-black/20 border border-cyan/20 transition-transform duration-300 group-hover:scale-105">
              <Image src="/images/image.png" alt="Dahab Dream Tour" fill className="object-cover" priority />
            </div>
            <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-1 lg:px-4 lg:py-1.5 backdrop-blur-md border border-white/20 shadow-sm transition-all duration-300 group-hover:bg-white/15">
              <span className="bg-gradient-to-r from-white via-[#00D4FF] to-white bg-clip-text text-[9px] md:text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.15em] lg:tracking-[0.2em] text-transparent drop-shadow-sm">
                {t('brand.name')}
              </span>
            </span>
          </a>

          {/* ---- CENTER: Desktop Nav Links ---- */}
          <div className="hidden items-center gap-4 lg:gap-10 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={activeSection === item.href}
                onClick={handleNavClick}
              />
            ))}
          </div>

          {/* ---- RIGHT: Language + CTA + Mobile trigger ---- */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Language switcher (desktop) */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* CTA button (desktop) */}
            <Button
              asChild
              size="lg"
              className="cta-glow hidden rounded-xl border border-cyan/30 bg-cyan/10 px-5 py-5 lg:px-6 lg:py-5 lg:text-base font-bold tracking-wide text-cyan backdrop-blur-sm transition-all hover:bg-cyan/20 hover:border-cyan/50 md:inline-flex"
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
      <div className="h-16 lg:h-20" />
    </>
  )
}
