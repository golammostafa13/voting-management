import nodemailer from 'nodemailer'

export const sendEmail = async (data: {
  to: string
  subject: string
  html?: string
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: 'gmail',
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === '1',
      auth: {
        user: process.env.EMAIL_USER_NAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: data.to,
      subject: data.subject,
      html: data.html ?? '',
    }

    await transporter.sendMail(mailOptions)
    console.log('email sent successfully')
  } catch (error) {
    console.log(error, 'email not sent')
    throw error;
  }
}
