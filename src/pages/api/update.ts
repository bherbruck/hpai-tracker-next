import { scrapeHpaiCases } from '$lib/scraper'
import { Resend } from 'resend'
import { prisma } from '$lib/prisma'
import type { NextApiHandler } from 'next'
import { AlertEmail } from '$components/email/alert-email'

const TABLEAU_BASE_URL =
  process.env.TABLEAU_BASE_URL ??
  'https://publicdashboards.dl.usda.gov/vizql/t/MRP_PUB/w/VS_Avian_HPAIConfirmedDetections2022/v/HPAI2022ConfirmedDetections'

const MAX_BCC = 49

const KEYS = [process.env.API_SECRET_KEY, process.env.CRON_SECRET].filter(
  (key) => key != undefined,
) as string[]

const handler: NextApiHandler = async (req, res) => {
  console.log(req.headers)
  const { authorization } = req.headers
  if (!authorization) return res.status(403).json({ error: 'Forbidden' })

  const [, apiKey] = authorization.split(' ')
  if (!KEYS.includes(apiKey))
    return res.status(401).json({ error: 'Unauthorized' })

  const { notify } = req.query

  const shouldNotify = notify === 'true'

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey && shouldNotify) return { error: 'Email not implemented' }

  const baseUrl = process.env.TABLEAU_BASE_URL ?? TABLEAU_BASE_URL

  console.log('refreshing...')

  const { newHpaiCases, deletedHpaiCaseNames } = await scrapeHpaiCases(baseUrl)
  const subscribers = await prisma.user.findMany({ where: { active: true } })

  console.log('refreshed')

  if (shouldNotify && newHpaiCases.length > 0 && subscribers.length > 0) {
    if (!req.headers.host)
      return res.status(500).json({ error: 'Could not determine hostname' })

    console.log(`sending email to ${subscribers.length} subscribers`)

    // TODO: find a way to figure out http or https, maybe use env var
    const websiteUrl = `http://${req.headers.host}`

    const newCasesCount = newHpaiCases.length

    const subject = `${newCasesCount} new HPAI case${
      newCasesCount > 1 ? 's' : ''
    }`

    const subscriberEmails = subscribers.map((subscriber) => subscriber.email)

    const resend = new Resend(resendApiKey)

    const emailBatches = Array.from(
      { length: Math.ceil(subscriberEmails.length / MAX_BCC) },
      (_, index) =>
        subscriberEmails.slice(index * MAX_BCC, (index + 1) * MAX_BCC),
    )

    // Send emails for each chunk of subscribers using Promise.all
    await Promise.all(
      emailBatches.map(async (chunk) => {
        try {
          // @ts-ignore
          const r = await resend.emails.send({
            from: 'HPAI Tracker <no-reply@hpai-tracker.com>',
            to: ['no-reply@hpai-tracker.com'],
            bcc: chunk, // Use the current chunk of subscribers
            subject: subject,
            react: AlertEmail({
              websiteUrl: websiteUrl,
              hpaiCases: newHpaiCases,
            }),
          })

          console.log(`email sent: ${r.id}`)
        } catch (error) {
          console.error(error)
          throw new Error('Could not send email')
        }
      }),
    )
  }

  return res.json({
    message: 'refreshed',
    newCases: newHpaiCases,
    deletedCases: deletedHpaiCaseNames,
  })
}

export default handler
