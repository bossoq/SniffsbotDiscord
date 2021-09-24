import { SlashCommandBuilder } from '@discordjs/builders'
import { ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flip')
    .setDescription('Guess flip coin with h or t')
    .addStringOption((option) =>
      option.setName('side').setDescription('Input h or t').setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('coin')
        .setDescription('Input number of coin to use')
        .setRequired(true)
    ),
  async execute(interaction: ExtendsInteraction): Promise<void> {}
}
