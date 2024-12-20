import axios from 'axios'
import { Context, Telegraf } from 'telegraf'
import { formatedBuoys, BuoyDataKeys } from './types'

const obtenerDatosOlas = async () => {
  try {
    const response = await axios.get('https://wave-db.vercel.app/buoys')
    return response.data as Promise<formatedBuoys[]>
  } catch (error) {
    console.error('Error al obtener los datos de la API', error)
    return null
  }
}

const verificarCondiciones = (data: any) => {
  const umbralOla = 3
  return data
}

export const updateData = async (chatId: number, bot: Telegraf<Context>) => {
  const response = await axios.get('https://wave-db.vercel.app/scrape')
  if (response.status === 200) {
    await bot.telegram.sendMessage(chatId, 'Datos actualizados')
  } else {
    await bot.telegram.sendMessage(chatId, 'Error al actualizar los datos')
  }
}

export const checkAndNotify = async (
  chatId: number,
  bot: Telegraf<Context>,
) => {
  const datosOlas = await obtenerDatosOlas()

  if (datosOlas) {
    const datosLimpios = formatTable(datosOlas)
    await bot.telegram.sendMessage(chatId, '```' + datosLimpios + '```', {
      parse_mode: 'MarkdownV2',
    })
  }

  if (datosOlas && verificarCondiciones(datosOlas)) {
    return datosOlas
  }
}

const formatTable = (data: formatedBuoys[]) => {
  let table = ' Hora | Periodo | Altura | Direcc | Periodo '
  table += '--------------------------------------------'
  for (const hour in data) {
    const { datos, fecha } = data[hour]
    const hora = fecha.slice(11, 16)
    table += `\n${centerText(hora, 4)}`
    for (const [key, value] of Object.entries(datos)) {
      let formattedValue = value.toString()
      if (key == BuoyDataKeys.DireccPicoProced) continue
      if (
        key === BuoyDataKeys.PeriodoPico ||
        key === BuoyDataKeys.PeriodoMedioTm02
      ) {
        formattedValue += 's'
      } else if (key === BuoyDataKeys.AlturaSignifOleaje) {
        formattedValue += 'm'
      }
      const wordLength = key.split(' ')[0].length
      table += `|${centerText(formattedValue, wordLength)}`
    }
  }
  return table
}

const centerText = (text: string, width: number) => {
  const totalPadding = width + 2 - text.length
  const leftPadding = Math.floor(totalPadding / 2)
  const rightPadding = totalPadding - leftPadding

  return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding)
}
