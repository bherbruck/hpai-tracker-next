import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet'
import { useLocalStorage } from 'react-use'
import { MapEvents } from './MapEvents'
import type { LeafletEvent } from 'leaflet'
import { HpaiCaseAggregate } from '$lib/types'
import { FC } from 'react'

export type Location = { zoom: number; lat: number; lng: number }

export type HpaiMapProps = {
  hpaiCaseAggregates?: HpaiCaseAggregate[]
  onCountyClick?: (hpaiCaseAggregate: HpaiCaseAggregate) => void
}

export const HpaiMap: FC<HpaiMapProps> = ({
  hpaiCaseAggregates,
  onCountyClick,
}) => {
  const [location, setLocation] = useLocalStorage<Location>('location', {
    lat: 40,
    lng: -90,
    zoom: 5,
  })

  const setMapLocation = ({ target: map }: LeafletEvent) => {
    const { lat, lng } = map.getCenter()
    const zoom = map.getZoom()
    setLocation({ lat, lng, zoom })
  }

  const invalidateSize = ({ target: map }: LeafletEvent) => {
    map.invalidateSize()
  }

  return (
    <MapContainer
      zoomControl={false}
      center={[location?.lat ?? 40, location?.lng ?? -90]}
      zoom={location?.zoom ?? 5}
      className="h-full w-full"
    >
      <MapEvents
        dragend={setMapLocation}
        zoomend={setMapLocation}
        load={invalidateSize}
        layeradd={invalidateSize}
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hpaiCaseAggregates?.map(({ state, county, geoJSON, cases }) => (
        <GeoJSON
          key={JSON.stringify({ state, county })}
          data={geoJSON}
          style={{ color: '#f00' }}
          onEachFeature={(_, layer) => {
            layer.on('click', () =>
              onCountyClick?.({ state, county, geoJSON, cases })
            )
          }}
        >
          <Tooltip direction={'top'} className="rounded-lg" sticky={true}>
            <span className="font-bold text-sm">
              {county} {state}
            </span>
          </Tooltip>
        </GeoJSON>
      ))}
    </MapContainer>
  )
}

export default HpaiMap
