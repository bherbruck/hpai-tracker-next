import { useLocalStorage } from 'react-use'
import { MailIcon } from '@heroicons/react/outline'
import { type ModalProps, Modal } from './Modal'
import type { User } from '@prisma/client'
import { useState } from 'react'
import { validate as isValidEmail } from 'email-validator'

export const SubscribeModal = (props: ModalProps) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null)
  const [email, setEmail] = useState(user?.email ?? '')

  const subscribe = async () => {
    if (!isValidEmail(email)) return
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    const { user, error } = await res.json()
    if (error) return console.error(error)
    setUser(user)
  }

  const unsubscribe = async () => {
    if (!isValidEmail(email)) return
    const res = await fetch('/api/users', {
      method: 'DELETE',
      body: JSON.stringify({ email }),
    })
    const { error } = await res.json()
    if (error) return console.error(error)
    setUser(null)
    setEmail('')
  }

  return (
    <Modal {...props}>
      <h3 className="font-bold text-lg pb-4">Subscribe (not implemented)</h3>

      <div className="pb-2">
        {user?.active ? (
          <p>
            You are subscribed as <b>{user?.email}</b>
          </p>
        ) : (
          <h4 className="text-md">
            Get email updates when new HPAI cases are added
          </h4>
        )}
      </div>

      <div className="form-control">
        <div className="input-group">
          <span>
            <MailIcon className="h-6 w-6" />
          </span>
          <input
            type="email"
            placeholder="name@domain.com"
            className="input input-bordered flex-1 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="modal-action">
        {user?.active ? (
          <button className="btn" onClick={unsubscribe}>
            Unsubscribe
          </button>
        ) : (
          <button className="btn" onClick={subscribe}>
            Subscribe
          </button>
        )}
      </div>
    </Modal>
  )
}
