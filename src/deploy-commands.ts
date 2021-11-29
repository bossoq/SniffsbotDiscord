import fs from 'fs'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { clientId, guildId, token } from './config.json'
import { SlashCommandBuilder } from '@discordjs/builders'
import { BaseCommandInteraction } from 'discord.js'

interface Command {
  data: SlashCommandBuilder
  execute(interaction: BaseCommandInteraction): Promise<void>
}

const commands: Record<string, any>[] = []
const commandFiles: string[] = fs
  .readdirSync('./src/deploycommands')
  .filter((file) => file.endsWith('.ts'))

for (const file of commandFiles) {
  const command: Command = require(`./deploycommands/${file}`)
  commands.push(command.data.toJSON())
}

const rest = new REST({ version: '9' }).setToken(token)

;(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands
    })
    console.log('Successfully registered application commands.')
  } catch (error) {
    console.error(error)
  }
})()
