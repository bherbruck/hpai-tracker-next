import { scrapeHpaiCases } from '$lib/scraper'
import { Resend } from 'resend'
import { prisma } from '$lib/prisma'
import type { NextApiHandler } from 'next'
import { AlertEmail } from '$components/email/alert-email'

const TABLEAU_BASE_URL =
  process.env.TABLEAU_BASE_URL ?? 'https://publicdashboards.dl.usda.gov'
const TABLEAU_DASHBOARD_ROUTE =
  process.env.TABLEAU_DASHBOARD_ROUTE ??
  '/t/MRP_PUB/views/VS_Avian_HPAIConfirmedDetections2022/HPAI2022ConfirmedDetections'

const KEYS = [process.env.API_SECRET_KEY, process.env.CRON_SECRET].filter(
  (key) => key != undefined,
) as string[]

const handler: NextApiHandler = async (req, res) => {
  const { authorization } = req.headers
  console.log({ authorization })
  if (!authorization) return res.status(401).json({ error: 'Unauthorized' })

  const [, apiKey] = authorization.split(' ')
  console.log({ apiKey })
  if (!KEYS.includes(apiKey))
    return res.status(401).json({ error: 'Unauthorized' })

  const { notify } = req.query

  const shouldNotify = notify === 'true'

  console.log({ shouldNotify })

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey && shouldNotify) return { error: 'Email not implemented' }

  const baseUrl = process.env.TABLEAU_BASE_URL ?? TABLEAU_BASE_URL
  const dashboardRoute =
    process.env.TABLEAU_DASHBOARD_ROUTE ?? TABLEAU_DASHBOARD_ROUTE

  console.log('refreshing...')

  const { newHpaiCases, deletedHpaiCaseNames } = await scrapeHpaiCases(
    baseUrl,
    dashboardRoute,
  )
  const subscribers = await prisma.user.findMany({ where: { active: true } })

  console.log('refreshed')

  if (
    String(shouldNotify) === 'true' &&
    newHpaiCases.length > 0 &&
    subscribers.length > 0
  ) {
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
    try {
      // @ts-ignore
      const r = await resend.emails.send({
        from: 'HPAI Tracker <no-reply@hpai-tracker.com>',
        to: ['no-reply@hpai-tracker.com'],
        bcc: subscriberEmails,
        subject: subject,
        react: AlertEmail({
          websiteUrl: websiteUrl,
          hpaiCases: newHpaiCases,
        }),
      })

      console.log(`email sent: ${r.id}`)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Could not send email' })
    }
  }

  return res.json({
    message: 'refreshed',
    newCases: newHpaiCases,
    deletedCases: deletedHpaiCaseNames,
  })
}

export default handler
