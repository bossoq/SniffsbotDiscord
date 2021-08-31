import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

type LinkName = {
  name: string
  link: string
}

const twitchRepo: LinkName = {
  name: 'SniffsLiveTwitchBot',
  link: 'https://github.com/Ponny035/SniffsLiveTwitchBot'
}
const discordRepo: LinkName = {
  name: 'SniffsbotDiscord',
  link: 'https://github.com/bossoq/SniffsbotDiscord'
}
const webfeedRepo: LinkName = {
  name: 'SniffsbotWebfeed',
  link: 'https://github.com/bossoq/SniffsbotWebfeed'
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Retrieve Github Link!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    interaction.reply({
      content: `Twitch Bot: [${twitchRepo.name}](${twitchRepo.link})\nDiscord Bot: [${discordRepo.name}](${discordRepo.link})\nWebfeed Repo: [${webfeedRepo.name}](${webfeedRepo.link})`,
      embeds: [],
      ephemeral: true
    })
  }
}
