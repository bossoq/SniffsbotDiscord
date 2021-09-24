import { sendMessage } from './app'
import { queryYT, insertYT } from './lib/supabase'
import { VideosMeta } from './lib/YoutubeAPI'
import { preparedYTNotify } from './lib/PreparedMessage'
import { announceChannel } from './config.json'
import type { YTFeed } from './youtubehook'

export const checkNewYT = async (newMetas: VideosMeta[]) => {
  let oldMetas = await queryYT(5)
  let metaToInsert: VideosMeta[] = []
  newMetas.forEach(async (newMeta: VideosMeta) => {
    const index = oldMetas?.findIndex((i) => i.id === newMeta.id)
    if (index === -1) {
      metaToInsert.push(newMeta)
      await sendMessage(announceChannel, preparedYTNotify(newMeta))
    }
  })
  if (metaToInsert.length > 0) {
    const response = await insertYT(metaToInsert)
    if (response.success) {
      console.log(`Successfully insert ${response.videosMeta?.length} videos`)
    } else {
      console.log('Failed to insert videos data')
    }
  }
}

export const xmlParser = (ytFeed: YTFeed[]): VideosMeta[] => {
  const metas: VideosMeta[] = []
  ytFeed.forEach((feed) => {
    try {
      const meta: VideosMeta = {
        id: feed['yt:videoid'][0],
        title: feed.title[0],
        description: 'No Description',
        thumbnail: `https://i.ytimg.com/vi/${feed['yt:videoid'][0]}/hqdefault.jpg`,
        live: 'none',
        publishTime: new Date(feed.published[0]),
        channelId: feed['yt:channelid'][0],
        channelTitle: feed.author[0].name[0]
      }
      metas.push(meta)
    } catch (error) {
      console.error(error)
    }
  })
  return metas
}
