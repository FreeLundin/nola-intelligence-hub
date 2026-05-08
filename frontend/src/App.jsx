import { useEffect, useState } from 'react'
import MapView from './components/MapView'
import TopBar from './components/TopBar'
import IntelligencePanel from './components/IntelligencePanel'
import AssetDetailPanel from './components/AssetDetailPanel'
import Timeline from './components/Timeline'
import useScenarioStore from './store/useScenarioStore'

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const setSpec = useScenarioStore((state) => state.setSpec)
  const spec = useScenarioStore((state) => state.spec)

  useEffect(() => {
    async function loadSpec() {
      try {
        const response = await fetch(`${apiBase}/spec`)
        if (!response.ok) throw new Error('Failed to load spec')
        const payload = await response.json()
        setSpec(payload)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadSpec()
  }, [setSpec])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-command text-white">Loading NOLA Intelligence Hub...</div>
  }

  if (error || !spec) {
    return <div className="min-h-screen flex items-center justify-center bg-command text-red-400">{error || 'Unable to load scenario.'}</div>
  }

  return (
    <div className="min-h-screen bg-command text-white">
      <TopBar apiBase={apiBase} />

      <main className="relative mx-auto grid max-w-[1760px] gap-4 px-4 pt-28 pb-6 xl:grid-cols-[0.36fr,1fr,0.38fr]">
        <div className="space-y-4">
          <IntelligencePanel apiBase={apiBase} />
        </div>

        <section className="relative rounded-[40px] border border-slate-800 bg-slate-950/80 shadow-2xl shadow-black/20">
          <MapView apiBase={apiBase} />
        </section>

        <div className="space-y-4">
          <AssetDetailPanel />
        </div>
      </main>

      <div className="mx-auto max-w-[1760px] px-4 pb-4">
        <Timeline apiBase={apiBase} />
      </div>
    </div>
  )
}

export default App
