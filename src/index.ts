import { Telegraf } from 'telegraf'
import { checkAndNotify } from './checkWaves'

const { TOKEN } = process.env

if (!TOKEN) {
  console.error('Missing token')
  process.exit(1)
}

const bot = new Telegraf(TOKEN)

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

launchBot()

export default function handler(_: any, res: any) {
  res.status(200).send('Bot is running')
}
