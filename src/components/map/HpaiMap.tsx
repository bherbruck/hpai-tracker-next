import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet'
import { useLocalStorage } from 'react-use'
import { MapEvents } from './MapEvents'
import type { LeafletEvent } from 'leaflet'
import { HpaiCaseGeometry } from '$lib/types'
import { FC } from 'react'
import { useThemeDetector } from '$hooks/useThemeDetector'

export type Location = { zoom: number; lat: number; lng: number }

export type HpaiMapProps = {
  hpaiCaseGeometries?: HpaiCaseGeometry[]
  onCountyClick?: (hpaiCaseGeometry: HpaiCaseGeometry) => void
}

export const HpaiMap: FC<HpaiMapProps> = ({
  hpaiCaseGeometries,
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

  const { isDarkTheme } = useThemeDetector()

  return (
    <MapContainer
      zoomControl={false}
      center={[location?.lat ?? 40, location?.lng ?? -90]}
      zoom={location?.zoom ?? 5}
      className="h-full w-full bg-base-300"
      worldCopyJump={true}
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
        opacity={isDarkTheme ? 0.25 : 1}
        className={
          isDarkTheme
            ? `invert brightness-[0.75] contrast-[3] hue-rotate-[200deg] saturate-[0.1]`
            : ''
        }
      />
      {hpaiCaseGeometries?.map(({ state, county, geoJSON, cases }) => (
        <GeoJSON
          key={JSON.stringify({ state, county })}
          data={geoJSON}
          style={{
            color: `hsl(var(--er))`,
          }}
          onEachFeature={(_, layer) => {
            layer.on('click', () =>
              onCountyClick?.({ state, county, geoJSON, cases })
            )
          }}
        >
          <Tooltip
            direction={'top'}
            className="rounded-lg bg-base-100 border-0"
            opacity={1}
          >
            <span className="font-bold text-sm text-base-content">
              {county} {state}
            </span>
          </Tooltip>
        </GeoJSON>
      ))}
    </MapContainer>
  )
}

export default HpaiMap
