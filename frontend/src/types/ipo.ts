export type IPOStatus = 'Upcoming' | 'Open' | 'Closed' | 'Listed'

export interface Company {
  id: number
  name: string
  industry: string | null
  headquarters: string | null
  founded_year: number | null
  description: string | null
  website: string | null
  created_at: string
}

export interface IPO {
  id: number
  company_id: number
  issue_price_low: string | number
  issue_price_high: string | number
  issue_size: string | number
  lot_size: number
  listing_date: string | null
  open_date: string
  close_date: string
  exchange: string
  status: IPOStatus
  gmp: string | number | null
  subscription_retail: string | number | null
  subscription_qib: string | number | null
  subscription_nii: string | number | null
  created_at: string
  company: Company
}
