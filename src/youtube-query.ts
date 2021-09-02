import { sendMessage } from './app'
import { queryYT, insertYT } from './lib/supabase'
import { getLatestUpdate, VideosMeta } from './lib/YoutubeAPI'
import { preparedYTNotify } from './lib/PreparedMessage'
import { announceChannel, ytToken, ytChannelId } from './config.json'

export const startYTFetch = async () => {
  let oldMetas = await queryYT(5)
  setInterval(async () => {
    let metaToInsert: VideosMeta[] = []
    let newMetas = await getLatestUpdate(ytToken, ytChannelId)
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
        oldMetas = await queryYT(5)
      } else {
        console.log('Failed to insert videos data')
      }
    }
  }, 10 * 60 * 1000)
}
