import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { OAuth2Routes } from 'discord-api-types/v9'
import { randomBytes } from 'crypto'
import { queryTwitch, insertTwitch } from '../lib/supabase'
import { clientId, callbackUrl } from '../config.json'

const baseUrl: string = `${
  OAuth2Routes.authorizationURL
}?response_type=code&client_id=${clientId}&scope=identify%20connections&state={state}&redirect_uri=${encodeURIComponent(
  callbackUrl
)}&prompt=consent`

module.exports = {
  data: new SlashCommandBuilder()
    .setName('auth')
    .setDescription('Link your Twitch ID with SniffsBot'),
  async execute(interaction: CommandInteraction): Promise<void> {
    const discordId = interaction.member?.user.id
    const state = randomBytes(20).toString('hex') + discordId
    const userData = await queryTwitch(discordId)
    if (!userData?.twitchId) {
      const response = await insertTwitch({ discordId, state })
      if (response.success) {
        interaction.reply({
          content: `[คลิกที่นี่เพื่อเชื่อมต่อบัญชี Twitch กับ SniffsBot](${baseUrl.replace(
            '{state}',
            state
          )})`,
          ephemeral: true
        })
      } else {
        interaction.reply({
          content: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้ ลองอีกครั้งทีหลังนะ',
          ephemeral: true
        })
      }
    } else {
      interaction.reply({
        content: `เชื่อมต่อกับ Twitch ID: ${userData.twitchId} แล้วน้าาาา`,
        ephemeral: true
      })
    }
  }
}
