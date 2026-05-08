import { useEffect, useMemo, useState } from 'react'
import { ShieldCheck, Droplet, Activity, AlertTriangle } from 'lucide-react'

function IntelligencePanel({ apiBase }) {
  const [pumpData, setPumpData] = useState(null)
  const [floodData, setFloodData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [pumpRes, floodRes] = await Promise.all([
          fetch(`${apiBase}/layers/pump_stations`),
          fetch(`${apiBase}/layers/flood_extent?hour=12`)
        ])
        if (!pumpRes.ok || !floodRes.ok) throw new Error('Failed to load feed data')
        const [pumps, flood] = await Promise.all([pumpRes.json(), floodRes.json()])
        if (mounted) {
          setPumpData(pumps)
          setFloodData(flood)
        }
      } catch (err) {
        if (mounted) {
          setPumpData(null)
          setFloodData(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [apiBase])

  const metrics = useMemo(() => {
    const pumps = pumpData?.features || []
    const failedCount = pumps.filter((d) => d.properties.status === 'failed').length
    const warningCount = pumps.filter((d) => d.properties.status === 'warning').length
    const activeCount = pumps.length - failedCount
    const risk = floodData?.features?.[0]?.properties?.hour ?? 0
    const health = Math.max(25, 100 - risk * 3)
    return { failedCount, warningCount, activeCount, health }
  }, [pumpData, floodData])

  return (
    <aside className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/90 p-5 text-slate-100 shadow-2xl shadow-black/20">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Intelligence Feed</div>
          <h2 className="text-2xl font-bold text-white">City Health</h2>
        </div>
        <div className="rounded-3xl bg-slate-900 px-4 py-3 text-2xl font-semibold text-cyan-300">{loading ? '--' : `${metrics.health}%`}</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-900/90 p-4">
          <div className="flex items-center gap-2 text-slate-300"><ShieldCheck className="h-5 w-5 text-emerald-400" /><span className="text-xs uppercase tracking-[0.24em]">Operational Pumps</span></div>
          <div className="mt-3 text-3xl font-semibold text-white">{loading ? '--' : metrics.activeCount}</div>
          <div className="mt-1 text-sm text-slate-400">Active and stable</div>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-4">
          <div className="flex items-center gap-2 text-slate-300"><AlertTriangle className="h-5 w-5 text-amber-400" /><span className="text-xs uppercase tracking-[0.24em]">At-risk pumps</span></div>
          <div className="mt-3 text-3xl font-semibold text-white">{loading ? '--' : metrics.warningCount + metrics.failedCount}</div>
          <div className="mt-1 text-sm text-slate-400">Warning / critical</div>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-4">
          <div className="flex items-center gap-2 text-slate-300"><Droplet className="h-5 w-5 text-cyan-400" /><span className="text-xs uppercase tracking-[0.24em]">Water Index</span></div>
          <div className="mt-3 text-3xl font-semibold text-white">{loading ? '--' : floodData?.features?.[0]?.properties?.hour ?? '--'}</div>
          <div className="mt-1 text-sm text-slate-400">Forecast pressure</div>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-4">
          <div className="flex items-center gap-2 text-slate-300"><Activity className="h-5 w-5 text-violet-400" /><span className="text-xs uppercase tracking-[0.24em]">Response Horizon</span></div>
          <div className="mt-3 text-3xl font-semibold text-white">{loading ? '--' : '6h'}</div>
          <div className="mt-1 text-sm text-slate-400">Next decision window</div>
        </div>
      </div>
    </aside>
  )
}

export default IntelligencePanel
