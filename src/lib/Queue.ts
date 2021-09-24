import { VoiceConnection } from '@discordjs/voice'
import { SelectMenuInteraction } from 'discord.js'
import { ExtendsInteraction } from './MessageEmbed'
import { Track } from './Tracks'
import { Null, Filters } from './Utils'

export class Queue {
  tracks: Track[] = []
  voiceConnection: Null<VoiceConnection> = null
  stream: any
  player: any
  interaction: (ExtendsInteraction | SelectMenuInteraction)[] = []
  url: Null<string> = null
  volume: number = 100
  paused: boolean = false
  loop: boolean = false
  filters: Filters = {}

  constructor(track: Track) {
    this.tracks.push(track)
  }
  get queue() {
    return this
  }
}
