import { methodHandler, errorResponse } from '$lib/method-handler'
import { scrapeHpaiCases } from '$lib/scraper'
import type { NextApiHandler } from 'next'

const get: NextApiHandler = async (req, res) => {
  if (!process.env.API_SECRET_KEY || !process.env.NEXT_PUBLIC_HPAI_CSV_URL)
    return errorResponse(res, 501)
  const { authorization } = req.headers
  if (!authorization) return errorResponse(res, 401)
  const [, apiKey] = authorization.split(' ')
  if (apiKey !== process.env.API_SECRET_KEY) return errorResponse(res, 401)

  console.log('refreshing...')

  const hpaiCases = await scrapeHpaiCases(process.env.NEXT_PUBLIC_HPAI_CSV_URL)

  console.log('refreshed')

  return res.json({
    message: 'refreshed',
    newCases: hpaiCases,
  })
}

export default methodHandler({ get })
