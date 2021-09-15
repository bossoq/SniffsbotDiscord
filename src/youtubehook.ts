import express from 'express'
import xmlparser from 'express-xml-bodyparser'
import { sendMessage } from './app'
import { preparedYTNotify } from './lib/PreparedMessage'
import axios from 'axios'
import { URLSearchParams } from 'url'
import cron from 'node-cron'
import { REST } from '@discordjs/rest'
import { OAuth2Routes, Routes } from 'discord-api-types/v9'
import { queryTwitch, insertTwitch } from './lib/supabase'
import {
  announceChannel,
  clientId,
  clientSecret,
  callbackUrl,
  ytChannelId,
  ytCallbackUrl
} from './config.json'
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

const requestPubSub = async () => {
  const params = new URLSearchParams()
  params.append('hub.callback', ytCallbackUrl)
  params.append(
    'hub.topic',
    `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${ytChannelId}`
  )
  params.append('hub.verify', 'async')
  params.append('hub.mode', 'subscribe')
  params.append('hub.verify_token', '')
  params.append('hub.secret', '')
  params.append('hub.lease_seconds', String(60 * 60 * 24 * 10)) // expire in 10 days
  const response = await axios.post(
    'https://pubsubhubbub.appspot.com/subscribe',
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    }
  )
  if (response.status === 202) {
    console.log('Successfully Registered with PubSub service')
  } else {
    console.error('There is a problem registering with PubSub service')
    await requestPubSub()
  }
}

const pubSubCron = cron.schedule('0 0 * * 0', async () => {
  console.log('Refreshing PubSub')
  await requestPubSub()
})

export const YTHookService = async () => {
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

  app.get('/twitchlink', async (req, res) => {
    const code = String(req.query.code)
    const state = String(req.query.state)
    const discordId = String(req.query.state).slice(40)
    const dbTwitch = await queryTwitch(discordId)
    if (dbTwitch) {
      if (state === dbTwitch.state) {
        const params = new URLSearchParams()
        params.append('client_id', clientId)
        params.append('client_secret', clientSecret)
        params.append('grant_type', 'authorization_code')
        params.append('code', code)
        params.append('redirect_uri', callbackUrl)
        const response = await axios.post(OAuth2Routes.tokenURL, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }
        })
        const authToken = response.data.access_token
        const refreshToken = response.data.refresh_token
        const rest = new REST({ version: '9' }).setToken(authToken)
        const connections = await rest.get(Routes.userConnections(), {
          authPrefix: 'Bearer'
        })
        const twitchData = (connections as Record<string, any>[]).find(
          (connection) => connection.type === 'twitch'
        )
        if (twitchData) {
          const twitchId = twitchData.name.toLowerCase()
          const response = await insertTwitch({
            discordId,
            twitchId,
            state,
            code,
            authToken,
            refreshToken
          })
          if (response.success) {
            res.send(
              '<p>Succesfully connect your twitch account to SniffsBot<br>You can now close this windows</p>'
            )
          } else {
            res
              .status(503)
              .send('<p>Please try again later (dbError: code 2)</p>')
          }
        } else {
          res.send('<p>There is no Twitch connection in your Discord ID')
        }
      } else {
        res.status(403).send('<p>Invalid State Token</p>')
      }
    } else {
      res.status(503).send('<p>Please try again later (dbError: code 1)</p>')
    }
  })

  try {
    app.listen(port)
    console.log(`Successfully start Express Server on ${port}`)
    try {
      await requestPubSub()
      pubSubCron.start()
      console.log('Start PubSub Cron')
    } catch (error) {
      console.error(`Failed to register PubSub ${error}`)
    }
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
