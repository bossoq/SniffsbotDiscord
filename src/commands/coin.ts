import got from 'got'
import { SlashCommandBuilder } from '@discordjs/builders'
import { getCoin } from '../lib/supabase'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { embedMessageBuilder } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coin')
    .setDescription('Retrieve Sniffscoin amount!')
    .addStringOption((option) =>
      option
        .setName('twitchid')
        .setDescription('Input Twitch ID')
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    if (interaction.channelId === '882101106623283233') {
      const twitchId: string = interaction.options.getString('twitchid') || ''
      const coin: number | undefined = await getCoin(twitchId.toLowerCase())
      let resp: MessageEmbed
      if (coin) {
        resp = embedMessageBuilder([
          {
            name: `<${twitchId}>`,
            value: `มียอดคงเหลือ ${coin} Sniffscoin`
          }
        ])
      } else {
        resp = embedMessageBuilder([
          {
            name: `<${twitchId}>`,
            value: `ไม่พบ Username นี้ โปรใส่ Twitch Username...`
          }
        ])
      }
      await got.post(
        `https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`,
        {
          json: {
            type: 4,
            data: {
              embeds: [resp],
              flags: 64
            }
          }
        }
      )
    }
  }
}
