import fs from 'fs'
import { Client, Collection, Intents, Interaction } from 'discord.js'
import { token } from './config.json'
import { SlashCommandBuilder } from '@discordjs/builders'

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>
  }
  interface Command extends NodeModule {
    data: SlashCommandBuilder
    execute(interaction: CommandInteraction): Promise<any>
  }
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
client.commands = new Collection()
const commandFiles = fs
  .readdirSync('./src/commands')
  .filter((file) => file.endsWith('.ts'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.data.name, command)
}

client.once('ready', () => {
  console.log('Ready!')
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

client.login(token)
