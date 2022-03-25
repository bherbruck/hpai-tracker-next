import { scrapeHpaiCases } from '$lib/scraper'
import { sendEmail } from '$lib/email'
import { prisma } from '$lib/prisma'
import type { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  if (!process.env.API_SECRET_KEY || !process.env.NEXT_PUBLIC_HPAI_CSV_URL)
    return res.status(501).json({ error: 'Email not implemented' })
  const { authorization } = req.headers
  if (!authorization) return res.status(401).json({ error: 'Unauthorized' })
  const [, apiKey] = authorization.split(' ')
  if (apiKey !== process.env.API_SECRET_KEY)
    return res.status(401).json({ error: 'Unauthorized' })

  console.log('refreshing...')

  const hpaiCases = await scrapeHpaiCases(process.env.NEXT_PUBLIC_HPAI_CSV_URL)
  const subscribers = await prisma.user.findMany({ where: { active: true } })

  console.log('refreshed')

  console.log(`sending email to ${subscribers.length} subscribers`)

  if (hpaiCases.length > 0 && subscribers.length > 0) {
    if (!req.headers.host)
      return res.status(500).json({ error: 'Error update email' })

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
