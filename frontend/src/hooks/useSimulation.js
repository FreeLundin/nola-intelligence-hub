import { useEffect, useState } from 'react'

export function usePumpTelemetry(apiBase) {
  const [telemetry, setTelemetry] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const response = await fetch(`${apiBase}/telemetry/pumps`)
        if (!response.ok) throw new Error('Telemetry request failed')
        const payload = await response.json()
        if (mounted) setTelemetry(payload.telemetry)
      } catch (err) {
        if (mounted) setTelemetry([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 5000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [apiBase])

  return { telemetry, loading }
}
