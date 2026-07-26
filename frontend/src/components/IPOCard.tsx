import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import type { IPO } from '../types/ipo'
import StatusBadge from './StatusBadge'

const currency = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 })

export default function IPOCard({ ipo }: { ipo: IPO }) {
  return (
    <motion.article whileHover={{ y: -5 }} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl hover:shadow-slate-200/70 dark:border-white/10 dark:bg-slate-900 dark:hover:shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">{ipo.company.industry ?? 'IPO'}</p>
          <h3 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">{ipo.company.name}</h3>
        </div>
        <StatusBadge status={ipo.status} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 border-y border-slate-100 py-4 text-sm dark:border-white/10">
        <div><p className="text-slate-500">Price band</p><p className="mt-1 font-semibold text-slate-900 dark:text-white">₹{currency.format(Number(ipo.issue_price_low))}–{currency.format(Number(ipo.issue_price_high))}</p></div>
        <div><p className="text-slate-500">Issue size</p><p className="mt-1 font-semibold text-slate-900 dark:text-white">₹{currency.format(Number(ipo.issue_size))} Cr</p></div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm"><span className="text-slate-500">GMP <b className="ml-1 text-emerald-600 dark:text-emerald-400">₹{ipo.gmp ?? '—'}</b></span><Link className="font-semibold text-cyan-700 hover:text-cyan-500 dark:text-cyan-300" to={`/ipo/${ipo.id}`}>View analysis →</Link></div>
    </motion.article>
  )
}
