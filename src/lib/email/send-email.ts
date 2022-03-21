import { createTransport, type SendMailOptions } from 'nodemailer'

export async function sendEmail(
  mailOptions: Omit<SendMailOptions, 'from'>,
  userName: string = 'HPAI Tracker'
) {
  // maybe inject these with function arguments
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS
  const accessToken = process.env.EMAIL_API_KEY
  if (!user || !pass || !accessToken)
    return { error: 'Email is not implemented' }
  try {
    const transporter = createTransport({
      service: 'gmail',
      auth: { user, pass, accessToken },
    })

    const data = await transporter.sendMail({
      from: `${userName} ${user}`,
      ...mailOptions,
    })
    return { data }
  } catch (error) {
    return { error }
  }
}
