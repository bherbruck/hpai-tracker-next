import dynamic from 'next/dynamic'

export const ClientSideMap = dynamic(() => import('./HpaiMap'), { ssr: false })
