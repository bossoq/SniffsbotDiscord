import { SlashCommandBuilder } from '@discordjs/builders'
import axios from 'axios'
import { embedMessageBuilder, ExtendsInteraction } from '../lib/MessageEmbed'
import { mc7, mc7port } from '../config.json'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mc7')
    .setDescription('Retrieve Minecraft ATM7 Server Status!'),
  async execute(interaction: ExtendsInteraction): Promise<void> {
    const res = await axios.get(
      `https://mcapi.us/server/status?ip=${mc7}&port=${mc7port}`
    )
    if (res.data) {
      if (res.data.online) {
        const players = res.data.players.now
        const playersMax = res.data.players.max
        const playersOnline = players + ' / ' + playersMax
        const resp = embedMessageBuilder([
          {
            name: 'Server Address',
            value: `${mc7}:${mc7port}`
          },
          {
            name: 'Version',
            value: res.data.server.name,
            inline: true
          },
          {
            name: 'Status',
            value: res.data.online ? 'Online' : 'Offline',
            inline: true
          },
          {
            name: 'Players',
            value: playersOnline,
            inline: true
          }
        ])
        resp
          .setTitle('Minecraft ATM7 Status')
          .setDescription(res.data.motd)
          .setThumbnail(
            'https://teopwbuwkgtwnhmddsuj.supabase.in/storage/v1/object/public/sniffsbot-asset/images/sniffsbaby.png'
          )
        interaction.reply({
          embeds: [resp],
          ephemeral: true
        })
      } else {
        interaction.reply({
          content: 'Minecraft ATM7 ออฟไลน์',
          ephemeral: true
        })
      }
    } else {
      interaction.reply({
        content: 'ไม่สามารถตรวจสอบสถานะของเซิฟเวอร์ได้',
        ephemeral: true
      })
    }
  }
}
