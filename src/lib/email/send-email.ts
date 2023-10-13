import { HpaiCase } from '@prisma/client'
import { createTransport, type SendMailOptions } from 'nodemailer'

export async function sendEmail(hpaiCases: HpaiCase[]) {
  // maybe inject these with function arguments
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { error: 'Email is not implemented' }
  try {
    const data = await transporter.sendMail({
      from: `${userName} ${user}`,
      ...mailOptions,
    })
    return { data }
  } catch (error) {
    return { error }
  }
}
