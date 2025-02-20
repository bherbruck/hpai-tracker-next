import { EnvelopeIcon } from '@heroicons/react/24/outline'
import type { User } from '@prisma/client'
import clsx from 'clsx'
import { useState } from 'react'
import { useLocalStorage } from 'react-use'
import { type ModalProps, Modal } from './Modal'

export const SubscribeModal = (props: ModalProps) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null)
  const [email, setEmail] = useState(user?.email ?? '')
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // TODO: get the user from the server if in local storage
  //       to check if confirmed

  const subscribe = async () => {
    setError(null)
    setIsLoading(true)
    const res = await fetch(`/api/subscribe`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    const { user, error } = await res.json()
    setIsLoading(false)
    if (error) return setError(error)
    setUser(user)
  }

  const unsubscribe = async () => {
    setError(null)
    setIsLoading(true)
    const res = await fetch(`/api/unsubscribe`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    const { error } = await res.json()
    setIsLoading(false)
    if (error) {
      setError(error)
      setUser(null)
      return
    }
    setUser(null)
  }

  return (
    <Modal {...props}>
      <h3 className="font-bold text-lg pb-4">Subscribe</h3>

      <div className="pb-2">
        {user?.email ? (
          <>
            <p>
              You are subscribed as <b>{user?.email}</b>
            </p>
            <p>Check your email to confirm.</p>
          </>
        ) : (
          <h4 className="text-md">
            Get email notifications when new HPAI cases are added
          </h4>
        )}
      </div>

      <div className="form-control">
        <label className="floating-label">
          <span>Email</span>
          <input
            required
            type="email"
            placeholder="name@domain.com"
            className={clsx(
              'input validator input-bordered flex-1 w-full',
              { 'input-error': error },
              { 'input-disabled': user?.email },
            )}
            disabled={!!user?.email}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setIsValidEmail(e.target.checkValidity())
            }}
          />
        </label>

        <div className="label">
          <span className="label-text-alt text-error">
            {error ? error : ''}
          </span>
          <a
            className="label-text-alt link"
            href="/privacy-policy"
            target="_blank"
            rel="noreferrer noopener"
          >
            Privacy Policy
          </a>
        </div>
      </div>

      <div className="modal-action">
        {user?.email ? (
          <button
            className={clsx('btn', { loading: isLoading })}
            onClick={unsubscribe}
          >
            Unsubscribe
          </button>
        ) : (
          <button
            className={clsx('btn', { loading: isLoading })}
            disabled={!isValidEmail}
            onClick={subscribe}
          >
            Subscribe
          </button>
        )}
      </div>
    </Modal>
  )
}
