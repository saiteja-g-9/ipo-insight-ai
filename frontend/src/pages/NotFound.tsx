import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function NotFound() { return <div className="min-h-screen bg-slate-50 dark:bg-slate-950"><Navbar /><main className="mx-auto grid min-h-[70vh] max-w-7xl place-items-center px-5 text-center"><div><p className="text-7xl font-black text-cyan-500">404</p><h1 className="mt-4 text-3xl font-bold dark:text-white">This page is not in the prospectus.</h1><p className="mt-3 text-slate-600 dark:text-slate-300">The page you requested does not exist.</p><Link to="/" className="mt-7 inline-block rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white dark:bg-cyan-400 dark:text-slate-950">Return home</Link></div></main></div> }
