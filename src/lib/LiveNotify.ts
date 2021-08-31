import { embedMessageBuilder } from './MessageEmbed'
import type { SendEmbed } from '../lib/MessageEmbed'

export const preparedMessage = (payload: { [k: string]: any }): SendEmbed => {
  console.log(JSON.stringify(payload))
  const embedMessage = embedMessageBuilder([
    {
      name: 'Game',
      value: payload.game_name,
      inline: true
    },
    {
      name: 'Viewers',
      value: payload.viewers.toString(),
      inline: true
    }
  ])
  embedMessage
    .setTitle(payload.title)
    .setURL(`https://www.twitch.tv/${payload.user_name.toLowerCase()}`)
    .setAuthor(payload.user_name, payload.profile)
    .setThumbnail(payload.profile)
  console.log(embedMessage)
  return {
    content: `ทุกโคนน @everyone, ${
      payload.user_name
    } เค้าไลฟ์อยู่นะ>> https://www.twitch.tv/${payload.user_name.toLowerCase()}`,
    embeds: [embedMessage]
  }
}
