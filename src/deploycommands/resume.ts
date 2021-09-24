import { SlashCommandBuilder } from '@discordjs/builders'
import { ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume Song'),
  async execute(interaction: ExtendsInteraction): Promise<void> {}
}
