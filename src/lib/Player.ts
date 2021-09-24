import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  NoSubscriberBehavior,
  StreamType
} from '@discordjs/voice'
import ytdl from 'discord-ytdl-core'
import yts from 'yt-search'
import { Queue } from './Queue'
import { Track } from './Tracks'
import type { Client, GuildMember } from 'discord.js'
import type { Filters, Null } from './Utils'
import { embedMessageBuilder, ExtendsInteraction } from './MessageEmbed'

const youtubeImg: string =
  'https://teopwbuwkgtwnhmddsuj.supabase.in/storage/v1/object/public/sniffsbot-asset/images/youtube.png'

const filter = {
  bassboost: 'bass=g=20',
  '8D': 'apulsator=hz=0.09',
  vaporwave: 'aresample=48000,asetrate=48000*0.8',
  nightcore: 'aresample=48000,asetrate=48000*1.25',
  phaser: 'aphaser=in_gain=0.4',
  tremolo: 'tremolo',
  vibrato: 'vibrato=f=6.5',
  reverse: 'areverse',
  treble: 'treble=g=5',
  normalizer: 'dynaudnorm=g=101',
  surrounding: 'surround',
  pulsator: 'apulsator=hz=1',
  subboost: 'asubboost',
  karaoke: 'stereotools=mlev=0.03',
  flanger: 'flanger',
  gate: 'agate',
  haas: 'haas',
  mcompand: 'mcompand',
  mono: 'pan=mono|c0=.5*c0+.5*c1'
}

export class Player {
  playerClient: Client
  playerQueue: Map<string, Queue>
  filterOn: boolean

  constructor(client: Client) {
    this.playerClient = client
    this.playerQueue = new Map()
    this.filterOn = false
  }

  protected _createQueue(
    interaction: ExtendsInteraction,
    track: Track
  ): void | boolean {
    if (!interaction.guildId) return
    const userVC = (interaction.member as GuildMember).voice.channelId
    const botVC = interaction.guild?.me?.voice.channelId
    let connection = getVoiceConnection(interaction.guildId)
    const connectionStatus = connection?.state.status
    if (!userVC) {
      interaction.reply({
        content: '❌ | **You must be in a voice channel to play something!**',
        ephemeral: true
      })
      return
    }
    if (!connection || !connectionStatus || botVC !== userVC) {
      connection = joinVoiceChannel({
        channelId: userVC,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild!.voiceAdapterCreator
      })
    }
    const q = this.playerQueue.get(interaction.guildId)
    if (!q) {
      const queue = new Queue(track)
      queue.voiceConnection = connection!
      queue.interaction.push(interaction)
      this.playerQueue.set(interaction.guildId, queue)
      this._playTrack(queue)
    } else {
      q.tracks.push(track)
      q.interaction.push(interaction)
      if (q.voiceConnection?.state.status === 'destroyed') {
        q.voiceConnection = connection
        this._playTrack(q)
      }
    }
    const message = embedMessageBuilder([])
    message
      .setTitle(track.title!)
      .setURL(track.url!)
      .setAuthor('Queue Added!', youtubeImg)
      .setImage(track.thumbnailUrl!)
    interaction.reply({
      embeds: [message],
      ephemeral: true
    })
  }

  getQueue(interaction: ExtendsInteraction): void | boolean {
    if (!interaction) return
    const q = this.playerQueue.get(interaction.guildId!)
    if (!q) {
      interaction.reply({
        content: 'There is no song in queue.',
        ephemeral: true
      })
    } else {
      const message = embedMessageBuilder([])
      q.tracks.map((track, idx) => {
        if (idx === 0) {
          message.addField(`NowPlaying 📀 ${track.title}`, track.author!)
        } else {
          message.addField(`${idx}. ${track.title}`, track.author!)
        }
      })
      message
        .setTitle('Song Queue')
        .setAuthor('Sniifsbot Youtube Player', youtubeImg)
      interaction.reply({
        embeds: [message],
        ephemeral: true
      })
    }
  }

