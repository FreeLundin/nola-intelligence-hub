import { useState } from 'react'
import { motion } from 'framer-motion'
import { Command, Wifi, AlertTriangle, CircleDashed } from 'lucide-react'
import useScenarioStore from '../store/useScenarioStore'

function TopBar({ apiBase }) {
  const [command, setCommand] = useState('')
  const [status, setStatus] = useState('Ready')
  const viewMode = useScenarioStore((state) => state.viewMode)
  const setViewMode = useScenarioStore((state) => state.setViewMode)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!command.trim()) return
    setStatus('Dispatching...')

    try {
      const response = await fetch(`${apiBase}/simulation/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      })
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        throw new Error(errorBody?.detail || 'Simulation request failed')
      }
      const payload = await response.json()
      setStatus(`Parsed ${payload.parsed.pump_id}: ${payload.result.status}`)
    } catch (err) {
      setStatus(err.message)
    }

    setCommand('')
  }

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed left-0 right-0 z-30 mx-auto flex min-h-[84px] max-w-[1760px] items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 text-slate-100">
        <Command className="h-6 w-6 text-cyan-300" />
        <div>
          <div className="text-sm uppercase tracking-[0.25em] text-slate-400">Global Command</div>
          <div className="text-lg font-semibold">AI Command Line</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type a command..."
          className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white shadow-inner outline-none transition focus:border-cyan-400"
        />
        <button type="submit" className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 md:ml-3">
          Execute
        </button>
      </form>

      <div className="flex items-center gap-3 text-slate-100">
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900/90 px-3 py-2 text-sm text-slate-300">
          <Wifi className="h-4 w-4 text-emerald-400" />
          <span>Online</span>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900/90 px-3 py-2 text-sm text-amber-300">
          <AlertTriangle className="h-4 w-4 text-pink-500" />
          <span>2 Pumps at Risk</span>
        </div>
        <div className="hidden items-center gap-2 rounded-2xl bg-slate-900/90 px-3 py-2 text-sm text-slate-300 sm:flex">
          <CircleDashed className="h-4 w-4 text-cyan-400" />
          <span>Mode: {viewMode}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {['SATELLITE', 'HYBRID', 'X-RAY'].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${viewMode === mode ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
          >
            {mode}
          </button>
        ))}
      </div>
    </motion.header>
  )
}

export default TopBar
