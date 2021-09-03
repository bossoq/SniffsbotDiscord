import express from 'express'
import xmlparser from 'express-xml-bodyparser'
import { checkNewYT, xmlParser } from './youtube-query'

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
          const videosMeta = xmlParser(ytFeed)
          checkNewYT(videosMeta)
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
