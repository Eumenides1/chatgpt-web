import express from 'express'
import type { ChatContext, ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess } from './chatgpt'
import { auth } from './middleware/auth'
import { sendRandomNumberToEmail } from './utils/index'

const app = express()
const router = express.Router()

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process', auth, async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  try {
    const { prompt, options = {} } = req.body as { prompt: string; options?: ChatContext }
    let firstChunk = true
    await chatReplyProcess(prompt, options, (chat: ChatMessage) => {
      res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
      firstChunk = false
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/config', async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/sendEmail', async (req, res) => {
  sendRandomNumberToEmail('1763077056@qq.com')
  // 这里自行添加发送邮寄逻辑
  res.send({ status: 'Success', message: '尊敬的用户，您当前正在注册或登录网站，验证码为：849273，有效期为 10 分钟', data: { } })
})

app.use('', router)
app.use('/api', router)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
