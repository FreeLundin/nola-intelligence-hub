import create from 'zustand'

const useScenarioStore = create((set) => ({
  spec: null,
  hour: 0,
  viewMode: 'HYBRID',
  selectedFeature: null,
  hoverInfo: null,
  layerVisibility: {},
  viewState: null,
  setSpec: (spec) => set({
    spec,
    viewState: {
      longitude: spec.center[0],
      latitude: spec.center[1],
      zoom: spec.zoom || 13,
      pitch: 45,
      bearing: 0
    },
    layerVisibility: spec.layers.reduce(
      (acc, layer) => ({ ...acc, [layer.id]: layer.initialVisibility ?? true }),
      {}
    )
  }),
  setHour: (hour) => set({ hour }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setViewState: (viewState) => set({ viewState }),
  toggleLayer: (layerId) => set((state) => ({ layerVisibility: { ...state.layerVisibility, [layerId]: !state.layerVisibility[layerId] } })),
  selectFeature: (feature) => set({ selectedFeature: feature }),
  setHoverInfo: (hoverInfo) => set({ hoverInfo })
}))

export default useScenarioStore