  async play(interaction: ExtendsInteraction): Promise<void | boolean> {
    if (!interaction) return
    let songUrl: string
    const inputSong = interaction.options.getString('song')!
    if (
      inputSong.includes('https://') &&
      (inputSong.includes('youtube.com') || inputSong.includes('youtu.be'))
    ) {
      songUrl = inputSong
    } else {
      return
    }
    const resp = await ytdl.getBasicInfo(songUrl)
    const streamObj = {
      title: resp.videoDetails.title,
      length: resp.videoDetails.lengthSeconds,
      isPrivate: resp.videoDetails.isPrivate,
      channelId: resp.videoDetails.channelId,
      thumbnailUrl: resp.videoDetails.thumbnails[0].url,
      viewCount: resp.videoDetails.viewCount,
      author: resp.videoDetails.author.name,
      url: resp.videoDetails.video_url
    }
    const track = new Track(streamObj).track
    this._createQueue(interaction, track)
  }

  protected _playTrack(queue: Queue): void | boolean {
    if (
      queue.interaction[0] &&
      !(queue.interaction[0].member as GuildMember).voice.channel
    )
      return
    if (!queue.voiceConnection) return
    if (queue.tracks.length <= 0) {
      queue.voiceConnection.destroy()
      return
    }

    const encoderArgsFilters: Array<string> = []
    Object.entries(queue.filters).forEach(([key, value]) => {
      if (value) {
        encoderArgsFilters.push(filter[key as keyof typeof filter])
      }
    })
    let encoderArgs: Array<string> = []
    if (encoderArgsFilters.length > 0) {
      encoderArgs = ['-af', encoderArgsFilters.join(',')]
    }
    if (queue.tracks[0].url) {
      const stream = ytdl(queue.tracks[0].url, {
        filter: 'audioonly',
        opusEncoded: true,
        highWaterMark: 1 << 25,
        encoderArgs
      })
      if (queue.stream) {
        queue.stream.destroy()
      }
      queue.stream = stream
      const resource = createAudioResource(queue.stream, {
        inputType: StreamType.Opus
      })
      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause
        }
      })
      queue.player = player
      queue.voiceConnection.subscribe(player)
      player.play(resource)
      const message = embedMessageBuilder([])
      message
        .setTitle(queue.tracks[0].title!)
        .setURL(queue.tracks[0].url!)
        .setAuthor('Now Playing!', youtubeImg)
        .setImage(queue.tracks[0].thumbnailUrl!)
      try {
        queue.interaction[0].followUp({
          embeds: [message],
          ephemeral: true
        })
      } catch (err) {
        console.error(err)
      }
      player.on(AudioPlayerStatus.Idle, () => {
        nextSong()
      })
      const nextSong = () => {
        if (queue.loop === false) {
          queue.tracks.splice(0, 1)
          queue.interaction.splice(0, 1)
        }
        return this._playTrack(queue)
      }
    }
  }

  clear(interaction: ExtendsInteraction): void | boolean {
    if (!interaction) return
    const q = this.playerQueue.get(interaction.guildId!)
    if (!q) {
      interaction.reply({
        content: 'There is no song in queue.',
        ephemeral: true
      })
      return
    } else {
      q.tracks.splice(0, q.tracks.length)
      q.interaction.splice(0, q.interaction.length)
      interaction.reply({
        content: 'Clear song queue successfully!',
        ephemeral: true
      })
      return
    }
  }

  remove(interaction: ExtendsInteraction): void | boolean {
    if (!interaction) return
    const position = interaction.options.getInteger('position')!
    const q = this.playerQueue.get(interaction.guildId!)
    if (!q) {
      interaction.reply({
        content: 'There is no song in queue.',
        ephemeral: true
      })
      return
    } else {
      q.tracks.splice(position, 1)
      q.interaction.splice(position, 1)
      interaction.reply({
        content: `Remove Song ${position} from queue!`,
        ephemeral: true
      })
      return
    }
  }

  pause(interaction: ExtendsInteraction): void | boolean {
    if (!interaction) return
    const q = this.playerQueue.get(interaction.guildId!)
    if (!q) {
      interaction.reply({
        content: 'There is now playing.',
        ephemeral: true
      })
      return
    } else {
      if (!q.paused) {
        q.player.pause()
        q.paused = true
      }
      interaction.reply({
        content: 'Pause song successfully!',
        ephemeral: true
      })
      return
    }
  }

  resume(interaction: ExtendsInteraction): void | boolean {
    if (!interaction) return
    const q = this.playerQueue.get(interaction.guildId!)
    if (!q) {
      interaction.reply({
        content: 'There is no paused song.',
        ephemeral: true
      })
      return
    } else {
      if (q.paused) {
        q.player.unpause()
        q.paused = false
      }
      interaction.reply({
        content: 'Resume song successfully!',
        ephemeral: true
      })
      return
    }
  }

  stop(interaction: ExtendsInteraction): void | boolean {
    if (!interaction) return
    const q = this.playerQueue.get(interaction.guildId!)
    if (!q) {
      interaction.reply({
        content: 'There is no song in queue.',
        ephemeral: true
      })
      return
    } else {
      q.player.stop()
      q.voiceConnection?.destroy()
      interaction.reply({
        content: 'Stop song successfully!',
        ephemeral: true
      })
      return
    }
  }

  nowPlaying(interaction: ExtendsInteraction): void | boolean {
    if (!interaction) return
    const q = this.playerQueue.get(interaction.guildId!)
    if (!q) {
      interaction.reply({
        content: 'There is no song in queue.',
        ephemeral: true
      })
      return
    } else {
      const message = embedMessageBuilder([])
      message
        .setTitle(q.tracks[0].title!)
        .setURL(q.tracks[0].url!)
        .setAuthor('Now Playing!', youtubeImg)
        .setImage(q.tracks[0].thumbnailUrl!)
      interaction.reply({
        embeds: [message],
        ephemeral: true
      })
    }
  }

  skip(interaction: ExtendsInteraction): void | boolean {
    if (!interaction) return
    const q = this.playerQueue.get(interaction.guildId!)
    if (!q) {
      interaction.reply({
        content: 'There is no song in queue.',
        ephemeral: true
      })
      return
    } else {
      q.player.stop()
      q.tracks.splice(0, 1)
      q.interaction.splice(0, 1)
      this._playTrack(q)
      interaction.reply({
        content: 'Song skip!',
        ephemeral: true
      })
      return
    }
  }

  setLoopMode(interaction: ExtendsInteraction): void | boolean {
    if (!interaction) return
    const q = this.playerQueue.get(interaction.guildId!)
    if (!q) {
      interaction.reply({
        content: 'There is no song in queue.',
        ephemeral: true
      })
      return
    } else {
      if (q.loop) {
        q.loop = false
        interaction.reply({
          content: 'Turn off loop mode!',
          ephemeral: true
        })
        return
      } else {
        q.loop = true
        interaction.reply({
          content: 'Turn on loop mode!',
          ephemeral: true
        })
        return
      }
    }
  }

  setFilter(interaction: ExtendsInteraction): void | boolean {
    const data = ['bassboost', 'nightcore', 'tremolo']
    if (!interaction) return
    const q = this.playerQueue.get(interaction.guildId!)
    if (!q) {
      interaction.reply({
        content: 'There is no song in queue.',
        ephemeral: true
      })
      return
    } else {
      if (q.filters) {
        data.forEach((filter) => {
          q.filters[filter as keyof typeof q.filters] =
            !q.filters[filter as keyof typeof q.filters]
        })
        if (this.filterOn) {
          this.filterOn = !this.filterOn
          interaction.reply({
            content: 'Turn off filter!',
            ephemeral: true
          })
          return
        } else {
          this.filterOn = !this.filterOn
          interaction.reply({
            content: 'Apply filter!',
            ephemeral: true
          })
          return
        }
      }
    }
  }
}
