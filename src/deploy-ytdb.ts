import { queryYT, insertYT } from './lib/supabase'
import { getAllVideos, VideosMeta } from './lib/YoutubeAPI'
import { ytToken, ytChannelId } from './config.json'

queryYT(1).then((result) => {
  if (result!.length < 2) {
    console.log('Insert Data to YT Table')
    getAllVideos(ytToken, ytChannelId).then((videosMeta: VideosMeta[]) => {
      insertYT(videosMeta).then((response) => {
        if (response.success) {
          console.log('success')
        } else {
          console.error('failed')
        }
      })
    })
  }
})
