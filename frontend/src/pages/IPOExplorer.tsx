import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import IPOCard from '../components/IPOCard'
import Navbar from '../components/Navbar'
import { getIpos } from '../lib/api'
import type { IPOStatus } from '../types/ipo'

const statuses: Array<'All' | IPOStatus> = ['All', 'Upcoming', 'Open', 'Closed', 'Listed']

export default function IPOExplorer() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'All' | IPOStatus>('All')
  const { data: ipos = [], isLoading, isError } = useQuery({ queryKey: ['ipos', search, status], queryFn: () => getIpos({ search: search || undefined, status: status === 'All' ? undefined : status }) })
  return <div className="min-h-screen bg-slate-50 dark:bg-slate-950"><Navbar /><main className="mx-auto max-w-7xl px-5 py-10 lg:px-8"><p className="text-sm font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">IPO intelligence</p><h1 className="mt-2 text-3xl font-black dark:text-white">Explore IPOs</h1><p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">Search companies and compare their issue information, market demand, and listing status.</p><div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row dark:border-white/10 dark:bg-slate-900"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by company name" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950 dark:text-white"/><select value={status} onChange={(event) => setStatus(event.target.value as 'All' | IPOStatus)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950 dark:text-white">{statuses.map((value) => <option key={value}>{value}</option>)}</select></div>{isError ? <div className="mt-8 rounded-xl bg-rose-50 p-4 text-rose-700">Unable to reach the IPO API. Confirm the backend is running on port 8000.</div> : isLoading ? <div className="mt-12 text-center text-slate-500">Loading IPO data…</div> : ipos.length ? <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{ipos.map((ipo) => <IPOCard key={ipo.id} ipo={ipo}/>)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-white/15">No IPOs match your current search.</div>}</main></div>
}
