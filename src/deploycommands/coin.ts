import { SlashCommandBuilder } from '@discordjs/builders'
import { ExtendsInteraction } from '../lib/MessageEmbed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coin')
    .setDescription('Retrieve Sniffscoin amount!')
    .addStringOption((option) =>
      option
        .setName('twitchid')
        .setDescription('Input Twitch ID')
        .setRequired(false)
    ),
  async execute(interaction: ExtendsInteraction): Promise<void> {}
}
