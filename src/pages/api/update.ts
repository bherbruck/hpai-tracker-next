import { scrapeHpaiCases } from '$lib/scraper'
import { sendEmail } from '$lib/email'
import { prisma } from '$lib/prisma'
import type { NextApiHandler } from 'next'

type UpdatePayload = {
  url: string
  shouldNotify?: boolean | string
}

const handler: NextApiHandler = async (req, res) => {
  if (!process.env.API_SECRET_KEY)
    return res.status(501).json({ error: 'Update not implemented' })
  const { authorization } = req.headers
  if (!authorization) return res.status(401).json({ error: 'Unauthorized' })
  const [, apiKey] = authorization.split(' ')
  if (apiKey !== process.env.API_SECRET_KEY)
    return res.status(401).json({ error: 'Unauthorized' })

  const { url, shouldNotify } = req.body as UpdatePayload
  if (!url) return res.status(400).json({ error: 'Missing url' })

  console.log('refreshing...')

  const hpaiCases = await scrapeHpaiCases(url)
  const subscribers = await prisma.user.findMany({ where: { active: true } })

  console.log('refreshed')

  if (
    String(shouldNotify) === 'true' &&
    hpaiCases.length > 0 &&
    subscribers.length > 0
  ) {
    if (!req.headers.host)
      return res.status(500).json({ error: 'Could not determine hostname' })

    console.log(`sending email to ${subscribers.length} subscribers`)

    // TODO: find a way to figure out http or https
    const homeUrl = `http://${req.headers.host}`

    const newCasesCount = hpaiCases.length

    const subject = `${newCasesCount} new HPAI case${
      newCasesCount > 1 ? 's' : ''
    }`

    const { error } = await sendEmail({
      bcc: subscribers.map((s) => s.email),
      subject,
      html: `
      <p>
        ${subject}
      </p>
      <p>
        <a href="${homeUrl}">
          Go to the map
        </a>
      </p>
    `,
    })

    if (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error sending confirmation email' })
    }
  }

  return res.json({
    message: 'refreshed',
    newCases: hpaiCases,
  })
}

export default handler
