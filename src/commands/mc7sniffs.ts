import { SlashCommandBuilder } from '@discordjs/builders'
import axios from 'axios'
import { embedMessageBuilder, ExtendsInteraction } from '../lib/MessageEmbed'
import { mc7sniffs, mc7sniffsport } from '../config.json'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mc7sniffs')
    .setDescription('Retrieve Minecraft ATM7 Sniffs Server Status!'),
  async execute(interaction: ExtendsInteraction): Promise<void> {
    interaction.deferReply({ ephemeral: true })
    const res = await axios.get(
      `https://mcapi.us/server/status?ip=${mc7sniffs}&port=${mc7sniffsport}`
    )
    if (res.data) {
      if (res.data.online) {
        const players = res.data.players.now
        const playersMax = res.data.players.max
        const playersOnline = players + ' / ' + playersMax
        const resp = embedMessageBuilder([
          {
            name: 'Server Address',
            value: `${mc7sniffs}:${mc7sniffsport}`
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
            'https://teopwbuwkgtwnhmddsuj.supabase.in/storage/v1/object/public/sniffsbot-asset/images/atm7.png'
          )
        interaction.editReply({
          embeds: [resp]
        })
      } else {
        const resp = embedMessageBuilder([
          {
            name: 'Server Address',
            value: `${mc7sniffs}:${mc7sniffsport}`
          },
          {
            name: 'Version',
            value: 'Unknown',
            inline: true
          },
          {
            name: 'Status',
            value: 'Offline',
            inline: true
          },
          {
            name: 'Players',
            value: '0 / 0',
            inline: true
          }
        ])
        resp
          .setTitle('Minecraft ATM7 Status')
          .setDescription('Server is offline')
          .setThumbnail(
            'https://teopwbuwkgtwnhmddsuj.supabase.in/storage/v1/object/public/sniffsbot-asset/images/atm7.png'
          )
          .setImage(
            'https://teopwbuwkgtwnhmddsuj.supabase.in/storage/v1/object/public/sniffsbot-asset/images/atm6offline.png'
          )
        interaction.editReply({
          embeds: [resp]
        })
      }
    } else {
      interaction.editReply({
        content: 'ไม่สามารถตรวจสอบสถานะของเซิฟเวอร์ได้'
      })
    }
  }
}
