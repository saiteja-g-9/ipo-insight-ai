import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../lib/api'

const navLink = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-semibold transition ${
    isActive
      ? 'text-cyan-700 dark:text-cyan-300'
      : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
  }`

export default function Navbar() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("ipo_insight_theme") === "dark"
  );

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false)

  const loggedIn = !!localStorage.getItem("ipo_insight_token");
  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    enabled: loggedIn,
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(
      "ipo_insight_theme",
      dark ? "dark" : "light"
    );
  }, [dark]);

  const logout = () => {
    localStorage.removeItem("ipo_insight_token");
    window.location.href = "/";
  };
  const links = (
    <>
      <NavLink className={navLink} to="/dashboard">
        Dashboard
      </NavLink>

      <NavLink className={navLink} to="/ipos">
        Explore IPOs
      </NavLink>
    </>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-950 dark:text-white"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-700 text-lg font-black text-white shadow-lg shadow-cyan-500/20">
            I
          </span>

          <span className="font-bold tracking-tight">
            IPO Insight <span className="text-cyan-600 dark:text-cyan-300">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            aria-label="Toggle dark mode"
            onClick={() => setDark((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-700 transition hover:border-cyan-400 dark:border-white/15 dark:text-slate-200"
          >
            {dark ? '☀' : '◐'}
          </button>

          {loggedIn ? (
            <>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 font-bold text-white transition hover:bg-cyan-700"
                >
                  {user?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-900">

                    <div className="border-b border-slate-200 p-4 dark:border-white/10">
                      <p className="font-bold dark:text-white">
                        {user?.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-3 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={logout}
                      className="block w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      Logout
                    </button>

                  </div>
                )}
              </div>

              <button
                onClick={logout}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-400 dark:text-slate-950"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          aria-label="Open navigation"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-xl md:hidden dark:text-white"
        >
          ☰
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 md:hidden dark:border-white/10">
          {links}

          <div className="flex flex-col gap-3">
            {loggedIn ? (
              <>
                <span className="font-semibold dark:text-white">
                  👤 Logged In
                </span>

                <button
                  onClick={logout}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold dark:text-white"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="text-sm font-semibold text-cyan-700 dark:text-cyan-300"
                >
                  Register
                </Link>
              </>
            )}

            <button
              onClick={() => setDark((v) => !v)}
              className="text-left text-sm font-semibold dark:text-white"
            >
              {dark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}