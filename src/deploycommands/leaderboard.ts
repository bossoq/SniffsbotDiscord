import { SlashCommandBuilder } from '@discordjs/builders'
import { ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Retrieve Sniffscoin Leaderboard!'),
  async execute(interaction: ExtendsInteraction): Promise<void> {}
}
