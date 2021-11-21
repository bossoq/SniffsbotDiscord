import { embedMessageBuilder } from './MessageEmbed'
import type { SendEmbed } from '../lib/MessageEmbed'
import type { MessageEmbed } from 'discord.js'
import type { VideosMeta } from './YoutubeAPI'

const thaiMonth: string[] = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม'
]

const getThaiDateString = () => {
  const now = new Date()
  const day = now.getDate()
  const month = thaiMonth[now.getMonth()]
  const year = now.getFullYear() + 543
  return `${day} ${month} ${year}`
}

export const preparedLiveNotify = (payload: {
  [k: string]: any
}): SendEmbed => {
  const profileImg: string =
    'https://teopwbuwkgtwnhmddsuj.supabase.in/storage/v1/object/public/sniffsbot-asset/images/sniffsprofile.png'
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
    .setAuthor(payload.user_name, profileImg)
    .setThumbnail(profileImg)
    .setImage(
      payload.thumbnail_url.replace('{width}', '320').replace('{height}', '180')
    )
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
    resp.setDescription('ชนะการทอยเหรียญ')
    resp.setThumbnail(
      'https://teopwbuwkgtwnhmddsuj.supabase.in/storage/v1/object/public/sniffsbot-asset/images/sniffsheart.png'
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
      'https://teopwbuwkgtwnhmddsuj.supabase.in/storage/v1/object/public/sniffsbot-asset/images/sniffscry.png'
    )
  }
  return { embeds: [resp] }
}

export const preparedLottoBuy = (payload: { [k: string]: any }): SendEmbed => {
  const resp = embedMessageBuilder([
    {
      name: `<${payload.username}>`,
      value: `ซื้อ SniffsLotto หมายเลข ${payload.lotto.toString()} สำเร็จ (เงินคงเหลือ ${payload.coinleft.toString()} Sniffscoin)`
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
    .setTitle(`ประกาศผลรางวัล SniffsLotto ประจำวันที่ ${getThaiDateString()}`)
    .setDescription(
      `เลขที่ออกได้แก่ ${payload.win_number} รางวัลรวม ${payload.payout} Sniffscoin`
    )
    .setThumbnail(
      'https://teopwbuwkgtwnhmddsuj.supabase.in/storage/v1/object/public/sniffsbot-asset/images/sniffsheart.png'
    )
  return { embeds: [resp] }
}

export const preparedRaffleBuy = (payload: { [k: string]: any }): SendEmbed => {
  const resp = embedMessageBuilder([
    {
      name: `<${payload.username}>`,
      value: `ซื้อตั๋วชิงโชค ${payload.count} ใบสำเร็จ`
    }
  ])
  return { embeds: [resp] }
}

export const preparedRaffleDraw = (payload: {
  [k: string]: any
}): SendEmbed => {
  const resp = embedMessageBuilder([
    {
      name: `<${payload.username}>`,
      value: 'ได้รับรางวัลจากตั๋วชิงโชคคร่าาาา~~'
    }
  ])
  resp
    .setTitle('ประกาศรางวัลจากตั๋วชิงโชค')
    .setThumbnail(
      'https://teopwbuwkgtwnhmddsuj.supabase.in/storage/v1/object/public/sniffsbot-asset/images/sniffsheart.png'
    )
  return { embeds: [resp] }
}

export const preparedYTNotify = (payload: VideosMeta): SendEmbed => {
  const profileImg: string =
    'https://teopwbuwkgtwnhmddsuj.supabase.in/storage/v1/object/public/sniffsbot-asset/images/sniffsprofile.png'
  const youtubeImg: string =
    'https://teopwbuwkgtwnhmddsuj.supabase.in/storage/v1/object/public/sniffsbot-asset/images/youtube.png'
  const embedMessage = embedMessageBuilder([])
  embedMessage
    .setTitle(payload.title || 'YouTube Videos')
    .setURL(`https://www.youtube.com/watch?v=${payload.id}`)
    .setAuthor('YouTube', youtubeImg)
    .setThumbnail(profileImg)
    .setImage(payload.thumbnail || '')
  return {
    content: `นี่ๆ @everyone, SniffsLive ลงคลิปแล้วนะ <3 https://www.youtube.com/watch?v=${payload.id}`,
    embeds: [embedMessage]
  }
}
