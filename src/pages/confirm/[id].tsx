import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import useSWR from 'swr'
import type { User } from '@prisma/client'

const Confirm: NextPage = (props) => {
  // maybe user server-side props for this
  const router = useRouter()
  const { id } = router.query

  const { data, error } = useSWR<{ user: User }>(
    `/api/confirm/${id}`,
    (url: string) => fetch(url).then((r) => r.json())
  )

  return (
    <>
      <Head>
        <title>Confirm</title>
      </Head>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            {data?.user ? (
              <>
                <h1 className="text-5xl font-bold">Confirmed!</h1>
                <p className="py-6">
                  You will receive email updates at <b>{data?.user.email}</b>
                  &nbsp;when new HPAI cases are added.
                </p>
                <p className="py-6">It is safe close this tab.</p>
              </>
            ) : (
              <>
                <h1 className="text-5xl font-bold">Whoops!</h1>
                <p className="py-6">Something isn&apos;t right here.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Confirm
