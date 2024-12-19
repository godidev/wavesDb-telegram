import { Telegraf } from 'telegraf'
import { checkAndNotify } from './checkWaves'

const { TOKEN } = process.env

if (!TOKEN) {
  console.error('Missing token')
  process.exit(1)
}

const bot = new Telegraf(TOKEN)

bot
  .launch()
  .then(() => {
    console.log('Bot iniciado')
  })
  .catch((err) => {
    console.error('Error al iniciar el bot', err)
  })

bot.command('lastbuoys', async (ctx) => {
  const chatId = ctx.chat.id
  await checkAndNotify(chatId, bot)
})
