import { SlashCommandBuilder } from '@discordjs/builders'
import { ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Get NowPlaying'),
  async execute(interaction: ExtendsInteraction): Promise<void> {}
}
