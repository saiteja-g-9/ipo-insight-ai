import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'

import Navbar from '../components/Navbar'
import StatusBadge from '../components/StatusBadge'
import { analyzeIPO, getIpo } from '../lib/api'
import type { AIAnalysis } from '../lib/api'

const money = (value: string | number | null) =>
  value === null
    ? '—'
    : `₹${new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
      }).format(Number(value))}`

const date = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'To be announced'

export default function IPODetails() {
  const { id = '' } = useParams()

  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [loadingAI, setLoadingAI] = useState(false)

  const {
    data: ipo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['ipo', id],
    queryFn: () => getIpo(id),
    enabled: Boolean(id),
  })

  async function handleAnalyze() {
    if (!id) return

    try {
      setLoadingAI(true)
      const result = await analyzeIPO(id)
      setAnalysis(result)
    } catch (err) {
      console.error(err)
      alert('Failed to generate AI analysis.')
    } finally {
      setLoadingAI(false)
    }
  }

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="mx-auto max-w-7xl px-5 py-16 text-slate-500">
          Loading IPO research…
        </div>
      </div>
    )

  if (isError || !ipo)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="mx-auto max-w-7xl px-5 py-16">
          <h1 className="text-2xl font-bold dark:text-white">
            IPO not found
          </h1>

          <Link
            to="/ipos"
            className="mt-4 inline-block text-cyan-700 dark:text-cyan-300"
          >
            Return to IPO explorer
          </Link>
        </div>
      </div>
    )

  const subscriptions: [string, string | number | null][] = [
    ['Retail', ipo.subscription_retail],
    ['QIB', ipo.subscription_qib],
    ['NII', ipo.subscription_nii],
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

        <Link
          to="/ipos"
          className="text-sm font-semibold text-cyan-700 dark:text-cyan-300"
        >
          ← All IPOs
        </Link>

        <section className="mt-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-7 text-white shadow-xl sm:p-10">

          <div className="flex flex-wrap items-start justify-between gap-5">

            <div>
              <p className="text-sm font-semibold text-cyan-300">
                {ipo.company.industry ?? 'IPO'}
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-5xl">
                {ipo.company.name}
              </h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                {ipo.company.description}
              </p>
            </div>

            <StatusBadge status={ipo.status} />
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Price band
              </p>

              <p className="mt-2 text-xl font-bold">
                {money(ipo.issue_price_low)} – {money(ipo.issue_price_high)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Issue size
              </p>

              <p className="mt-2 text-xl font-bold">
                {money(ipo.issue_size)} Cr
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Grey market premium
              </p>

              <p className="mt-2 text-xl font-bold text-emerald-300">
                {money(ipo.gmp)}
              </p>
            </div>

          </div>
        </section>

        <div className="mt-7 grid gap-7 lg:grid-cols-3">

          <div className="space-y-7 lg:col-span-2">

            <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900">

              <h2 className="text-lg font-bold dark:text-white">
                Subscription demand
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">

                {subscriptions.map(([label, value]: [string, string | number | null]) => ( (
                  <div
                    key={String(label)}
                    className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950"
                  >
                    <p className="text-sm text-slate-500">{label}</p>

                    <p className="mt-1 text-2xl font-black text-cyan-700 dark:text-cyan-300">
                      {value ?? '—'}
                      {value !== null ? '×' : ''}
                    </p>
                  </div>
                )))}

              </div>

            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900">

              <h2 className="text-lg font-bold dark:text-white">
                IPO timeline
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-3">

                {[
                  ['Opens', date(ipo.open_date)],
                  ['Closes', date(ipo.close_date)],
                  ['Lists', date(ipo.listing_date)],
                ].map(([label, value], index) => (
                  <div key={label} className="relative">

                    <span className="mb-3 block h-3 w-3 rounded-full bg-cyan-500 ring-4 ring-cyan-100 dark:ring-cyan-500/20" />

                    <p className="text-sm font-bold dark:text-white">
                      {label}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {value}
                    </p>

                    {index < 2 && (
                      <span className="absolute left-3 top-1.5 hidden h-px w-[calc(100%-1rem)] bg-slate-200 sm:block dark:bg-white/10" />
                    )}
                  </div>
                ))}

              </div>

            </section>

            {analysis && (
              <section className="rounded-2xl border border-cyan-200 bg-white p-6 dark:border-cyan-700 dark:bg-slate-900">

                <h2 className="text-2xl font-bold text-cyan-600">
                  AI Analysis
                </h2>

                <p className="mt-4">{analysis.summary}</p>

                <h3 className="mt-6 font-bold">Strengths</h3>
                <ul className="list-disc pl-5">
                  {analysis.strengths.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>

                <h3 className="mt-6 font-bold">Risks</h3>
                <ul className="list-disc pl-5">
                  {analysis.risks.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>

                <h3 className="mt-6 font-bold">Bull Case</h3>
                <p>{analysis.bull_case}</p>

                <h3 className="mt-6 font-bold">Bear Case</h3>
                <p>{analysis.bear_case}</p>

                <h3 className="mt-6 font-bold">Financial Health</h3>
                <p>{analysis.financial_health}</p>

                <h3 className="mt-6 font-bold">Recommendation</h3>
                <p>{analysis.recommendation}</p>

                <h3 className="mt-6 font-bold">
                  Confidence: {analysis.confidence}%
                </h3>

              </section>
            )}

          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900">

            <h2 className="text-lg font-bold dark:text-white">
              Company profile
            </h2>

            <dl className="mt-5 space-y-4 text-sm">

              <div>
                <dt className="text-slate-500">Headquarters</dt>
                <dd className="mt-1 font-semibold dark:text-white">
                  {ipo.company.headquarters ?? '—'}
                </dd>
              </div>

              <div>
                <dt className="text-slate-500">Founded</dt>
                <dd className="mt-1 font-semibold dark:text-white">
                  {ipo.company.founded_year ?? '—'}
                </dd>
              </div>

              <div>
                <dt className="text-slate-500">Exchange</dt>
                <dd className="mt-1 font-semibold dark:text-white">
                  {ipo.exchange}
                </dd>
              </div>

              <div>
                <dt className="text-slate-500">Lot size</dt>
                <dd className="mt-1 font-semibold dark:text-white">
                  {ipo.lot_size} shares
                </dd>
              </div>

            </dl>

            <button
              onClick={handleAnalyze}
              disabled={loadingAI}
              className="mt-7 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-bold text-white shadow-lg hover:brightness-110 disabled:opacity-50"
            >
              {loadingAI ? 'Analyzing...' : 'Analyze with AI'}
            </button>

          </aside>

        </div>

      </main>
    </div>
  )
}