import { Null } from './Utils'
export interface videoDetails {
  thumbnailUrl: string
  title: string
  length: string
  channelId: string
  viewCount: string
  isPrivate: boolean
  author: string
  url: string
}

export class Track {
  thumbnailUrl: Null<string>
  title: Null<string>
  length: Null<string>
  channelId: Null<string>
  viewCount: Null<string>
  isPrivate: Null<boolean>
  author: Null<string>
  url: Null<string>

  constructor(data: videoDetails) {
    this.channelId = data.channelId || null
    this.thumbnailUrl = data.thumbnailUrl || null
    this.viewCount = data.viewCount || null
    this.isPrivate = data.isPrivate || false
    this.length = data.length || null
    this.title = data.title || null
    this.author = data.author || null
    this.url = data.url || null
  }
  get track() {
    return this
  }
}
