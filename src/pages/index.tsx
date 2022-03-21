import type {
  NextPage,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from 'next'
import Head from 'next/head'
import { Navbar } from '$components/Navbar'
import { Modal } from '$components/Modal'
import { useModal } from '$hooks/useModal'
import { SubscribeModal } from '$components/SubscribeModal'
import { SelectionModal } from '$components/SelectionModal'
import { Map } from '$components/map/ClientSideMap'
import useSWR from 'swr'
import type { HpaiCaseGeometry } from '$lib/types'
import { useState } from 'react'

const Home: NextPage = (props) => {
  const aboutModal = useModal()
  const subscribeModal = useModal()
  const selectionModal = useModal()

  // maybe load this server-side?
  const { data: hpaiCaseGeometries, error } = useSWR<HpaiCaseGeometry[]>(
    '/api/hpai-case-geometry',
    (url: string) => fetch(url).then((r) => r.json())
  )

  const [selectedHpaiCases, setSelectedHpaiCases] = useState<HpaiCaseGeometry>()

  const handleSelection = (hpaiCases: HpaiCaseGeometry) => {
    setSelectedHpaiCases(hpaiCases)
    selectionModal.open()
  }

  return (
    <div className="inset-0 absolute">
      <Head>
        <title>HPAI Tracker</title>
        <meta
          name="description"
          content="A map of all Highly Pathogenic Avian Influenza (HPAI) cases confirmed by USDA APHIS"
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Navbar
        onAboutClick={() => aboutModal.open()}
        onSubscribeClick={() => subscribeModal.open()}
      />

      <Modal {...aboutModal}>
        <h3 className="font-bold text-lg pb-4">About</h3>
        <p>
          HPAI Tracker is a free tool to map the locations of HPAI cases in the
          United States by county. Click on a county to see the cases in the
          selected county.
        </p>
      </Modal>

      <SubscribeModal {...subscribeModal} />

      <SelectionModal {...selectionModal} hpaiCases={selectedHpaiCases} />

      <div className="h-full w-full">
        <Map
          hpaiCaseGeometries={hpaiCaseGeometries}
          onCountyClick={handleSelection}
        />
      </div>
    </div>
  )
}

export default Home
