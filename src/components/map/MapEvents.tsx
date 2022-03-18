import { useMapEvents } from 'react-leaflet'

export type LeafletEventHandlerFnMap = Parameters<typeof useMapEvents>[0]

export const MapEvents = (handlers: LeafletEventHandlerFnMap) => {
  useMapEvents(handlers)

  return <></>
}
