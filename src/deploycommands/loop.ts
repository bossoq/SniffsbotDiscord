import { SlashCommandBuilder } from '@discordjs/builders'
import { ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Switch loop on/off'),
  async execute(interaction: ExtendsInteraction): Promise<void> {}
}
