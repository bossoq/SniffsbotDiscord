import { MessageEmbed } from 'discord.js'

type Message = {
  name: string
  value: string
  inline?: boolean
}

export type SendEmbed = {
  content?: string
  embeds: MessageEmbed[]
  ephemeral?: boolean
}

const footer: string =
  'Contribute @ github: https://github.com/bossoq/SniffsbotDiscord'

export const embedMessageBuilder = (messages: Message[]): MessageEmbed => {
  const embedMessage = new MessageEmbed().setFooter(footer)
  messages.forEach((message: Message) => {
    embedMessage.addField(message.name, message.value, message.inline)
  })
  return embedMessage
}
