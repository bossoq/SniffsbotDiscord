import { embedMessageBuilder } from './MessageEmbed'
import type { SendEmbed } from '../lib/MessageEmbed'
import type { MessageEmbed } from 'discord.js'

export const preparedLiveNotify = (payload: {
  [k: string]: any
}): SendEmbed => {
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
  return {
    content: `ทุกโคนน @everyone, ${
      payload.user_name
    } เค้าไลฟ์อยู่นะ>> https://www.twitch.tv/${payload.user_name.toLowerCase()}`,
    embeds: [embedMessage]
  }
}

export const preparedCoinFlip = (payload: { [k: string]: any }): SendEmbed => {
  let resp: MessageEmbed
  if (payload.win) {
    resp = embedMessageBuilder([
      {
        name: 'ได้รับรางวัล',
        value: `${payload.prize.toString()} Sniffscoin`
      },
      {
        name: 'เหรียญออก',
        value: payload.win_side,
        inline: true
      },
      {
        name: 'เงินคงเหลือ',
        value: `${payload.coin_left.toString()} Sniffscoin`,
        inline: true
      }
    ])
    resp.setTitle(`<${payload.username}>`)
    resp.setDescription('ชนะการทอดเหรียญ')
    resp.setThumbnail(
      'https://static-cdn.jtvnw.net/emoticons/v2/307598973/default/dark/3.0'
    )
  } else {
    resp = embedMessageBuilder([
      {
        name: 'เหรียญออก',
        value: payload.win_side,
        inline: true
      },
      {
        name: 'เงินคงเหลือ',
        value: `${payload.coin_left.toString()} Sniffscoin`,
        inline: true
      }
    ])
    resp.setTitle(`<${payload.username}>`)
    resp.setDescription('เสียใจด้วยนะผีพนัน')
    resp.setThumbnail(
      'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_ed4f0c3c3b2b478488387b3f344a0039/default/dark/3.0'
    )
  }
  return { embeds: [resp] }
}

export const preparedLottoBuy = (payload: { [k: string]: any }): SendEmbed => {
  const resp = embedMessageBuilder([
    {
      name: `<${payload.username}>`,
      value: `ซื้อ SniffsLotto หมายเลข ${payload.lotto.toString()} สำเร็จ`
    }
  ])
  return { embeds: [resp] }
}

export const preparedLottoDraw = (payload: { [k: string]: any }): SendEmbed => {
  let resp: MessageEmbed
  if (Object.entries(payload.usernames)) {
    resp = embedMessageBuilder(
      Object.entries(payload.usernames).map(([username, prize]) => ({
        name: `<${username}>`,
        value: `ได้รับ ${prize} Sniffscoin`,
        inline: true
      }))
    )
  } else {
    resp = embedMessageBuilder([])
  }
  resp
    .setTitle(
      `ประกาศผลรางวัล Sniffscoin ประจำวันที่ ${new Date().toLocaleDateString()}`
    )
    .setDescription(
      `เลขที่ออกได้แก่ ${payload.win_number} รางวัลรวม ${payload.payout} Sniffscoin`
    )
  return { embeds: [resp] }
}
