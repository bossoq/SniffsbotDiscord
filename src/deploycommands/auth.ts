import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('auth')
    .setDescription('Link your Twitch ID with SniffsBot'),
  async execute(interaction: CommandInteraction): Promise<void> {}
}
