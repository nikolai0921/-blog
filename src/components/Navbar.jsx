import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { label: '首頁',    to: '/'         },
  { label: '關於我',  to: '/about'    },
  { label: '文章列表', to: '/articles' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60 shadow-lg shadow-slate-950/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-lg bg-forest-700 flex items-center justify-center text-white font-bold text-sm group-hover:bg-forest-600 transition-colors">
            B
          </span>
          <span className="font-semibold text-slate-100 tracking-tight">
            Blog<span className="text-forest-400">.</span>dev
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={label}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative px-1 py-0.5 text-sm font-medium transition-colors duration-200
                   after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-forest-400 after:transition-all after:duration-200
                   ${isActive
                     ? 'text-forest-400 after:w-full'
                     : 'text-slate-400 hover:text-forest-400 hover:after:w-full'
                   }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-forest-700 hover:bg-forest-600 text-white text-sm font-medium transition-colors duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            撰寫文章
          </Link>

          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="選單"
          >
            <span className={`block w-5 h-0.5 bg-slate-300 transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-slate-300 transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-slate-300 transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-md animate-fade-in">
          <ul className="px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-forest-400 bg-slate-800/60'
                        : 'text-slate-300 hover:text-forest-400 hover:bg-slate-800/60'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <Link
                to="/new"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-forest-700 hover:bg-forest-600 text-white text-sm font-medium text-center transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                撰寫文章
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
