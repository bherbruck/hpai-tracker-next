import dynamic from 'next/dynamic'

export const Map = dynamic(() => import('./HpaiMap'), { ssr: false })
