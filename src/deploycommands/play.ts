import { SlashCommandBuilder } from '@discordjs/builders'
import { ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Request Song')
    .addStringOption((option) =>
      option
        .setName('song')
        .setDescription('Song Name or Youtube URL')
        .setRequired(true)
    ),
  async execute(interaction: ExtendsInteraction): Promise<void> {}
}
