import { SlashCommandBuilder } from '@discordjs/builders'
import { getCoin } from '../lib/supabase'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { embedMessageBuilder, SendEmbed } from '../lib/MessageEmbed'
import { allowChannel } from '../config.json'

interface ExtendsInteraction extends CommandInteraction {
  reply(options: SendEmbed | any): Promise<void | any>
}

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
  async execute(interaction: ExtendsInteraction): Promise<void> {
    if (interaction.channelId === allowChannel) {
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
      interaction.reply({
        embeds: [resp]
      })
    }
  }
}
