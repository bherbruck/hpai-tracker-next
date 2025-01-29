import type { HpaiCase } from '$lib/types'
import { FC } from 'react'
import { HpaiCaseTable } from '../HpaiCaseTable'
import * as React from 'react'

type AlertEmailProps = {
  websiteUrl: string
  hpaiCases: HpaiCase[]
}

export const AlertEmail: FC<Readonly<AlertEmailProps>> = ({
  websiteUrl,
  hpaiCases,
}) => (
  <div className="h-full w-full">
    <h3>{hpaiCases.length} new HPAI cases</h3>
    <p>
      See them on the map <a href={websiteUrl}>here</a>
    </p>
    <HpaiCaseTable hpaiCases={hpaiCases} />
    {/* unsubscribe */}
    <p>
      You are receiving this email because you have subscribed to HPAI alerts
      from the HPAI Alert website.
    </p>
    <p>
      To unsubscribe, click the following link:{' '}
      <a href={`${websiteUrl}/unsubscribe`}>Unsubscribe</a>
    </p>
  </div>
)
