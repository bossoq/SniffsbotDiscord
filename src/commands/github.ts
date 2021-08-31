import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'

const twitchRepo: string = 'https://github.com/Ponny035/SniffsLiveTwitchBot'
const discordRepo: string = 'https://github.com/bossoq/SniffsbotDiscord'
const webfeedRepo: string = 'https://github.com/bossoq/SniffsbotWebfeed'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Retrieve Github Link!'),
  async execute(interaction: CommandInteraction) {
    if (interaction.channelId === '882101106623283233') {
      interaction.reply(
        `Twitch Bot: ${twitchRepo}\nDiscord Bot: ${discordRepo}\nWebfeed Repo: ${webfeedRepo}`
      )
    }
  }
}
