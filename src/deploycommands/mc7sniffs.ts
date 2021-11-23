import { SlashCommandBuilder } from '@discordjs/builders'
import { ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mc7sniffs')
    .setDescription('Retrieve Minecraft ATM7 Sniffs Server Status!'),
  async execute(interaction: ExtendsInteraction): Promise<void> {}
}
