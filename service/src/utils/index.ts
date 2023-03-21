import * as nodemailer from 'nodemailer'

interface SendResponseOptions {
  type: 'Success' | 'Fail'
  message?: string
  data?: any
}

export function sendResponse(options: SendResponseOptions) {
  if (options.type === 'Success') {
    return Promise.resolve({
      message: options.message ?? null,
      data: options.data ?? null,
      status: options.type,
    })
  }

  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({
    message: options.message ?? 'Failed',
    data: options.data ?? null,
    status: options.type,
  })
}

export function sendRandomNumberToEmail(targetEmail: string) {
  // 生成6位随机数
  const randomNumber = Math.floor(100000 + Math.random() * 900000)

  // 配置邮件发送器
  const transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true,
    auth: {
      user: '18829526908@163.com',
      pass: 'ULCVGXJLNWWYTAXH',
    },
  })

  // 配置邮件内容
  const mailOptions = {
    from: '18829526908@163.com',
    to: targetEmail,
    subject: 'Your random number',
    text: `Your random number is ${randomNumber}.`,
  }

  // 发送邮件
  transporter.sendMail(mailOptions, (error, info) => {
    if (error)
      console.log('Error occurred:', error)

    else
      console.log('Email sent:', info.response)
  })
}
