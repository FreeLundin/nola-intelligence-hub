import { useEffect, useMemo, useState } from 'react'
import DeckGL from '@deck.gl/react'
import { FlyToInterpolator } from '@deck.gl/core'
import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers'
import { StaticMap } from 'react-map-gl'
import useScenarioStore from '../store/useScenarioStore'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''

function MapView({ apiBase }) {
  const spec = useScenarioStore((state) => state.spec)
  const hour = useScenarioStore((state) => state.hour)
  const layerVisibility = useScenarioStore((state) => state.layerVisibility)
  const viewMode = useScenarioStore((state) => state.viewMode)
  const viewState = useScenarioStore((state) => state.viewState)
  const setViewState = useScenarioStore((state) => state.setViewState)
  const selectFeature = useScenarioStore((state) => state.selectFeature)
  const setHoverInfo = useScenarioStore((state) => state.setHoverInfo)

  const [pumpData, setPumpData] = useState(null)
  const [drainageData, setDrainageData] = useState(null)
  const [floodData, setFloodData] = useState(null)

  useEffect(() => {
    async function fetchLayer(layerId, hourParam) {
      const url = new URL(`${apiBase}/layers/${layerId}`, window.location.href)
      if (hourParam != null) url.searchParams.set('hour', String(hourParam))
      const response = await fetch(url.toString())
      if (!response.ok) return null
      return response.json()
    }

    fetchLayer('pump_stations').then(setPumpData)
    fetchLayer('drainage_network').then(setDrainageData)
    fetchLayer('flood_extent', hour).then(setFloodData)
  }, [apiBase, hour])

  useEffect(() => {
    if (pumpData?.features?.length) {
      const selected = pumpData.features.find((d) => d.properties?.status === 'failed')
      if (selected) {
        const [lng, lat] = selected.geometry.coordinates
        setViewState({
          longitude: lng,
          latitude: lat,
          zoom: 15.2,
          pitch: 55,
          bearing: 0,
          transitionDuration: 1300,
          transitionInterpolator: new FlyToInterpolator()
        })
      }
    }
  }, [pumpData, setViewState])

  const mapStyle = useMemo(() => {
    if (viewMode === 'SATELLITE') return 'mapbox://styles/mapbox/satellite-streets-v12'
    if (viewMode === 'X-RAY') return 'mapbox://styles/mapbox/dark-v10'
    return 'mapbox://styles/mapbox/dark-v10'
  }, [viewMode])

  const layers = useMemo(() => {
    const rendered = []
    if (drainageData && layerVisibility.drainage_network) {
      rendered.push(
        new GeoJsonLayer({
          id: 'drainage-layer',
          data: drainageData,
          pickable: false,
          stroked: true,
          filled: false,
          getLineColor: [0, 255, 255],
          getLineWidth: 3,
          opacity: viewMode === 'X-RAY' ? 1 : 0.85
        })
      )
    }
    if (pumpData && layerVisibility.pump_stations) {
      rendered.push(
        new ScatterplotLayer({
          id: 'pumps-layer',
          data: pumpData.features,
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 200],
          getPosition: (d) => d.geometry.coordinates,
          getFillColor: (d) => {
            const status = d.properties.status
            if (status === 'failed') return [255, 40, 85]
            if (status === 'warning') return [255, 165, 45]
            return [84, 255, 173]
          },
          getRadius: 160,
          radiusMinPixels: 10,
          radiusMaxPixels: 24,
          onClick: ({ object }) => object && selectFeature(object),
          onHover: ({ x, y, object }) => {
            if (object) {
              setHoverInfo({ x, y, object })
            } else {
              setHoverInfo(null)
            }
          }
        })
      )
    }
    if (floodData && layerVisibility.flood_extent) {
      rendered.push(
        new GeoJsonLayer({
          id: 'flood-layer',
          data: floodData,
          pickable: false,
          stroked: true,
          filled: true,
          getFillColor: [14, 110, 255, viewMode === 'X-RAY' ? 100 : 160],
          getLineColor: [35, 95, 255],
          getLineWidth: 2,
          opacity: viewMode === 'X-RAY' ? 0.75 : 0.45
        })
      )
    }
    return rendered
  }, [drainageData, pumpData, floodData, layerVisibility, viewMode, selectFeature, setHoverInfo])

  const hoverInfo = useScenarioStore((state) => state.hoverInfo)

  return (
    <div className="relative h-[75vh] w-full overflow-hidden rounded-[40px] bg-slate-950">
      <DeckGL
        viewState={viewState}
        controller={true}
        onViewStateChange={({ viewState: nextViewState }) => setViewState(nextViewState)}
        layers={layers}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      >
        <StaticMap reuseMaps mapStyle={mapStyle} mapboxApiAccessToken={MAPBOX_TOKEN} />
      </DeckGL>

      <div className="absolute left-4 top-4 rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-3 text-sm text-slate-200 shadow-2xl shadow-black/40">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Operational View</div>
        <div className="mt-1 text-lg font-semibold">Hour: {hour}</div>
      </div>

      {hoverInfo?.object && (
        <div
          style={{ left: hoverInfo.x + 16, top: hoverInfo.y + 16 }}
          className="absolute z-20 rounded-3xl border border-slate-700 bg-slate-950/95 p-3 text-xs text-white shadow-2xl shadow-black/50"
        >
          <div className="font-semibold">{hoverInfo.object.properties.name}</div>
          <div className="mt-1 text-slate-400">ID: {hoverInfo.object.properties.pump_id}</div>
          <div className="mt-1 text-slate-300">Status: {hoverInfo.object.properties.status}</div>
        </div>
      )}
    </div>
  )
}

export default MapView
