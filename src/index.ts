import { Telegraf } from 'telegraf'
import express from 'express'
import { checkAndNotify, updateData } from './checkWaves'

const { TOKEN, TELEGRAM_WEBHOOK_URL, PORT = 3000, SECRET_PATH } = process.env

if (!TOKEN || !TELEGRAM_WEBHOOK_URL) {
  console.error('Missing Telegram token or webhook URL')
  process.exit(1)
}

const bot = new Telegraf(TOKEN)
const app = express()

bot.telegram.setWebhook(`${TELEGRAM_WEBHOOK_URL}/${SECRET_PATH}`)
app.use(bot.webhookCallback(`/${SECRET_PATH}`))

async function launchBot() {
  try {
    await bot.launch()
    console.log('Bot iniciado')
  } catch (err) {
    console.error('Error al iniciar el bot', err)
    process.exit(1)
  }
}

bot.command('lastbuoys', async (ctx) => {
  const chatId = ctx.chat.id
  await checkAndNotify(chatId, bot)
})

bot.command('update', async (ctx) => {
  const chatId = ctx.chat.id
  try {
    await updateData(chatId, bot)
  } catch (error) {
    console.error('Error al actualizar los datos', error)
  }
})

launchBot()

export default function handler(_: any, res: any) {
  res.status(200).send('Bot is running')
}

app.listen(PORT, () => {
  console.log(`Bot is running at port ${process.env.PORT}`)
})
