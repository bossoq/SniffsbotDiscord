import fs from 'fs'
import {
  Client,
  Collection,
  Intents,
  Interaction,
  TextChannel
} from 'discord.js'
import { subMessage } from './lib/AblySub'
import { guildId, token, announceChannel, allowChannel } from './config.json'
import {
  preparedLiveNotify,
  preparedCoinFlip,
  preparedLottoBuy,
  preparedLottoDraw,
  preparedRaffleBuy,
  preparedRaffleDraw
} from './lib/PreparedMessage'
import type { SlashCommandBuilder } from '@discordjs/builders'
import type { Types } from 'ably'
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

const sendMessage = async (
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

subMessage('webfeed', async (message: Types.Message) => {
  switch (message.name) {
    case 'livemessage':
      await sendMessage(
        announceChannel,
        preparedLiveNotify(JSON.parse(message.data))
      )
      break
    case 'coinflip':
      await sendMessage(
        allowChannel,
        preparedCoinFlip(JSON.parse(message.data))
      )
      break
    case 'lottobuy':
      await sendMessage(
        allowChannel,
        preparedLottoBuy(JSON.parse(message.data))
      )
      break
    case 'lottodraw':
      await sendMessage(
        allowChannel,
        preparedLottoDraw(JSON.parse(message.data))
      )
      break
    case 'rafflebuy':
      await sendMessage(
        allowChannel,
        preparedRaffleBuy(JSON.parse(message.data))
      )
      break
    case 'raffledraw':
      await sendMessage(
        allowChannel,
        preparedRaffleDraw(JSON.parse(message.data))
      )
      break
    default:
      break
  }
})

client.on("ready",async()=>{
  let servers = await client.guilds.cache.size
  let servercount = await client.guilds.cache.reduce((a,b) => a+b.memberCount, 0)

  const activities = [
    `${servers} servers`
    `looking ${servercount} members`
    `uwu I'm stinky`
    `Watching twitch.tv/sinffslive`
  ]
  setInterval(()=>{
    const status = activities[Math.floor(Math.random()*activities.length)]
    client.user.setPresence({activities: [ {name: `${status}` }]})
  }, 5000)
  }) 

  function setInterval(arg0: any) {
  throw new Error('Function not implemented.')
  }
