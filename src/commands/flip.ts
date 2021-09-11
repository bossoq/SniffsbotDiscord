import { SlashCommandBuilder } from '@discordjs/builders'
import { getCoin, queryTwitch, insertCoin } from '../lib/supabase'
import { CommandInteraction } from 'discord.js'
import { SendEmbed } from '../lib/MessageEmbed'
import { preparedCoinFlip } from '../lib/PreparedMessage'
import { ably } from '../lib/AblySub'
import { fliprate, flipthreshold } from '../config.json'

interface ExtendsInteraction extends CommandInteraction {
  reply(options: SendEmbed | any): Promise<void | any>
}

const winFeed =
  '<span class="tag is-info has-text-weight-bold ml-2 mr-2 is-medium">{username}</span><span class="text-white">ได้รับ {prize} Sniffscoin <span class="icon"><i class="fas fa-hand-holding-usd"></i></span> Coinflip ออก{win_side} ({coin_left})</span>'
const lossFeed =
  '<span class="tag is-danger has-text-weight-bold ml-2 mr-2 is-medium">{username}</span><span class="text-white">เสียใจด้วยนะ Coinflip ออก{win_side} ({coin_left})</span>'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flip')
    .setDescription('Guess flip coin with h or t')
    .addStringOption((option) =>
      option.setName('side').setDescription('Input h or t').setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('coin')
        .setDescription('Input number of coin to use')
        .setRequired(true)
    ),
  async execute(interaction: ExtendsInteraction): Promise<void> {
    const discordId = interaction.member?.user.id
    const side = interaction.options.getString('side')?.toLowerCase() || ''
    const playCoin = interaction.options.getInteger('coin') || 1
    const userInfo = await queryTwitch(discordId)
    if (!['h', 't'].includes(side)) {
      interaction.reply({
        content: 'ใส่ด้านเหรียญที่จะทอยเป็น h หรือ t เท่านั้นนะ',
        ephemeral: true
      })
      return
    }
    if (userInfo) {
      const twitchId = userInfo.twitchId
      if (twitchId) {
        const userCoin = await getCoin(twitchId.toLowerCase())
        if (userCoin && userCoin > playCoin) {
          const flip = ['h', 't']
          const flipRand =
            Math.floor(
              Math.random() * (playCoin > flipthreshold ? fliprate : 100)
            ) > fliprate
          const tossResult = String(
            flip.find((toss) => (flipRand ? toss === side : toss !== side))
          )
          const coinLeft = flipRand ? userCoin + playCoin : userCoin - playCoin
          const channel = ably.channels.get('webfeed')
          const response = await insertCoin({
            User_Name: twitchId,
            Coin: coinLeft
          })
          if (!response.success) return
          if (flipRand) {
            channel.publish(
              'webfeed',
              winFeed
                .replace('{username}', twitchId)
                .replace('{prize}', (playCoin * 2).toString())
                .replace('{win_side}', flipRand ? 'หัว' : 'ก้อย')
                .replace('{coin_left}', coinLeft.toString())
            )
          } else {
            channel.publish(
              'webfeed',
              lossFeed
                .replace('{username}', twitchId)
                .replace('{win_side}', flipRand ? 'หัว' : 'ก้อย')
                .replace('{coin_left}', coinLeft.toString())
            )
          }
          const payload = {
            username: twitchId,
            win_side: flipRand ? 'หัว' : 'ก้อย',
            coin_left: coinLeft,
            win: tossResult === side,
            prize: playCoin * 2
          }
          channel.publish('coinflip', JSON.stringify(payload))
          const { embeds } = preparedCoinFlip(payload)
          interaction.reply({
            embeds,
            ephemeral: true
          })
        } else {
          interaction.reply({
            content: 'ไม่มีเงินแล้วยังจะเล่นอีก',
            ephemeral: true
          })
        }
      } else {
        interaction.reply({
          content:
            'ยังผูก Twitch ID กับ SniffsBot ไม่สมบูรณ์นะ ใช้คำสั่ง /auth อีกครั้ง',
          ephemeral: true
        })
      }
    } else {
      interaction.reply({
        content: 'ยังไม่ได้ผูก Twitch ID กับ SniffsBot เลย ใช้คำสั่ง /auth นะ',
        ephemeral: true
      })
    }
  }
}
