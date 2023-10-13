import type { User } from '@prisma/client'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { XCircleIcon } from '@heroicons/react/24/outline'

const unsubscribe = async (
  url: string,
  { arg }: { arg: { email: string } },
) => {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  })

  if (!res.ok) throw await res.json()

  return res.json()
}

const Unsubscribe: NextPage = (props) => {
  const [email, setEmail] = useState('')
  const { trigger, data, error, isMutating } = useSWRMutation<
    { user: User },
    { error: string },
    '/api/unsubscribe',
    { email: string }
  >('/api/unsubscribe', unsubscribe, { throwOnError: false })

  return (
    <>
      <Head>
        <title>Unsubscribe</title>
      </Head>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md flex flex-col gap-2">
            {!data?.user ? (
              <>
                <h1 className="text-5xl mb-5 font-bold">Unsubscribe</h1>
                <p>Please enter your email below</p>
                <input
                  className="input input-bordered"
                  placeholder="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  disabled={isMutating}
                  onClick={() => trigger({ email })}
                >
                  {isMutating ? (
                    <span className="loading loading-spinner" />
                  ) : (
                    'Unsubscribe'
                  )}
                </button>
                {error && (
                  <div className="alert alert-error">
                    <XCircleIcon className="h-6 w-6" />
                    <span>{error.error}</span>
                  </div>
                )}
              </>
            ) : (
              <h1 className="text-5xl font-bold">Unsubscribed</h1>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Unsubscribe
