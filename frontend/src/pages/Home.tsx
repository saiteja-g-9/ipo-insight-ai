import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar'

const features = [
  ['✦', 'AI Analysis', 'Turn complex IPO information into clear, focused research.'],
  ['◌', 'IPO Tracking', 'Follow issue dates, price bands, subscription, and listing status.'],
  ['↗', 'Financial Charts', 'Read key demand and price signals in a focused market view.'],
  ['♡', 'Watchlist', 'Keep the IPOs you are evaluating within easy reach.'],
]

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950"><Navbar />
      <main>
        <section className="relative isolate"><div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-100 via-slate-50 to-transparent dark:from-cyan-950/40 dark:via-slate-950" />
          <div className="mx-auto max-w-7xl px-5 pb-24 pt-24 text-center lg:px-8 lg:pb-32 lg:pt-32">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-800 dark:border-cyan-700/50 dark:bg-cyan-950/50 dark:text-cyan-200">● Data-led IPO research</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mx-auto mt-7 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-7xl dark:text-white">IPO Insight <span className="bg-gradient-to-r from-cyan-500 to-blue-700 bg-clip-text text-transparent">AI</span></motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">AI-powered IPO Research & Investment Analysis Platform</motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/ipos" className="rounded-xl bg-slate-950 px-6 py-3.5 font-bold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-cyan-700 dark:bg-cyan-400 dark:text-slate-950">Explore IPOs</Link><Link to="/register" className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-800 transition hover:border-cyan-400 dark:border-white/15 dark:bg-slate-900 dark:text-white">Get Started</Link></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }} className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 text-left shadow-2xl shadow-cyan-900/10 sm:grid-cols-4 dark:border-white/10 dark:bg-white/10"><div className="bg-white p-5 dark:bg-slate-900"><p className="text-xs text-slate-500">Market focus</p><p className="mt-1 font-bold dark:text-white">Indian IPOs</p></div><div className="bg-white p-5 dark:bg-slate-900"><p className="text-xs text-slate-500">Coverage</p><p className="mt-1 font-bold dark:text-white">NSE & BSE</p></div><div className="bg-white p-5 dark:bg-slate-900"><p className="text-xs text-slate-500">Signal</p><p className="mt-1 font-bold text-cyan-700 dark:text-cyan-300">GMP + demand</p></div><div className="bg-white p-5 dark:bg-slate-900"><p className="text-xs text-slate-500">Research</p><p className="mt-1 font-bold dark:text-white">In one view</p></div></motion.div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8"><div className="mb-10 max-w-xl"><p className="text-sm font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">Built for clarity</p><h2 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">A more disciplined IPO research workflow.</h2></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{features.map(([icon, title, text], index) => <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} key={title} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900"><span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-50 text-xl text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">{icon}</span><h3 className="mt-5 font-bold text-slate-950 dark:text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p></motion.article>)}</div></section>
      </main>
    </div>
  )
}
