import { SlashCommandBuilder } from '@discordjs/builders'
import { player } from '../app'
import { ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('List song queue.'),
  async execute(interaction: ExtendsInteraction): Promise<void> {
    player.getQueue(interaction)
  }
}
