import { useEffect, useState } from 'react'

export function useScenario(apiBase) {
  const [scenario, setScenario] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSpec() {
      try {
        const response = await fetch(`${apiBase}/spec`)
        if (!response.ok) throw new Error('Unable to load scenario spec')
        setScenario(await response.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadSpec()
  }, [apiBase])

  return { scenario, loading, error }
}
