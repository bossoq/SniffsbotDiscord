import fs from 'fs'
import {
  Client,
  Collection,
  Intents,
  Interaction,
  TextChannel
} from 'discord.js'
import { ablyMessage } from './ably'
import { startYTFetch } from './youtube-query'
import { guildId, token } from './config.json'
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
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING
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

client.once('ready', () => {
  console.log(`Logged into Discord as ${client.user!.tag}`)
  try {
    ablyMessage()
    console.log('Successfully sub to Ably')
  } catch (error) {
    console.error(`Failed to sub Ably ${error}`)
  }
  try {
    startYTFetch()
    console.log('Successfully start YT Fetch')
  } catch (error) {
    console.error('Failed to start YT Fetch')
  }
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
