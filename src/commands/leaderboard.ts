import { SlashCommandBuilder } from '@discordjs/builders'
import { getLeader } from '../lib/supabase'
import { CommandInteraction } from 'discord.js'
import { embedMessageBuilder, SendEmbed } from '../lib/MessageEmbed'
import { allowChannel } from '../config.json'

interface ExtendsInteraction extends CommandInteraction {
  reply(options: SendEmbed | any): Promise<void | any>
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Retrieve Sniffscoin Leaderboard!'),
  async execute(interaction: ExtendsInteraction): Promise<void> {
    if (interaction.channelId === allowChannel) {
      const leaderboard = await getLeader(20)
      if (leaderboard.length) {
        const resp = embedMessageBuilder(
          leaderboard.map((player, idx) => ({
            name: player.User_Name,
            value: player.Coin.toString(),
            inline: idx >= 5
          }))
        )
        resp.setTitle('รายชื่อผู้ร่ำรวย Sniffscoin')
        resp.setDescription(
          'กลุ่มต้าวๆที่ถือครองเหรียญ Sniffs มากที่สุดในขณะนี้'
        )
        resp.setThumbnail(
          'https://static-cdn.jtvnw.net/emoticons/v2/308087262/default/dark/3.0'
        )
        interaction.reply({
          embeds: [resp]
        })
      } else {
        interaction.reply('ไม่สามารถดึงข้อมูลเหรียญได้')
      }
    }
  }
}
