import express from 'express'
import xmlparser from 'express-xml-bodyparser'
import { sendMessage } from './app'
import { preparedYTNotify } from './lib/PreparedMessage'
import { announceChannel } from './config.json'
import type { VideosMeta } from './lib/YoutubeAPI'

export interface YTFeed {
  id: string[]
  'yt:videoid': string[]
  'yt:channelid': string[]
  title: string[]
  link: {
    $: {
      rel: string
      href: string
    }
  }[]
  author: {
    name: string[]
    uri: string[]
  }[]
  published: string[]
  updated: string[]
}

const port: number = 9876

export const YTHookService = () => {
  const app = express()

  app.get('/ytsub', ({ query: { 'hub.challenge': challenge } }, res) => {
    console.log(`Youtube PubSubHubBub Challenge is: ${challenge}`)
    res.status(200).end(challenge)
  })

  app.post(
    '/ytsub',
    xmlparser({ trim: false, explicitArray: true }),
    (req, res) => {
      if (req.body) {
        const ytFeed: YTFeed[] = req.body.feed.entry
        if (ytFeed) {
          sendYTNotify(ytFeed)
        }
        res.status(204).end()
      } else {
        console.log('YT PubSubHubBub Error')
        res.status(204).end()
      }
    }
  )
  try {
    app.listen(port)
    console.log(`Successfully start Express Server on ${port}`)
  } catch (error) {
    console.error(`Failed to start Express Server ${error}`)
  }
}

const sendYTNotify = async (ytFeed: YTFeed[]) => {
  try {
    const meta: VideosMeta = {
      id: ytFeed[0]['yt:videoid'][0],
      title: ytFeed[0].title[0],
      description: 'No Description',
      thumbnail: `https://i.ytimg.com/vi/${ytFeed[0]['yt:videoid'][0]}/hqdefault.jpg`,
      live: 'none',
      publishTime: new Date(ytFeed[0].published[0]),
      channelId: ytFeed[0]['yt:channelid'][0],
      channelTitle: ytFeed[0].author[0].name[0]
    }
    await sendMessage(announceChannel, preparedYTNotify(meta))
  } catch (error) {
    console.error(error)
  }
}
