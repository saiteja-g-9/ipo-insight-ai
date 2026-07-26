import type { IPOStatus } from '../types/ipo'

const styles: Record<IPOStatus, string> = {
  Upcoming: 'bg-violet-500/10 text-violet-700 ring-violet-600/20 dark:text-violet-300',
  Open: 'bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-300',
  Closed: 'bg-amber-500/10 text-amber-700 ring-amber-600/20 dark:text-amber-300',
  Listed: 'bg-sky-500/10 text-sky-700 ring-sky-600/20 dark:text-sky-300',
}

export default function StatusBadge({ status }: { status: IPOStatus }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}>{status}</span>
}
