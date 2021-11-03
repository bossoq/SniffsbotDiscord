import { SlashCommandBuilder } from '@discordjs/builders'
import { ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mc6')
    .setDescription('Retrieve Minecraft ATM6 Server Status!'),
  async execute(interaction: ExtendsInteraction): Promise<void> {}
}
