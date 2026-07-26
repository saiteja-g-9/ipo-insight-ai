import axios from 'axios'

import type { IPO, IPOStatus } from '../types/ipo'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ipo_insight_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getIpos = async (params?: { search?: string; status?: IPOStatus }) => {
  const { data } = await api.get<IPO[]>('/ipos', { params })
  return data
}

export const getIpo = async (id: string) => {
  const { data } = await api.get<IPO>(`/ipos/${id}`)
  return data
}

export const login = async (payload: { email: string; password: string }) => {
  const { data } = await api.post<{ access_token: string; token_type: string }>('/auth/login', payload)
  return data
}

export const register = async (payload: { name: string; email: string; password: string }) => {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export interface AIAnalysis {
  summary: string
  strengths: string[]
  risks: string[]
  bull_case: string
  bear_case: string
  financial_health: string
  recommendation: string
  confidence: number
}

export const analyzeIPO = async (id: string) => {
  const { data } = await api.post<AIAnalysis>(`/ai/analyze/${id}`)
  return data
}

export interface CurrentUser {
  id: number
  name: string
  email: string
  is_active: boolean
}

export const getCurrentUser = async () => {
  const { data } = await api.get<CurrentUser>('/auth/me')
  return data
}