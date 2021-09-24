import { SlashCommandBuilder } from '@discordjs/builders'
import { player } from '../app'
import { ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder().setName('stop').setDescription('Stop Song'),
  async execute(interaction: ExtendsInteraction): Promise<void> {
    player.stop(interaction)
  }
}
