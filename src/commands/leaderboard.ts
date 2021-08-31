import got from 'got'
import { SlashCommandBuilder } from '@discordjs/builders'
import { getLeader } from '../lib/supabase'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { embedMessageBuilder } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Retrieve Sniffscoin amount!'),
  async execute(interaction: CommandInteraction) {
    if (interaction.channelId === '882101106623283233') {
      const leaderboard = await getLeader(20)
      if (leaderboard.length) {
        const resp = embedMessageBuilder(
          leaderboard.map((player, idx) => ({
            name: player.User_Name,
            value: player.Coin.toString(),
            inline: idx >= 5
          }))
        )
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
      } else {
        interaction.reply('ไม่สามารถดึงข้อมูลเหรียญได้')
      }
    }
  }
}
