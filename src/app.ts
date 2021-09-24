import fs from 'fs'
import {
  Client,
  Collection,
  Intents,
  Interaction,
  TextChannel
} from 'discord.js'
import { ablyMessage } from './ably'
import { YTHookService } from './youtubehook'
import { guildId, token } from './config.json'
import { Player } from './lib/Player'
import type { SlashCommandBuilder } from '@discordjs/builders'
import type { SendEmbed } from './lib/MessageEmbed'

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>
  }
  interface Command extends NodeModule {
    data: SlashCommandBuilder
    execute(interaction: CommandInteraction): Promise<any>
  }
  interface TextWithEmbed extends TextChannel {
    send(
      options: string | MessagePayload | MessageOptions | SendEmbed
    ): Promise<Message>
  }
}

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
})
client.commands = new Collection()
const commandFiles = fs
  .readdirSync('./src/commands')
  .filter((file) => file.endsWith('.ts'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.data.name, command)
}

export const player = new Player(client)

client.once('ready', () => {
  console.log(`Logged into Discord as ${client.user!.tag}`)
  try {
    ablyMessage()
    console.log('Successfully sub to Ably')
  } catch (error) {
    console.error(`Failed to sub Ably ${error}`)
  }
  try {
    YTHookService()
    console.log('Successfully start YT Webhook')
  } catch (error) {
    console.error('Failed to start YT Webhook')
  }
  setInterval(() => {
    const servers = client.guilds.cache.size
    const servercount = client.guilds.cache.reduce(
      (a, b) => a + b.memberCount,
      0
    )

    const activities = [
      `${servers} servers`,
      `looking ${servercount} members`,
      `uwu I'm stinky`,
      `Watching twitch.tv/sniffslive`
    ]
    const status = activities[Math.floor(Math.random() * activities.length)]
    client!.user!.setPresence({ activities: [{ name: `${status}` }] })
  }, 5000)
})

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) return

  const command = client.commands.get(interaction.commandName)

  if (!command) return

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    })
  }
})

export const sendMessage = async (
  channelId: string,
  message: string | SendEmbed
): Promise<void> => {
  const guild = client.guilds.cache.find((guild) => guild.id === guildId)

  if (!guild) {
    console.warn('Guild not found!')
    return
  }

  const channel: TextChannel = guild.channels.cache.find(
    (channel) => channel.id === channelId
  ) as TextChannel

  if (!channel) {
    console.warn('Channel not found!')
    return
  }

  await channel.send(message)
}

client.login(token)
