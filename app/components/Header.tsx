'use client'

import { useState, useEffect, useRef } from 'react'
import NProgress from 'nprogress'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, LogOut, Menu, UserIcon, X } from 'lucide-react'
import { useLenis } from 'lenis/react'
import LogoKM from "@/public/assets/img/kampus-merdeka.png"
import LogoKM2 from "@/public/assets/img/kampus-merdeka-2.png"
import LogoUNG from "@/public/assets/img/ung.png"
import LogoKemen from "@/public/assets/img/kemendikbud.png"
import Modal from './Modal'

const navLinksData = {
  landing: [
    { name: 'Beranda', href: '/' },
    { name: 'Blog', href: '/#blog' },
    { name: 'Tentang Kami', href: '/#tentang-kami' },
  ],
  dashboard: [
    { name: 'Dashboard', href: '/dashboard', roles: ['user', 'superadmin'] },
    { name: 'Blog Saya', href: '/dashboard/mypost', roles: ['user', 'superadmin'] },
    { name: 'Pengaturan', href: '/dashboard/web-setting', roles: ['superadmin'] },
    { name: 'Kelola User', href: '/dashboard/user', roles: ['superadmin'] },
  ]
}

export default function Header({ generalSetting, session }: { generalSetting: any, session: any | null }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMenuClosing, setIsMenuClosing] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [displayLogo, setDisplayLogo] = useState(false)
  const [isModalConfirmLogoutOpen, setIsModalConfirmLogoutOpen] = useState(false)
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)

  const isInitialMount = useRef(true)
  const hasScrolledToHash = useRef(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()
  const pathname = usePathname()
  const router = useRouter()
  const isHomepage = pathname === '/'
  const isDashboard = pathname.startsWith("/dashboard") && session
  const navLinks = isDashboard ? navLinksData.dashboard.filter(_ => _.roles.find(_ => _ == (session?.profile.role || "user"))) : navLinksData.landing

  useEffect(() => {
    if (!isHomepage || hasScrolledToHash.current || !lenis) return

    const hash = window.location.hash
    if (!hash || hash === '#/' || hash === '#') return

    const targetId = hash.substring(1)

    const attemptScroll = () => {
      const element = document.getElementById(targetId)
      if (element && !hasScrolledToHash.current) {
        hasScrolledToHash.current = true
        lenis.scrollTo(element, { offset: -80, duration: 1 })
        setActiveSection(targetId)
      }
    }

    const timeouts = [
      setTimeout(attemptScroll, 100),
      setTimeout(attemptScroll, 1000),
      setTimeout(attemptScroll, 1500),
      setTimeout(attemptScroll, 2000),
    ]

    return () => timeouts.forEach(clearTimeout)
  }, [isHomepage, lenis])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20
      setIsScrolled(scrolled)

      if (isHomepage && scrolled !== displayLogo) {
        setDisplayLogo(scrolled)
      }

      if (isHomepage) {
        const scrollPosition = window.scrollY + 100
        let currentSection = 'hero'

        navLinks.forEach((link) => {
          const sectionId = link.href === '/' ? 'hero' : link.href.replace('/#', '')
          const element = document.getElementById(sectionId)

          if (element) {
            const offsetTop = element.offsetTop
            const offsetHeight = element.offsetHeight

            if (
              scrollPosition >= offsetTop &&
              scrollPosition < offsetTop + offsetHeight
            ) {
              currentSection = sectionId
            }
          }
        })

        if (activeSection !== currentSection) {
          setActiveSection(currentSection)
          const targetHash = currentSection === 'hero' ? '' : `#${currentSection}`
          if (window.location.hash !== targetHash) {
            window.history.replaceState(null, '', targetHash || window.location.pathname)
          }
        }
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [displayLogo, isHomepage, activeSection, navLinks, pathname])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (!isMobileMenuOpen) {
      setIsMenuClosing(true)
      const timer = setTimeout(() => {
        setIsMenuClosing(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setIsMenuClosing(false)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const scrollToSection = (href: string) => {
    if (!isHomepage && href.startsWith('/#')) {
      window.location.href = href
      return
    }

    const targetId = href === '/' ? '#hero' : href.replace('/', '')

    if (targetId.startsWith('#')) {
      const element = document.querySelector(targetId) as HTMLElement
      if (element && lenis) {
        lenis.scrollTo(element, { offset: -80 })
        setActiveSection(targetId.substring(1))
        setIsMobileMenuOpen(false)
        window.history.pushState(null, '', href)
      }
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (isHomepage) {
      window.history.pushState(null, '', '/')
    }
  }

  const isActive = (href: string) => {
    if (!isHomepage) {
      return href == pathname
    } else {
      const id = href == '/' ? 'hero' : href.substring(2)
      return activeSection == id
    }
  }

  const handleLogoutClick = () => {
    setIsDropdownOpen(false)
    setIsMobileMenuOpen(false)
    setIsModalConfirmLogoutOpen(true)
  }

  const executeLogout = async () => {
    try {
      NProgress.start()

      const response = await fetch('/api/auth', {
        method: 'DELETE'
      })

      if (response.ok) { NProgress.done(); window.location.href = "/login"; } else NProgress.done();
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLogoutLoading(false)
      setIsModalConfirmLogoutOpen(false)
    }
  }

  const truncateText = (t: string) => {
    return t.length > 12 ? `${t.slice(0, 12)}...` : t
  }

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isHomepage
          ? (isScrolled || isMobileMenuOpen || isMenuClosing)
            ? 'bg-white shadow-md py-3'
            : 'bg-transparent py-4'
          : 'bg-white shadow-md py-3'
          }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link href={isDashboard ? '/dashboard' : '/#'} className="flex items-center justify-center gap-2">
                <img src={generalSetting?.mbkm_icon || LogoKemen.src} alt="Logo Kemendikbud" className="h-10 w-10" />
                <img src={LogoUNG.src} alt="Logo UNG" className="h-[38px] w-[38px] mr-[2px]" />

                {isHomepage ? (
                  <>
                    <img src={LogoKM.src} alt="Logo Kampus Merdeka" className={`h-10 ${(displayLogo || isMobileMenuOpen || isMenuClosing) ? 'hidden' : ''}`} />
                    <img src={LogoKM2.src} alt="Logo Kampus Merdeka" className={`h-10 ${(displayLogo || isMobileMenuOpen || isMenuClosing) ? '' : 'hidden'}`} />
                  </>
                ) : (
                  <img src={LogoKM2.src} alt="Logo Kampus Merdeka" className="h-10" />
                )}
              </Link>
            </div>

            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={isHomepage ? (e) => { e.preventDefault(); scrollToSection(link.href) } : () => { }}
                    className={`text-sm font-medium transition-colors relative group ${isActive(link.href)
                      ? isScrolled || !isHomepage
                        ? 'text-orange-500'
                        : 'text-white'
                      : isScrolled || !isHomepage
                        ? 'text-gray-700 hover:text-orange-500'
                        : 'text-gray-200 hover:text-white'
                      }`}
                  >
                    {link.name}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                    />
                  </Link>
                </li>
              ))}
            </ul>

            {isDashboard ? (
              <>
                <div className="hidden lg:flex items-center gap-4">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-4 rounded-full"
                    >
                      {session?.profile.avatar_url ? (
                        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-full w-9 h-9 flex-shrink-0">
                          <img
                            src={session?.profile.avatar_url}
                            alt={session?.profile.full_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                          {session?.profile.full_name.charAt(0)}
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-700">{truncateText(session?.profile.full_name)}</p>
                        <p className="text-xs text-gray-500">@{truncateText(session?.profile.username)}</p>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{session?.profile.full_name}</p>
                          <p className="text-xs text-gray-500 mt-1">@{session?.profile.username}</p>
                        </div>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <UserIcon className="h-4 w-4" />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogoutClick}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="hidden lg:flex items-center gap-4">
                <Link
                  href={session ? "/dashboard" : "/login"}
                  className="px-8 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors shadow-lg hover:shadow-orange-500/50"
                >
                  {session ? "Dashboard" : "Masuk"}
                </Link>
              </div>
            )}


            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${(isScrolled || isMobileMenuOpen || isMenuClosing) || !isHomepage
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
                }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : (
                <div>
                  <span className="sr-only">Open main menu</span>
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                  </svg>
                </div>
              )}
            </button>
          </div>

          <div
            className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 rounded-b-2xl transition-all duration-500 ease-in-out transform origin-top max-h-[calc(100vh-70px)] overflow-y-auto ${isMobileMenuOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-4 pointer-events-none'
              }`}
          >
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      if (isHomepage && (link.href.startsWith('/#') || link.href === '/')) {
                        e.preventDefault()
                        scrollToSection(link.href)
                      } else {
                        setIsMobileMenuOpen(false)
                      }
                    }}
                    className={`block w-full text-left px-6 py-3 text-sm font-medium transition-colors ${isActive(link.href)
                      ? 'text-orange-500 bg-orange-50'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-orange-500'
                      }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {isDashboard ? (
                <li className="border-t border-gray-200 mt-2 pt-4 flex flex-col gap-2">
                  <div className="px-6 mb-2 flex gap-3 items-center">
                    {session?.profile.avatar_url ? (
                      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-full w-10 h-10 lg:w-9 lg:h-9 flex-shrink-0">
                        <img
                          src={session?.profile.avatar_url}
                          alt={session?.profile.full_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                        {session?.profile.full_name.charAt(0)}
                      </div>
                    )}
                    <div className="">
                      <p className="text-sm font-medium text-gray-900">{session?.profile.full_name}</p>
                      <p className="text-xs text-gray-500 mt-1">@{session?.profile.username}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-6 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </li>
              ) : (
                <li className="border-t border-gray-200 mt-2 pt-4 px-6 flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-2 px-6 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Masuk
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>

      <button
        id='btn-scroll-up'
        className={`bg-orange-500 shadow-xl fixed bottom-6 right-6 lg:bottom-8 lg:right-8 p-3 rounded-full z-40 hover:scale-110 hover:brightness-90 transition-all transform ease-in-out ${isScrolled ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-0 pointer-events-none"
          }`}
        onClick={scrollToTop}
        title='Kembali ke atas'
      >
        <ChevronUp className='w-5 h-5 lg:w-6 lg:h-6 text-white' />
      </button>

      <Modal
        isOpen={isModalConfirmLogoutOpen}
        confirmation={{
          negativeBtn: "Batal",
          positiveBtn: "Logout",
          handlePositiveBtn: executeLogout,
          loading: {
            text: "Logging out...",
            isLoading: isLogoutLoading,
            setIsLoading: setIsLogoutLoading
          }
        }}
        onClose={() => setIsModalConfirmLogoutOpen(false)}
        title={"Konfirmasi Logout"}
      >
        <p>Apakah Anda yakin ingin keluar dari akun ini?</p>
      </Modal>
    </>
  )
}