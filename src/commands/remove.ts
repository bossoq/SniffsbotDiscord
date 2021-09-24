import { SlashCommandBuilder } from '@discordjs/builders'
import { player } from '../app'
import { ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove Song')
    .addIntegerOption((option) =>
      option
        .setName('position')
        .setDescription('Song Position ID')
        .setRequired(true)
    ),
  async execute(interaction: ExtendsInteraction): Promise<void> {
    player.remove(interaction)
  }
}
