import { useState } from 'react'
import useScenarioStore from '../store/useScenarioStore'

function ControlPanel({ apiBase }) {
  const spec = useScenarioStore((state) => state.spec)
  const layerVisibility = useScenarioStore((state) => state.layerVisibility)
  const toggleLayer = useScenarioStore((state) => state.toggleLayer)
  const [command, setCommand] = useState('')
  const [status, setStatus] = useState('Ready')

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
      setStatus(`Parsed: ${payload.parsed.pump_id} (${payload.parsed.resolved_from}) → ${payload.result.status}`)
    } catch (err) {
      setStatus(err.message)
    }

    setCommand('')
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-xl">
      <div className="mb-4 space-y-2">
        <h2 className="text-xl font-semibold">Command Center</h2>
        <p className="text-slate-400">Toggle layers and issue a what-if pump command.</p>
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-300">Layers</div>
          {spec.layers.map((layer) => (
            <label key={layer.id} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
              <input
                type="checkbox"
                checked={!!layerVisibility[layer.id]}
                onChange={() => toggleLayer(layer.id)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-400"
              />
              <span className="text-slate-200">{layer.name}</span>
            </label>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-sm font-medium text-slate-300">What-If Command</div>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Fail pump 5 at Tchoupitoulas"
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
          <button type="submit" className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
            Execute
          </button>
          <div className="text-sm text-slate-400">{status}</div>
        </form>
      </div>
    </div>
  )
}

export default ControlPanel
