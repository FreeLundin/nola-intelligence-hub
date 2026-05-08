import { motion } from 'framer-motion'
import { Zap, Thermometer, Target } from 'lucide-react'
import useScenarioStore from '../store/useScenarioStore'

function AssetDetailPanel() {
  const selectedFeature = useScenarioStore((state) => state.selectedFeature)

  if (!selectedFeature) {
    return (
      <div className="hidden xl:block rounded-3xl border border-slate-800 bg-slate-950/90 p-5 text-slate-300 shadow-2xl shadow-black/20">
        <div className="text-sm uppercase tracking-[0.28em] text-slate-500">Asset Detail</div>
        <div className="mt-6 text-slate-400">Select a pump or neighborhood on the map to show system-level context and suggested actions.</div>
      </div>
    )
  }

  const { pump_id, name, status } = selectedFeature.properties
  const riskColor = status === 'failed' ? 'text-pink-400' : status === 'warning' ? 'text-amber-300' : 'text-emerald-400'

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 text-slate-100 shadow-2xl shadow-black/20"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Asset Detail</div>
          <h2 className="text-2xl font-semibold text-white">Pump {pump_id}</h2>
        </div>
        <div className={`rounded-full px-3 py-1 text-sm font-semibold ${riskColor} bg-slate-900/80`}>{status.toUpperCase()}</div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-3xl bg-slate-900/90 p-4">
          <div className="flex items-center gap-2 text-slate-300"><Zap className="h-5 w-5 text-cyan-300" /><span className="text-xs uppercase tracking-[0.24em]">Flow Capacity</span></div>
          <div className="mt-3 text-3xl font-semibold text-white">1,200 GPM</div>
          <div className="mt-1 text-sm text-slate-400">Current operating load</div>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-4">
          <div className="flex items-center gap-2 text-slate-300"><Thermometer className="h-5 w-5 text-amber-300" /><span className="text-xs uppercase tracking-[0.24em]">Pressure</span></div>
          <div className="mt-3 text-3xl font-semibold text-white">72 PSI</div>
          <div className="mt-1 text-sm text-slate-400">Simulated sensor reading</div>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-4">
          <div className="flex items-center gap-2 text-slate-300"><Target className="h-5 w-5 text-violet-400" /><span className="text-xs uppercase tracking-[0.24em]">Suggested Action</span></div>
          <div className="mt-3 text-lg font-semibold text-white">Deploy backup pump to reduce load.</div>
          <div className="mt-1 text-sm text-slate-400">AI recommends mitigation and stabilization.</div>
        </div>
      </div>
    </motion.aside>
  )
}

export default AssetDetailPanel
