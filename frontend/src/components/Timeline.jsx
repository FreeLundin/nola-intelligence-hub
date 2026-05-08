import { useMemo } from 'react'
import useScenarioStore from '../store/useScenarioStore'

const scenarios = [
  'Baseline',
  '100-Year Storm',
  'Hurricane Katrina'
]

function Timeline({ apiBase }) {
  const hour = useScenarioStore((state) => state.hour)
  const setHour = useScenarioStore((state) => state.setHour)

  const riskScore = useMemo(() => {
    if (hour < 6) return 18
    if (hour < 12) return 42
    if (hour < 18) return 68
    return 86
  }, [hour])

  return (
    <footer className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-2xl shadow-black/20">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Temporal Axis</div>
          <h2 className="text-xl font-semibold text-white">Flood Forecast Timeline</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {scenarios.map((scenario) => (
            <button key={scenario} type="button" className="rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800">
              {scenario}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Hour 0</span>
          <span>Hour 24</span>
        </div>
        <input type="range" min="0" max="24" value={hour} onChange={(event) => setHour(Number(event.target.value))} className="w-full accent-cyan-400" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-3xl bg-slate-900/90 p-4 text-white">
            <div className="text-sm text-slate-400">Current time</div>
            <div className="mt-2 text-3xl font-semibold">{hour}:00</div>
          </div>
          <div className="rounded-3xl bg-slate-900/90 p-4 text-white">
            <div className="text-sm text-slate-400">Risk Score</div>
            <div className="mt-2 text-3xl font-semibold text-cyan-300">{riskScore}</div>
          </div>
          <div className="rounded-3xl bg-slate-900/90 p-4 text-white">
            <div className="text-sm text-slate-400">Flood intensity</div>
            <div className="mt-2 text-3xl font-semibold">{hour * 0.2}m</div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Timeline
