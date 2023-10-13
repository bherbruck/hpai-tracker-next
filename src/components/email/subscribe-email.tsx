import type { FC } from 'react'

export type SubscribeEmailProps = {
  confirmationUrl: string
}

export const SubscribeEmail: FC<Readonly<SubscribeEmailProps>> = ({
  confirmationUrl,
}) => (
  <div>
    <h3>Subscribe to HPAI alerts</h3>
    <p>
      You are receiving this email because you have subscribed to HPAI alerts
      from the HPAI Tracker website.
    </p>
    <p>
      To confirm your subscription, please click the following link:{' '}
      <a href={confirmationUrl}>{confirmationUrl}</a>
    </p>
  </div>
)
