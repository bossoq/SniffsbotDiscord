import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Retrieve Github Link!'),
  async execute(interaction: CommandInteraction): Promise<void> {}
}
