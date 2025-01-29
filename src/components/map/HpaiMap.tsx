import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet'
import { useLocalStorage } from 'react-use'
import { MapEvents } from './MapEvents'
import { LeafletEvent, Map } from 'leaflet'
import { HpaiCase, HpaiCaseGeometry } from '$lib/types'
import { type FC, useEffect, useState } from 'react'
import { dateDiff } from '$lib/date'

export type Location = { zoom: number; lat: number; lng: number }

export type HpaiMapProps = {
  hpaiCaseGeometries?: HpaiCaseGeometry[]
  onCountyClick?: (hpaiCaseGeometry: HpaiCaseGeometry) => void
  theme?: 'light' | 'dark'
}

const areAllCasesReleased = (hpaiCases: HpaiCase[]) =>
  hpaiCases.every((caseData) => caseData.dateReleased)

const hasNewCases = (hpaiCases: HpaiCase[]) =>
  hpaiCases.some(
    (caseData) => dateDiff(caseData.dateConfirmed, new Date()) <= 7,
  )

const computeCountyColor = (hpaiCases: HpaiCase[]) => {
  return hasNewCases(hpaiCases)
    ? 'var(--color-warning)'
    : areAllCasesReleased(hpaiCases)
      ? 'var(--color-accent)'
      : 'var(--color-error)'
}

export const HpaiMap: FC<HpaiMapProps> = ({
  hpaiCaseGeometries,
  onCountyClick,
  theme = 'light',
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

  const [isRefreshing, setIsRefreshing] = useState(false)

  // hack to force refresh on map
  // TileLayer.className does not update reactively(?)
  useEffect(() => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1)
  }, [theme])

  const invalidateSize = ({ target: map }: { target: Map }) => {
    map.invalidateSize()
  }

  return (
    <MapContainer
      zoomControl={false}
      center={[location?.lat ?? 40, location?.lng ?? -90]}
      zoom={location?.zoom ?? 5}
      className="h-full w-full bg-base-300"
      worldCopyJump={true}
      attributionControl={false}
    >
      <MapEvents
        dragend={setMapLocation}
        zoomend={setMapLocation}
        load={invalidateSize}
        layeradd={invalidateSize}
      />
      {!isRefreshing && (
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={theme === 'dark' ? 0.25 : 1}
          className={
            theme === 'dark'
              ? `invert brightness-[0.75] contrast-[3] hue-rotate-[200deg] saturate-[0.1]`
              : ''
          }
        />
      )}
      <div className="absolute bottom-0 right-0 z-[1000] bg-base-100 bg-opacity-50 opacity-75 px-1">
        &copy;{' '}
        <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>{' '}
        contributors
      </div>
      {hpaiCaseGeometries?.map(({ state, county, geoJSON, cases }) => (
        <GeoJSON
          key={JSON.stringify({ state, county })}
          data={geoJSON}
          style={{
            color: computeCountyColor(cases),
          }}
          onEachFeature={(_, layer) => {
            layer.on('click', () =>
              onCountyClick?.({ state, county, geoJSON, cases }),
            )
          }}
        >
          <Tooltip
            direction={'top'}
            className="rounded-lg bg-base-100 border-0"
            opacity={1}
            sticky={true}
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
