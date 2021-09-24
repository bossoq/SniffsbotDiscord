import { SlashCommandBuilder } from '@discordjs/builders'
import { ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear Song Queue'),
  async execute(interaction: ExtendsInteraction): Promise<void> {}
}
