import { SlashCommandBuilder } from '@discordjs/builders'
import { player } from '../app'
import { ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Skip Song'),
  async execute(interaction: ExtendsInteraction): Promise<void> {
    player.skip(interaction)
  }
}
