import { SlashCommandBuilder } from '@discordjs/builders'
import { ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mc7')
    .setDescription('Retrieve Minecraft ATM7 Server Status!'),
  async execute(interaction: ExtendsInteraction): Promise<void> {}
}
