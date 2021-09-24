import { SlashCommandBuilder } from '@discordjs/builders'
import { getLeader } from '../lib/supabase'
import { embedMessageBuilder, ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Retrieve Sniffscoin Leaderboard!'),
  async execute(interaction: ExtendsInteraction): Promise<void> {
    const leaderboard = await getLeader(20)
    if (leaderboard.length) {
      const resp = embedMessageBuilder(
        leaderboard.map((player, idx) => ({
          name: player.User_Name,
          value: player.Coin.toString(),
          inline: idx >= 5
        }))
      )
      resp
        .setTitle('รายชื่อผู้ร่ำรวย Sniffscoin')
        .setDescription('กลุ่มต้าวๆที่ถือครองเหรียญ Sniffs มากที่สุดในขณะนี้')
        .setThumbnail(
          'https://teopwbuwkgtwnhmddsuj.supabase.in/storage/v1/object/public/sniffsbot-asset/images/sniffsbaby.png'
        )
      interaction.reply({
        embeds: [resp],
        ephemeral: true
      })
    } else {
      interaction.reply({
        content: 'ไม่สามารถดึงข้อมูลเหรียญได้',
        ephemeral: true
      })
    }
  }
}
